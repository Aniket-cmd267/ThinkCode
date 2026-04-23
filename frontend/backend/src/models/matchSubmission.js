const mongoose = require("mongoose");
const { Schema } = mongoose;

const matchSubmissionSchema = new Schema(
  {
    matchId: {
      type: Schema.Types.ObjectId,
      ref: "match",
      required: true,
    },
    roomId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    questionIndex: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["javascript", "java", "c++"],
      required: true,
    },
    status: {
      type: String,
      enum: ["accepted", "wrong", "error", "pending"],
      required: true,
    },
    runtime: {
      type: Number,
      default: 0,
    },
    memory: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    testCasesPassed: {
      type: Number,
      default: 0,
    },
    testCasesTotal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

matchSubmissionSchema.index({ roomId: 1, userId: 1, questionIndex: 1 });

const MatchSubmission = mongoose.model("matchSubmission", matchSubmissionSchema);
module.exports = MatchSubmission;
