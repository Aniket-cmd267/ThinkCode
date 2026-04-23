const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

function buildFullCode(problem, code, lang) {
  const driver = problem.driverCode.find(
    (item) => item.lang.toLowerCase() === lang.toLowerCase()
  );

  if (!driver) {
    throw new Error("Driver code not found for selected language");
  }

  return `${driver.before}\n${code}\n${driver.after}\n`;
}

async function evaluateContestSubmission(problem, code, lang) {
  const languageId = getLanguageById(lang);
  if (!languageId) {
    throw new Error("Unsupported language");
  }

  const fullCode = buildFullCode(problem, code, lang);

  const submissions = problem.hiddenTestCases.map((testcase) => ({
    source_code: Buffer.from(fullCode).toString("base64"),
    language_id: languageId,
    stdin: Buffer.from(testcase.input).toString("base64"),
  }));

  const submitResult = await submitBatch(submissions);
  const resultToken = submitResult.map((value) => value.token);
  const testResult = await submitToken(resultToken);

  let testCasesPassed = 0;
  let runtime = 0;
  let memory = 0;
  let status = "accepted";
  let errorMessage = "";

  for (let index = 0; index < testResult.length; index += 1) {
    const test = testResult[index];
    const testcase = problem.hiddenTestCases[index];
    const output = test.stdout
      ? Buffer.from(test.stdout, "base64").toString("utf8").trim()
      : "";

    if (test.status.id === 3 && testcase.output.trim() === output) {
      testCasesPassed += 1;
      runtime += Number.parseFloat(test.time || 0);
      memory = Math.max(memory, Number(test.memory || 0));
      continue;
    }

    if (test.status.id === 6) {
      status = "error";
      errorMessage = test.compile_output
        ? Buffer.from(test.compile_output, "base64").toString("utf8")
        : "Compilation error";
      break;
    }

    if (test.status.id === 4) {
      status = "error";
      errorMessage = test.stderr
        ? Buffer.from(test.stderr, "base64").toString("utf8")
        : "Runtime error";
      break;
    }

    status = "wrong";
    errorMessage = test.stderr
      ? Buffer.from(test.stderr, "base64").toString("utf8")
      : "Wrong answer";
    break;
  }

  if (testCasesPassed !== problem.hiddenTestCases.length) {
    status = status === "accepted" ? "wrong" : status;
  }

  return {
    code,
    fullCode,
    language: lang,
    status,
    runtime,
    memory,
    errorMessage,
    testCasesPassed,
    testCasesTotal: problem.hiddenTestCases.length,
  };
}

module.exports = { evaluateContestSubmission };
