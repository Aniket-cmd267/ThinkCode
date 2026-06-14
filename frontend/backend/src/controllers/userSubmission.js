const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

// const submitCode = async (req, res) => {
//   try {
//     const userId = req.result._id;
//     const problemId = req.params.id;
//     const { code, fullCode, lang } = req.body;

//     // #region agent log
//     fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Debug-Session-Id': '96279e'
//       },
//       body: JSON.stringify({
//         sessionId: '96279e',
//         runId: 'baseline',
//         location: 'userSubmission.js:submitCode:entry',
//         message: 'submitCode entry',
//         data: { hasUser: !!userId, problemId, hasCode: !!code, hasFullCode: !!fullCode, lang },
//         timestamp: Date.now()
//       })
//     }).catch(() => {});
//     // #endregion

//     if (!userId || !fullCode || !problemId || !lang || !code)
//       return res.status(400).send("Some field missing");

//     const problem = await Problem.findById(problemId);

//     const submittedResult = await Submission.create({
//       userId,
//       problemId,
//       language: lang,
//       code,
//       status: 'pending',
//       testCasesTotal: problem.hiddenTestCases.length
//     });

//     // #region agent log
//     fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Debug-Session-Id': '96279e'
//       },
//       body: JSON.stringify({
//         sessionId: '96279e',
//         runId: 'baseline',
//         location: 'userSubmission.js:submitCode:afterCreate',
//         message: 'Submission created',
//         data: { submissionId: String(submittedResult._id), language: submittedResult.language, testCasesTotal: submittedResult.testCasesTotal },
//         timestamp: Date.now()
//       })
//     }).catch(() => {});
//     // #endregion

//     const languageId = getLanguageById(lang);
//     const submissions = problem.hiddenTestCases.map((testcase) => ({
//       source_code: Buffer.from(fullCode).toString('base64'),
//       language_id: languageId,
//       stdin: Buffer.from(testcase.input).toString('base64')
//     }));

//     const submitResult = await submitBatch(submissions);
//     const resultToken = submitResult.map((value) => value.token);

//     // --- FIXED: ASYNCHRONOUS RETRY POLLING MECHANISM FOR USER SUBMISSION ---
//     let testResult = [];
//     let maxRetries = 10;
//     let isProcessing = true;

//     while (maxRetries > 0 && isProcessing) {
//       testResult = await submitToken(resultToken);
      
//       // If any test in the batch is still in Queue (1) or Processing (2)
//       const stillProcessing = testResult.some(test => test.status && test.status.id <= 2);
      
//       if (!stillProcessing) {
//         isProcessing = false;
//       } else {
//         await delay(1500); // Wait 1.5 seconds before asking Judge0 again
//         maxRetries--;
//       }
//     }

//     if (isProcessing) {
//       throw new Error('Judge0 sandbox processing timed out during evaluation');
//     }
//     // ---------------------------------------------------------------------

//     let testCasesPassed = 0;
//     let runtime = 0;
//     let memory = 0;
//     let status = 'accepted';
//     let errorMessage = null;
//     let count = 0;

//     problem.hiddenTestCases.forEach((testcase, index) => {
//       const test = testResult[index];
//       if (!test) return;

//       const output = test.stdout ? Buffer.from(test.stdout, 'base64').toString('utf8').trim() : "No Output";
//       if (testcase.output.trim() === output) {
//         count++;
//       }
//     });

//     for (const test of testResult) {
//       if (test.status.id === 3) { // Accepted
//         testCasesPassed++;
//         runtime = runtime + parseFloat(test.time || 0);
//         memory = Math.max(memory, test.memory || 0);
//       } else {
//         // Handle alternative failures gracefully without crashing backend server instance
//         if (test.status.id === 6) { // Compilation Error
//           status = 'compile_error';
//           errorMessage = test.compile_output ? Buffer.from(test.compile_output, 'base64').toString('utf8') : "Compilation Error";
//         } else if (test.status.id === 4) { // Wrong Answer
//           status = 'wrong';
//           errorMessage = test.stderr ? Buffer.from(test.stderr, 'base64').toString('utf8') : "Wrong Answer";
//         } else { // Time Limit / Runtime Exception Errors
//           status = 'error';
//           errorMessage = test.stderr ? Buffer.from(test.stderr, 'base64').toString('utf8') : `Error Status ID: ${test.status.id}`;
//         }
//         break; // A single failed test case means the entire submission status fails
//       }
//     }

//     // #region agent log
//     fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Debug-Session-Id': '96279e'
//       },
//       body: JSON.stringify({
//         sessionId: '96279e',
//         runId: 'baseline',
//         location: 'userSubmission.js:submitCode:afterJudge0',
//         message: 'submitCode Judge0 summary',
//         data: { submissionId: String(submittedResult._id), hiddenCount: problem.hiddenTestCases.length, matchedHidden: count, testCasesPassed, status },
//         timestamp: Date.now()
//       })
//     }).catch(() => {});
//     // #endregion

//     // --- FIXED: WRONG USER CODES SHOULD UPDATE ACCORDINGLY instead of breaking app logic ---
//     if (count !== problem.hiddenTestCases.length && status === 'accepted') {
//       status = 'wrong';
//     }

//     submittedResult.status = status;
//     submittedResult.testCasesPassed = testCasesPassed;
//     submittedResult.errorMessage = errorMessage;
//     submittedResult.runtime = runtime;
//     submittedResult.memory = memory;
//     await submittedResult.save();

//     if (submittedResult.status === 'accepted') {
//       const alreadySolved = Array.isArray(req.result.problemSolved)
//         ? req.result.problemSolved.some((pid) => String(pid) === String(problemId))
//         : false;

//       if (!alreadySolved) {
//         req.result.problemSolved.push(problemId);
//         await req.result.save();
//       }
//     }
    
//     return res.status(200).send(submittedResult);

//   } catch (err) {
//     // #region agent log
//     fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Debug-Session-Id': '96279e'
//       },
//       body: JSON.stringify({
//         sessionId: '96279e',
//         runId: 'baseline',
//         location: 'userSubmission.js:submitCode:catch',
//         message: 'submitCode error',
//         data: { errorMessage: String(err && err.message) },
//         timestamp: Date.now()
//       })
//     }).catch(() => {});
//     // #endregion

//     console.log(err);
//     return res.status(500).send("Internal Server Error " + err.message);
//   }
// };

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, fullCode, lang } = req.body;

    // #region agent log
    fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '96279e' },
      body: JSON.stringify({
        sessionId: '96279e', runId: 'baseline', location: 'userSubmission.js:submitCode:entry',
        message: 'submitCode entry', data: { hasUser: !!userId, problemId, hasCode: !!code, hasFullCode: !!fullCode, lang },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

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

    // #region agent log
    fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '96279e' },
      body: JSON.stringify({
        sessionId: '96279e', runId: 'baseline', location: 'userSubmission.js:submitCode:afterCreate',
        message: 'Submission created', data: { submissionId: String(submittedResult._id), language: submittedResult.language, testCasesTotal: submittedResult.testCasesTotal },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    const languageId = getLanguageById(lang);
    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: Buffer.from(fullCode).toString('base64'),
      language_id: languageId,
      stdin: Buffer.from(testcase.input).toString('base64')
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);

    // ASYNCHRONOUS RETRY POLLING MECHANISM FOR USER SUBMISSION
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
    
    // Track parameters for the single failing test case explicitly
    let firstFailedTestCase = null;

    // SINGLE RECONCILED EVALUATION LOOP
    problem.hiddenTestCases.forEach((testcase, index) => {
      const test = testResult[index];
      if (!test) return;

      const currentStatusId = test.status ? test.status.id : 4;

      if (currentStatusId === 3) { // Accepted test case node
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        // Capture failure metrics on the very first mismatch or execution fault encountered
        if (status === 'accepted') { 
          if (currentStatusId === 6) {
            status = 'compile_error';
            errorMessage = test.compile_output ? Buffer.from(test.compile_output, 'base64').toString('utf8') : "Compilation Error";
          } else if (currentStatusId === 4) {
            status = 'wrong';
            errorMessage = test.stderr ? Buffer.from(test.stderr, 'base64').toString('utf8') : "Wrong Answer";
          } else {
            status = 'error';
            errorMessage = test.stderr ? Buffer.from(test.stderr, 'base64').toString('utf8') : `Error Status ID: ${currentStatusId}`;
          }
        }

        // Exclusively bundle metrics of the first mismatching test case
        if (!firstFailedTestCase) {
          const userOutput = test.stdout ? Buffer.from(test.stdout, 'base64').toString('utf8').trim() : "No Output";
          firstFailedTestCase = {
            index: index + 1,
            input: testcase.input,
            expected: testcase.output.trim(),
            received: userOutput
          };
        }
      }
    });

    // #region agent log
    fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '96279e' },
      body: JSON.stringify({
        sessionId: '96279e', runId: 'baseline', location: 'userSubmission.js:submitCode:afterJudge0',
        message: 'submitCode Judge0 summary', data: { submissionId: String(submittedResult._id), hiddenCount: problem.hiddenTestCases.length, testCasesPassed, status },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    await submittedResult.save();

    // Convert mongoose document into standard JSON payload to extend frontend data safely
    let responsePayload = submittedResult.toObject();
    if (status === 'wrong' && firstFailedTestCase) {
      responsePayload.failedTestCaseDetails = firstFailedTestCase;
    }

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
    // #region agent log
    fetch('http://127.0.0.1:7851/ingest/0cb560c5-e95f-4dac-b8be-e7f2d1ac4c4f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '96279e' },
      body: JSON.stringify({
        sessionId: '96279e', runId: 'baseline', location: 'userSubmission.js:submitCode:catch',
        message: 'submitCode error', data: { errorMessage: String(err && err.message) },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

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
    
    // Map submissions against visible test cases for Run Code mode
    const submissions = problem.visibleTestCases.map((testcase) => ({
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

    problem.visibleTestCases.forEach((testcase, index) => {
      const test = testResult[index];
      if (!test) return;

      const currentStatusId = test.status ? test.status.id : 4;
      const userOutput = test.stdout ? Buffer.from(test.stdout, 'base64').toString('utf8').trim() : "";
      const isPassed = currentStatusId === 3 && testcase.output.trim() === userOutput;

      if (isPassed) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        if (status === 'accepted') {
          switch (currentStatusId) {
            case 3:
            case 4:
              status = 'wrong';
              errorMessage = "Wrong Answer";
              break;
            case 5:
              status = 'time_limit_exceeded';
              errorMessage = "Time Limit Exceeded";
              break;
            case 6:
              status = 'compile_error';
              errorMessage = test.compile_output ? Buffer.from(test.compile_output, 'base64').toString('utf8') : "Compilation Error";
              break;
            case 7:
            case 10:
            case 11:
              status = 'runtime_error';
              errorMessage = test.stderr ? Buffer.from(test.stderr, 'base64').toString('utf8') : `Runtime Error Status ID: ${currentStatusId}`;
              break;
            case 8:
              status = 'memory_limit_exceeded';
              errorMessage = "Memory Limit Exceeded";
              break;
            case 12:
              status = 'output_limit_exceeded';
              errorMessage = "Output Limit Exceeded";
              break;
            default:
              status = 'runtime_error';
              errorMessage = test.stderr ? Buffer.from(test.stderr, 'base64').toString('utf8') : `Runtime Error Status ID: ${currentStatusId}`;
              break;
          }
        }

        if (!firstFailedTestCase) {
          firstFailedTestCase = {
            index: index + 1,
            input: testcase.input,
            expected: testcase.output.trim(),
            received: userOutput || "No Output"
          };
        }
      }
    });

    // Format individual test case outcomes for the detailed frontend view
    const formattedResults = problem.visibleTestCases.map((testcase, index) => {
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

    // Build response body matching Run and Submit configurations cleanly
    const runResponsePayload = {
      status, // 'accepted', 'wrong', 'compile_error', 'time_limit_exceeded', 'memory_limit_exceeded', 'runtime_error'
      testCasesPassed,
      testCasesTotal: problem.visibleTestCases.length,
      runtime: runtime ? `${runtime.toFixed(0)} ms` : "-- ms",
      memory: memory ? `${memory.toFixed(2)} MB` : "-- MB",
      errorMessage,
      results: formattedResults, // The array needed for Run
      failedTestCaseDetails: firstFailedTestCase // Details used for the failure fallback terminal
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
