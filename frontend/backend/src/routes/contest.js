const express = require("express");
const userMiddleware = require("../middleware/userMiddleware");
const {
  createRoom,
  joinRoom,
  getRoom,
} = require("../controllers/contestController");

const contestRouter = express.Router();

contestRouter.post("/create-room", userMiddleware, createRoom);
contestRouter.post("/join-room", userMiddleware, joinRoom);
contestRouter.get("/room/:roomId", userMiddleware, getRoom);

module.exports = contestRouter;
