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
  console.log(req.body)
  const { title, description, difficulty, tags,
    visibleTestCases, hiddenTestCases, startCode,
    referenceSolution, problemCreator
  } = req.body;
  console.log(description)
  try {

    if (!id) {
      return res.status(400).send("Missing ID Field");
    }

    const DsaProblem = await Problem.findById(id);
    if (!DsaProblem) {
      return res.status(404).send("ID is not persent in server");
    }

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      // I am creating Batch submission
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));

      const submitResult = await submitBatch(submissions);
      console.log(submitResult);
      const resultToken = submitResult.map((value) => value.token);
      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

      const testResult = await submitToken(resultToken);

      console.log(testResult);
      for (const test of testResult) {
        if (test.status_id != 3) {
          return res.status(400).send("Error Occured");
        }
      }
    }
    const newProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });
    console.log(newProblem)
    res.status(200).send(newProblem);
  }
  catch (err) {
    console.log(err)
    res.status(500).send("Error: " + err);
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

