const mongoose = require("mongoose");
const { Schema } = mongoose;

const playerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const questionSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const matchSchema = new Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    players: {
      type: [playerSchema],
      default: [],
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["waiting", "active", "finished", "abandoned"],
      default: "waiting",
    },
    scores: {
      type: Map,
      of: Number,
      default: {},
    },
    winner: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: null,
      },
      firstName: {
        type: String,
        default: null,
      },
      reason: {
        type: String,
        default: null,
      },
    },
    startedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Match = mongoose.model("match", matchSchema);
module.exports = Match;
