const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createProblem = async (req, res) => {
  const { 
    title, description, difficulty, tags,
    visibleTestCases, hiddenTestCases, startCode, driverCode,
    referenceSolution
  } = req.body;

  try {
    let totalSuccessfulMatches = 0;
    let expectedTotalMatches = 0;

    for (const { lang, before, after } of driverCode) {
      for (const { language, completeCode } of referenceSolution) {
        if (lang.toLowerCase() !== language.toLowerCase()) {
          continue;
        }

        // Increment expected match count for each language runtime matched
        expectedTotalMatches += visibleTestCases.length;

        const solution = before + completeCode + after;
        // console.log(solution)
        const languageId = getLanguageById(language);

        // Create Batch submission with Base64 encoding
        const submissions = visibleTestCases.map((testcase) => ({
          source_code: Buffer.from(solution).toString('base64'),
          language_id: languageId,
          stdin: Buffer.from(testcase.input).toString('base64')
        }));

        const submitResult = await submitBatch(submissions);
        const resultTokens = submitResult.map((value) => value.token);

        // --- FIXED: ASYNCHRONOUS POLLING ENGINE FOR JUDGE0 ---
        let testResult = [];
        let maxRetries = 10;
        let isProcessing = true;

        while (maxRetries > 0 && isProcessing) {
          testResult = await submitToken(resultTokens);
          
          // Check if any submission in the batch is still in Queue (1) or Processing (2)
          const stillProcessing = testResult.some(test => test.status && test.status.id <= 2);
          
          if (!stillProcessing) {
            isProcessing = false;
          } else {
            await delay(1500); // Wait 1.5 seconds before polling Judge0 again
            maxRetries--;
          }
        }

        if (isProcessing) {
          throw new Error(`Judge0 processing timed out for language runtime: ${language}`);
        }
        // ----------------------------------------------------

        // Validate assertions against reassembled response outputs
        visibleTestCases.forEach((testcase, index) => {
          const test = testResult[index];
          if (!test) return;

          if (test.status.id === 6) { // Compilation Error Handlers
            const errorMessage = test.compile_output || '';
            console.error(`--- COMPILER ERROR ON DEPLOYMENT [${language}] ---`);
            console.error(Buffer.from(errorMessage, 'base64').toString('utf8'));
            throw new Error(`Compilation error detected in reference solution for ${language}`);
          }

          const output = test.stdout 
            ? Buffer.from(test.stdout, 'base64').toString('utf8').trim() 
            : "No Output";

          // Match clean trimmed strings ignoring tailing whitespaces/newlines
          if (testcase.output.trim() === output) {
            totalSuccessfulMatches++;
          } else {
            console.warn(`--- MISMATCH DETECTED ---`);
            console.warn(`Input: ${testcase.input}`);
            console.warn(`Expected: ${testcase.output.trim()}`);
            console.warn(`Received: ${output}`);
          }
        });
      }
    }

    // --- FIXED: DYNAMIC LANGUAGE ASSIGNMENT VALIDATION RULE ---
    if (totalSuccessfulMatches !== expectedTotalMatches) {
      throw new Error(`Test case validation mismatch. Passed ${totalSuccessfulMatches} out of ${expectedTotalMatches} required assertions.`);
    }

    // Deploys clean problem payload referencing current authentication session
    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id // Derived securely via middleware session decoding
    });

    res.status(201).send("Problem Saved Successfully");
  }
  catch (err) {
    console.error("Create Problem System Error: ", err);
    res.status(400).send("Error: " + (err.message || err));
  }
};

const updateProblem = async (req, res) => {

  const { id } = req.params;
  const { title, description, difficulty, tags,
    visibleTestCases, hiddenTestCases, startCode, driverCode,
    referenceSolution, problemCreator
  } = req.body;

  try {
    if (!id) {
      return res.status(400).send("Missing ID Field");
    }

    const DsaProblem = await Problem.findById(id);
    if (!DsaProblem) {
      return res.status(404).send("ID is not present in server");
    }

    if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
      return res.status(400).send("Reference solution is required");
    }

    if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
      return res.status(400).send("Visible test cases are required");
    }

    if (!Array.isArray(driverCode) || driverCode.length === 0) {
      return res.status(400).send("Driver code is required");
    }

    // Validate reference solutions by testing with driver code
    for (const { lang, before, after } of driverCode) {
      for (const { language, completeCode } of referenceSolution) {
        if (lang.toLowerCase() !== language.toLowerCase()) {
          continue;
        }

        const languageId = getLanguageById(language);
        if (!languageId) {
          return res.status(400).send(`Unsupported language: ${language}`);
        }

        // Concatenate driver code with reference solution
        const solution = before + completeCode + after;

        // Create batch submission with Base64 encoding
        const submissions = visibleTestCases.map((testcase) => ({
          source_code: Buffer.from(solution).toString('base64'),
          language_id: languageId,
          stdin: Buffer.from(testcase.input || "").toString('base64'),
          expected_output: Buffer.from(testcase.output || "").toString('base64')
        }));

        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value) => value.token);

        // Polling mechanism for Judge0
        let testResult = [];
        let maxRetries = 10;
        let isProcessing = true;

        while (maxRetries > 0 && isProcessing) {
          testResult = await submitToken(resultToken);
          const stillProcessing = testResult.some(test => test.status && test.status.id <= 2);
          
          if (!stillProcessing) {
            isProcessing = false;
          } else {
            await delay(1500);
            maxRetries--;
          }
        }

        if (isProcessing) {
          return res.status(400).send({
            error: `Judge0 processing timed out for language: ${language}`
          });
        }

        // Validate test results
        for (const test of testResult) {
          const statusId = test.status?.id;
          if (statusId !== 3) {
            const statusDescription = test.status?.description || 'unknown';
            const stderr = test.stderr ? Buffer.from(test.stderr, 'base64').toString('utf8') : '';
            const compileOutput = test.compile_output ? Buffer.from(test.compile_output, 'base64').toString('utf8') : '';
            
            console.error('Judge0 update failure', { language, statusId, statusDescription, stderr, compileOutput });
            return res.status(400).send({
              error: 'Judge0 validation failed',
              language,
              statusId,
              statusDescription,
              stderr,
              compileOutput,
            });
          }
        }
      }
    }

    const newProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });
    res.status(200).send(newProblem);
  }
  catch (err) {
    console.error(err.stack || err);
    res.status(500).send({ error: err.message || String(err) });
  }
}

const deleteProblem = async (req, res) => {

  const { id } = req.params;
  try {

    if (!id)
      return res.status(400).send("ID is Missing");
    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deletedProblem)
      return res.status(404).send("Problem is Missing");
    res.status(200).send("Successfully Deleted");
  }
  catch (err) {
    res.status(500).send("Error: " + err);
  }
}


const getProblemById = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    if (!id)
      return res.status(400).send("ID is Missing");

    console.log('Hello')
    const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases hiddenTestCases startCode referenceSolution driverCode');
    if (!getProblem)
      return res.status(404).send("Problem is Missing");
    res.status(200).send(getProblem);
  }
  catch (err) {
    res.status(500).send("Error: " + err);
  }
}

const getAllProblem = async (req, res) => {
  try {
    const getProblem = await Problem.find({}).select('_id title difficulty tags');
    if (getProblem.length == 0)
      return res.status(404).send("Problem is Missing");
    res.status(200).send(getProblem);
  }
  catch (err) {
    res.status(500).send("Error: " + err);
  }
}

const solvedAllProblembyUser = async (req, res) => {

  try {

    const userId = req.result._id;

    const user = await User.findById(userId).populate({
      path: "problemSolved",
      select: "_id title difficulty tags"
    });

    res.status(200).send(user.problemSolved);

  }
  catch (err) {
    res.status(500).send("Server Error");
  }
}

const submittedProblem = async (req, res) => {

  try {

    const userId = req.result._id;
    const problemId = req.params.pid;

    const ans = await Submission.find({ userId, problemId }).sort({ createdAt: -1 });

    // #region agent log
    fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '96279e'
      },
      body: JSON.stringify({
        sessionId: '96279e',
        runId: 'baseline',
        hypothesisId: 'H8',
        location: 'userProblem.js:submittedProblem',
        message: 'submittedProblem query result',
        data: {
          userId: String(userId),
          problemId: String(problemId),
          count: ans.length,
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    if (ans.length == 0) {
      return res.status(200).send("No Submission is persent");
    }

    return res.status(200).send(ans);

  }
  catch (err) {
    // #region agent log
    fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '96279e'
      },
      body: JSON.stringify({
        sessionId: '96279e',
        runId: 'baseline',
        hypothesisId: 'H9',
        location: 'userProblem.js:submittedProblem:catch',
        message: 'submittedProblem error',
        data: {
          errorMessage: String(err && err.message)
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    res.status(500).send("Internal Server Error");
  }
}

module.exports = { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, solvedAllProblembyUser, submittedProblem };

