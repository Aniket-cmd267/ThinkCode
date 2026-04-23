const Match = require("../models/match");
const roomManager = require("../services/contestRoomManager");
const { pickContestProblems } = require("../services/contestProblemService");

async function ensureMatchStarted(room) {
  if (room.status !== "waiting" || room.players.length < 2) {
    return room;
  }
  console.log(room)
  const questions = await pickContestProblems(2);
  roomManager.startMatch(room, questions);

  const match = await Match.create({
    roomId: room.roomId,
    players: room.players.map((player) => ({
      userId: player.userId,
      firstName: player.firstName,
    })),
    questions: questions.map((question) => ({
      problemId: question.problemId,
      title: question.title,
      difficulty: question.difficulty,
      tags: question.tags,
    })),
    status: "active",
    scores: Object.fromEntries(
      room.players.map((player) => [player.userId, player.score])
    ),
    startedAt: room.startedAt,
  });

  room.matchId = match._id;
  return room;
}

const createRoom = async (req, res) => {
  try {
    // console.log(req.result)
    const room = roomManager.createRoom(req.result);
    console.log(room)
    const state = roomManager.buildStateForUser(room, req.result._id);
    console.log(state)
    res.status(201).json({
      roomId: room.roomId,
      room: state,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Unable to create room" });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    let room = roomManager.joinRoom(String(roomId).trim().toUpperCase(), req.result);
    room = await ensureMatchStarted(room);

    const state = roomManager.buildStateForUser(room, req.result._id);
    res.status(200).json({
      roomId: room.roomId,
      room: state,
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Unable to join room" });
  }
};

const getRoom = async (req, res) => {
  try {
    const room = roomManager.getRoom(String(req.params.roomId).trim().toUpperCase());
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const isParticipant = room.players.some(
      (player) => player.userId === String(req.result._id)
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "You are not part of this room" });
    }

    return res.status(200).json({
      roomId: room.roomId,
      room: roomManager.buildStateForUser(room, req.result._id),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Unable to load room" });
  }
};

module.exports = { createRoom, joinRoom, getRoom, ensureMatchStarted };
