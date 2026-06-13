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
//         hypothesisId: 'H1',
//         location: 'userSubmission.js:submitCode:entry',
//         message: 'submitCode entry',
//         data: {
//           hasUser: !!userId,
//           problemId,
//           hasCode: !!code,
//           hasFullCode: !!fullCode,
//           lang
//         },
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
//       code,
//       language: lang,
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
//         hypothesisId: 'H2',
//         location: 'userSubmission.js:submitCode:afterCreate',
//         message: 'Submission created',
//         data: {
//           submissionId: String(submittedResult._id),
//           language: submittedResult.language,
//           testCasesTotal: submittedResult.testCasesTotal
//         },
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
//     const testResult = await submitToken(resultToken);

//     let testCasesPassed = 0;
//     let runtime = 0;
//     let memory = 0;
//     let status = 'accepted';
//     let errorMessage = null;
//     let count = 0;

//     problem.hiddenTestCases.forEach((testcase, index) => {
//       const test = testResult[index];
//       const output = test.stdout ? Buffer.from(test.stdout, 'base64').toString('utf8').trim() : "No Output";
//       if (testcase.output.trim() === output) {
//         count++;
//       }
//     });

//     for (const test of testResult) {
//       if (test.status.id == 3) {
//         testCasesPassed++;
//         runtime = runtime + parseFloat(test.time);
//         memory = Math.max(memory, test.memory);
//       } else {
//         if (test.status.id == 4) {
//           status = 'error';
//           errorMessage = test.stderr;
//         }
//         else {
//           status = 'wrong';
//           errorMessage = test.stderr;
//         }
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
//         hypothesisId: 'H3',
//         location: 'userSubmission.js:submitCode:afterJudge0',
//         message: 'submitCode Judge0 summary',
//         data: {
//           submissionId: String(submittedResult._id),
//           hiddenCount: problem.hiddenTestCases.length,
//           matchedHidden: count,
//           testCasesPassed,
//           status
//         },
//         timestamp: Date.now()
//       })
//     }).catch(() => {});
//     // #endregion

//     if (count != (problem.hiddenTestCases.length)) {
//       throw new Error('Problem in the testcases');
//     }

//     submittedResult.status = status;
//     submittedResult.testCasesPassed = testCasesPassed;
//     submittedResult.errorMessage = errorMessage;
//     submittedResult.runtime = runtime;
//     submittedResult.memory = memory;
//     await submittedResult.save();

//     if (submittedResult.status === 'accepted') {
//       const alreadySolved = Array.isArray(req.result.problemSolved)
//         ? req.result.problemSolved.some(
//             (pid) => String(pid) === String(problemId)
//           )
//         : false;

//       if (!alreadySolved) {
//         req.result.problemSolved.push(problemId);
//         await req.result.save();
//       }
//     }
//     return res.status(201).send(submittedResult);
//   }
//   catch (err) {
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
//         hypothesisId: 'H4',
//         location: 'userSubmission.js:submitCode:catch',
//         message: 'submitCode error',
//         data: {
//           errorMessage: String(err && err.message),
//         },
//         timestamp: Date.now()
//       })
//     }).catch(() => {});
//     // #endregion

//     console.log(err);
//     return res.status(500).send("Internal Server Error " + err);
//   }
// };

// Add a helper at the top of your file if not already present

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
    let count = 0;
    const userId = req.result._id;
    const id = req.params.id;
    const { fullCode, lang } = req.body;

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
        hypothesisId: 'H5',
        location: 'userSubmission.js:runCode:entry',
        message: 'runCode entry',
        data: {
          hasUser: !!userId,
          problemId: id,
          hasFullCode: !!fullCode,
          lang
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    if (!userId || !fullCode || !id || !lang) {
      return res.status(400).send("Some field missing");
    }

    const problem = await Problem.findById(id);

    //    Judge0 code ko submit karna hai
    const languageId = getLanguageById(lang);
    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: Buffer.from(fullCode).toString('base64'),
      language_id: languageId,
      stdin: Buffer.from(testcase.input).toString('base64')
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    // Check for compilation errors
    let compilationError = null;
    for (const test of testResult) {
      if (test.status.id === 6) {
        compilationError = test.compile_output ? Buffer.from(test.compile_output, 'base64').toString('utf8') : 'Compilation error';
        console.log(compilationError);
        break;
      }
    }

    // Build detailed test case results
    const detailedResults = [];
    let totalPassed = 0;
    let runtime = 0;
    let memory = 0;

    problem.visibleTestCases.forEach((testcase, index) => {
      const test = testResult[index];
      const actualOutput = test.stdout ? Buffer.from(test.stdout, 'base64').toString('utf8').trim() : "No Output";
      const expectedOutput = testcase.output.trim();
      const passed = expectedOutput === actualOutput;

      if (passed) {
        totalPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      }

      detailedResults.push({
        input: testcase.input,
        expectedOutput: expectedOutput,
        actualOutput: actualOutput,
        passed: passed,
        statusId: test.status.id,
        statusDescription: test.status.description,
        runtime: test.time ? `${(parseFloat(test.time) * 1000).toFixed(0)} ms` : 'N/A',
        memory: test.memory ? `${(test.memory / 1024).toFixed(2)} MB` : 'N/A'
      });
    });

    // Determine overall status
    let status = 'accepted';
    let errorMessage = null;

    if (compilationError) {
      status = 'error';
      errorMessage = compilationError;
    } else if (totalPassed < problem.visibleTestCases.length) {
      status = 'wrong';
    }

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
        hypothesisId: 'H6',
        location: 'userSubmission.js:runCode:afterJudge0',
        message: 'runCode Judge0 summary',
        data: {
          visibleCount: problem.visibleTestCases.length,
          matchedVisible: totalPassed,
          statuses: testResult.map(t => t.status && t.status.id)
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    res.status(201).send({
      status,
      totalPassed,
      totalTestCases: problem.visibleTestCases.length,
      errorMessage,
      runtime: runtime ? `${runtime.toFixed(0)} ms` : 'N/A',
      memory: memory ? `${(memory / 1024).toFixed(2)} MB` : 'N/A',
      results: detailedResults
    });
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
        hypothesisId: 'H7',
        location: 'userSubmission.js:runCode:catch',
        message: 'runCode error',
        data: {
          errorMessage: String(err && err.message)
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    console.log(err);
    res.status(500).send({
      status: 'error',
      errorMessage: "Internal Server Error: " + String(err && err.message),
      totalPassed: 0,
      totalTestCases: 0,
      results: []
    });
  }
};

module.exports = { submitCode, runCode };
