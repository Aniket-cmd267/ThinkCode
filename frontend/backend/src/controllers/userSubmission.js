const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, fullCode, lang } = req.body;
    if (!userId || !fullCode || !problemId || !lang || !code)
      return res.status(400).send("Some field missing");
    //    Fetch the problem from database
    const problem = await Problem.findById(problemId);
    //    testcases(Hidden)
    //   Kya apne submission store kar du pehle....
    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language:lang,
      status: 'pending',
      testCasesTotal: problem.hiddenTestCases.length
    })
    //    Judge0 code ko submit karna hai
    const languageId = getLanguageById(lang);
    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: Buffer.from(fullCode).toString('base64'),
      language_id: languageId,
      stdin: Buffer.from(testcase.input).toString('base64')
    }));
    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    console.log(resultToken)
    const testResult = await submitToken(resultToken);
    // console.log(testResult)
    
    // submittedResult ko update karo
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;
    let count= 0;
    problem.hiddenTestCases.forEach((testcase, index) =>{
        const test= testResult[index]
        const output = test.stdout ? Buffer.from(test.stdout, 'base64').toString('utf8').trim() : "No Output"
        if(testcase.output.trim()=== output){
          count++
        }
    })
    console.log(count)
    if(count != (problem.hiddenTestCases.length)){
      throw new Error('Problem in the testcases')
    }
    for (const test of testResult) {
      if (test.status.id == 3) {
        testCasesPassed++;
        console.log(test.time)
        console.log(test)
        runtime = runtime + parseFloat(test.time)
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status.id == 4) {
          status = 'error'
          errorMessage = test.stderr
        }
        else {
          status = 'wrong'
          errorMessage = test.stderr
        }
      }
    }
    if(count=== testCasesPassed){
      submittedResult.status = 'accepted';
    }
    
    // Store the result in Database in Submission

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    await submittedResult.save();
    // ProblemId ko insert karenge userSchema ke problemSolved mein if it is not persent there.
    // req.result == user Information
    if (!req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }
    return res.status(201).send(submittedResult);
  }
  catch (err) {
    console.log(err)
    return res.status(500).send("Internal Server Error " + err);
  }
}
const runCode = async (req, res) => {
  // 
  try {
    let count=0;
    const userId = req.result._id;
    const id = req.params.id;
    // console.log(req.params)
    console.log(userId)
    console.log(id)
    const { fullCode, lang } = req.body;
    console.log(lang)
    if (!userId || !fullCode || !id || !lang) {
      return res.status(400).send("Some field missing");
    }
    //    Fetch the problem from database
    const problem = await Problem.findById(id);
    //    testcases(Hidden)
    // console.log(problem)

    //    Judge0 code ko submit karna hai
    const languageId = getLanguageById(lang);
    console.log(languageId)
    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: Buffer.from(fullCode).toString('base64'),
      language_id: languageId,
      stdin: Buffer.from(testcase.input).toString('base64')
    }));
    const submitResult = await submitBatch(submissions);
    console.log(submitBatch)
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);
    console.log(testResult)
    for(const test of testResult) {
      if(test.status.id === 6) {
        const compileError = Buffer.from(test.compile_output, 'base64').toString('utf8');
        console.log(compileError);
      }
    }
    problem.visibleTestCases.forEach((testcase, index) =>{
        const test= testResult[index]
        const output = test.stdout ? Buffer.from(test.stdout, 'base64').toString('utf8').trim() : "No Output"
        if(testcase.output.trim()=== output){
          count++
        }
    })
    console.log(count)
    if(count != (problem.visibleTestCases.length)){
      throw new Error('Problem in the testcases')
    }
    res.status(201).send(testResult);
  }
  catch (err) {
    console.log(err)
    res.status(500).send("Internal Server Error " + err);
  }
}
module.exports = { submitCode, runCode };