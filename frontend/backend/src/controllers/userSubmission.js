const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

const mapJudge0Status = (test) => {
  const statusId = test?.status?.id ?? 4;
  const description = String(test?.status?.description || "").toLowerCase();
  const stderr = test?.stderr ? Buffer.from(test.stderr, 'base64').toString('utf8') : "";
  const compileOutput = test?.compile_output ? Buffer.from(test.compile_output, 'base64').toString('utf8') : "";

  if (description.includes("memory")) {
    return { status: 'memory_limit_exceeded', errorMessage: 'Memory Limit Exceeded' };
  }
  if (description.includes("output")) {
    return { status: 'output_limit_exceeded', errorMessage: 'Output Limit Exceeded' };
  }
  switch (statusId) {
    case 3:
      return { status: 'accepted', errorMessage: null };
    case 4:
      return { status: 'wrong', errorMessage: stderr || 'Wrong Answer' };
    case 5:
      return { status: 'time_limit_exceeded', errorMessage: 'Time Limit Exceeded' };
    case 6:
      return { status: 'compile_error', errorMessage: compileOutput || 'Compilation Error' };
    case 7:
    case 11:
      return { status: 'runtime_error', errorMessage: stderr || `Runtime Error Status ID: ${statusId}` };
    case 8:
      return { status: 'memory_limit_exceeded', errorMessage: 'Memory Limit Exceeded' };
    case 10:
      return { status: 'runtime_error', errorMessage: stderr || `Exec Format Error Status ID: ${statusId}` };
    case 12:
      return { status: 'output_limit_exceeded', errorMessage: 'Output Limit Exceeded' };
    default:
      return { status: 'runtime_error', errorMessage: stderr || `Runtime Error Status ID: ${statusId}` };
  }
};


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, fullCode, lang } = req.body;


    fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '96279e' },
      body: JSON.stringify({
        sessionId: '96279e', runId: 'baseline', location: 'userSubmission.js:submitCode:entry',
        message: 'submitCode entry', data: { hasUser: !!userId, problemId, hasCode: !!code, hasFullCode: !!fullCode, lang },
        timestamp: Date.now()
      })
    }).catch(() => {});


    if (!userId || !fullCode || !problemId || !lang || !code)
      return res.status(400).send("Some field missing");

    const problem = await Problem.findById(problemId);

    const submittedResult = await Submission.create({
      userId,
      problemId,
      language: lang,
      code,
      status: 'pending',
      testCasesTotal: problem.hiddenTestCases.length
    });


    fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '96279e' },
      body: JSON.stringify({
        sessionId: '96279e', runId: 'baseline', location: 'userSubmission.js:submitCode:afterCreate',
        message: 'Submission created', data: { submissionId: String(submittedResult._id), language: submittedResult.language, testCasesTotal: submittedResult.testCasesTotal },
        timestamp: Date.now()
      })
    }).catch(() => {});


    const languageId = getLanguageById(lang);
    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: Buffer.from(fullCode).toString('base64'),
      language_id: languageId,
      stdin: Buffer.from(testcase.input).toString('base64')
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);

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
      throw new Error('Judge0 sandbox processing timed out during evaluation');
    }

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;
    
    
    let firstFailedTestCase = null;

    problem.hiddenTestCases.forEach((testcase, index) => {
      const test = testResult[index];
      if (!test) return;

      const { status: mappedStatus, errorMessage: mappedError } = mapJudge0Status(test);
      const userOutput = test.stdout ? Buffer.from(test.stdout, 'base64').toString('utf8').trim() : '';
      const isPassed = mappedStatus === 'accepted' && testcase.output.trim() === userOutput;

      if (isPassed) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
        return;
      }

      if (status === 'accepted') {
        if (mappedStatus === 'accepted') {
          status = 'wrong';
          errorMessage = 'Wrong Answer';
        } else {
          status = mappedStatus;
          errorMessage = mappedError;
        }
      }

      if (!firstFailedTestCase) {
        firstFailedTestCase = {
          index: index + 1,
          input: testcase.input,
          expected: testcase.output.trim(),
          received: userOutput || 'No Output'
        };
      }
    });

    fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '96279e' },
      body: JSON.stringify({
        sessionId: '96279e', runId: 'baseline', location: 'userSubmission.js:submitCode:afterJudge0',
        message: 'submitCode Judge0 summary', data: { submissionId: String(submittedResult._id), hiddenCount: problem.hiddenTestCases.length, testCasesPassed, status },
        timestamp: Date.now()
      })
    }).catch(() => {});

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    await submittedResult.save();

    let responsePayload = submittedResult.toObject();
    if (status === 'wrong' && firstFailedTestCase) {
      responsePayload.failedTestCaseDetails = firstFailedTestCase;
    }

    responsePayload.runtime = runtime ? `${runtime.toFixed(0)} ms` : "-- ms";
    responsePayload.memory = memory ? `${memory.toFixed(2)} MB` : "-- MB";

    if (submittedResult.status === 'accepted') {
      const alreadySolved = Array.isArray(req.result.problemSolved)
        ? req.result.problemSolved.some((pid) => String(pid) === String(problemId))
        : false;

      if (!alreadySolved) {
        req.result.problemSolved.push(problemId);
        await req.result.save();
      }
    }
    
    return res.status(200).send(responsePayload);

  } catch (err) {

    fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '96279e' },
      body: JSON.stringify({
        sessionId: '96279e', runId: 'baseline', location: 'userSubmission.js:submitCode:catch',
        message: 'submitCode error', data: { errorMessage: String(err && err.message) },
        timestamp: Date.now()
      })
    }).catch(() => {});


    console.log(err);
    return res.status(500).send("Internal Server Error " + err.message);
  }
};
const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { fullCode, lang } = req.body;

    if (!userId || !fullCode || !problemId || !lang) {
      return res.status(400).send("Some field missing");
    }

      const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    const languageId = getLanguageById(lang);
    const runTestCases = Array.isArray(req.body.customTestCases) && req.body.customTestCases.length
      ? req.body.customTestCases.map((testcase) => ({
          input: String(testcase.input || ""),
          output: String(testcase.output || "")
        })).filter((testcase) => testcase.input.trim() || testcase.output.trim())
      : problem.visibleTestCases;

    const submissions = (runTestCases || []).map((testcase) => ({
      source_code: Buffer.from(fullCode).toString('base64'),
      language_id: languageId,
      stdin: Buffer.from(testcase.input).toString('base64')
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    let testResult = [];
    let maxRetries = 10;
    let isProcessing = true;

    while (maxRetries > 0 && isProcessing) {
      testResult = await submitToken(resultToken);
      const stillProcessing = testResult.some(test => test.status && test.status.id <= 2);
      
      if (!stillProcessing) {
        isProcessing = false;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        maxRetries--;
      }
    }

    if (isProcessing) {
      throw new Error('Judge0 sandbox processing timed out during local run evaluation');
    }

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;
    let firstFailedTestCase = null;

    const evaluatedTestCases = runTestCases || [];

    evaluatedTestCases.forEach((testcase, index) => {
      const test = testResult[index];
      if (!test) return;

      const { status: mappedStatus, errorMessage: mappedError } = mapJudge0Status(test);
      const userOutput = test.stdout ? Buffer.from(test.stdout, 'base64').toString('utf8').trim() : "";
      const isPassed = mappedStatus === 'accepted' && testcase.output.trim() === userOutput;

      if (isPassed) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
        return;
      }

      if (status === 'accepted') {
        if (mappedStatus === 'accepted') {
          status = 'wrong';
          errorMessage = 'Wrong Answer';
        } else {
          status = mappedStatus;
          errorMessage = mappedError;
        }
      }

      if (!firstFailedTestCase) {
        firstFailedTestCase = {
          index: index + 1,
          input: testcase.input,
          expected: testcase.output.trim(),
          received: userOutput || 'No Output'
        };
      }
    });

    const formattedResults = (runTestCases || []).map((testcase, index) => {
      const test = testResult[index] || {};
      const actualOut = test.stdout ? Buffer.from(test.stdout, 'base64').toString('utf8').trim() : "";
      return {
        input: testcase.input,
        expectedOutput: testcase.output.trim(),
        actualOutput: actualOut,
        passed: test.status?.id === 3 && testcase.output.trim() === actualOut,
        statusDescription: test.status?.description || "Unknown Error",
        runtime: test.time ? `${parseFloat(test.time).toFixed(0)} ms` : null,
        memory: test.memory ? `${parseFloat(test.memory).toFixed(2)} MB` : null
      };
    });

    const runResponsePayload = {
      status,
      testCasesPassed,
      testCasesTotal: (runTestCases || []).length,
      runtime: runtime ? `${runtime.toFixed(0)} ms` : "-- ms",
      memory: memory ? `${memory.toFixed(2)} MB` : "-- MB",
      errorMessage,
      results: formattedResults, 
      failedTestCaseDetails: firstFailedTestCase 
    };

    return res.status(200).send(runResponsePayload);

  } catch (err) {
    console.error("Run Code Backend Error:", err);
    return res.status(500).send({
      status: 'error',
      errorMessage: err.message || "Internal Server Error occurred during code execution"
    });
  }
};

module.exports = { submitCode, runCode };
