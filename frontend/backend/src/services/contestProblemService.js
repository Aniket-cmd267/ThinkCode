const Problem = require("../models/problem");

function sanitizeProblem(problem) {
  return {
    _id: problem._id,
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    tags: problem.tags,
    visibleTestCases: problem.visibleTestCases,
    startCode: problem.startCode,
    driverCode: problem.driverCode,
  };
}

async function pickContestProblems(count = 3) {
  const problems = await Problem.aggregate([{ $sample: { size: count } }]);

  if (problems.length < count) {
    throw new Error("Not enough problems available to start a contest");
  }

  return problems.map((problem) => ({
    problemId: String(problem._id),
    title: problem.title,
    difficulty: problem.difficulty,
    tags: problem.tags,
    publicProblem: sanitizeProblem(problem),
    hiddenTestCases: problem.hiddenTestCases,
    driverCode: problem.driverCode,
  }));
}

module.exports = { pickContestProblems, sanitizeProblem };
