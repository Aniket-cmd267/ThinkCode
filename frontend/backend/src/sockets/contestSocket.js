const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");
const Match = require("../models/match");
const MatchSubmission = require("../models/matchSubmission");
const roomManager = require("../services/contestRoomManager");
const { ensureMatchStarted } = require("../controllers/contestController");
const { evaluateContestSubmission } = require("../services/contestSubmissionService");

function parseCookies(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)  
    .reduce((acc, item) => {
      const [key, ...rest] = item.split("=");
      acc[key] = decodeURIComponent(rest.join("="));
      return acc;
    }, {});
}

async function authenticateSocket(socket, next) {
  try {
    const cookies = parseCookies(socket.handshake.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return next(new Error("Authentication failed"));
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) {
      return next(new Error("Authentication failed"));
    }

    const user = await User.findById(payload._id);
    if (!user) {
      return next(new Error("Authentication failed"));
    }

    socket.user = user;
    return next();
  } catch (err) {
    return next(new Error("Authentication failed"));
  }
}

async function persistMatchState(room) {
  if (!room?.matchId) return;

  await Match.findByIdAndUpdate(room.matchId, {
    status: room.status,
    scores: Object.fromEntries(
      room.players.map((player) => [player.userId, player.score])
    ),
    winner: room.winner
      ? {
          userId: room.winner.userId,
          firstName: room.winner.firstName,
          reason: room.winner.reason,
        }
      : {
          userId: null,
          firstName: null,
          reason: null,
        },
    endedAt: room.status === "finished" ? new Date() : null,
  });
}

function emitRoomState(io, room) {
  room.players.forEach((player) => {
    io.to(`contest-user:${player.userId}`).emit(
      "contest:room-updated",
      roomManager.buildStateForUser(room, player.userId)
    );
  });
}

async function finishMatch(io, room, reason) {
  roomManager.clearRoomTimer(room);
  roomManager.resolveWinner(room, reason);
  await persistMatchState(room);
  emitRoomState(io, room);
  io.to(`contest-room:${room.roomId}`).emit("contest:match-finished", {
    roomId: room.roomId,
    winner: room.winner,
    reason,
  });
}

function startRoomTimer(io, room) {
  roomManager.clearRoomTimer(room);

  room.intervalId = setInterval(async () => {
    const latestRoom = roomManager.getRoom(room.roomId);
    if (!latestRoom || latestRoom.status !== "active") {
      roomManager.clearRoomTimer(latestRoom || room);
      return;
    }

    const timeLeftMs = roomManager.getTimeLeftMs(latestRoom);
    io.to(`contest-room:${latestRoom.roomId}`).emit("contest:timer-updated", {
      roomId: latestRoom.roomId,
      timeLeftMs,
    });

    if (timeLeftMs <= 0) {
      await finishMatch(io, latestRoom, "timer");
    }
  }, 1000);
}

function registerContestSocket(io) {
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const userId = String(socket.user._id);
    socket.join(`contest-user:${userId}`);

    socket.on("contest:join-room", async ({ roomId }, callback = () => {}) => {
      try {
        const normalizedRoomId = String(roomId || "").trim().toUpperCase();
        if (!normalizedRoomId) {
          throw new Error("Room ID is required");
        }

        let room = roomManager.getRoom(normalizedRoomId);
        if (!room) {
          throw new Error("Room not found");
        }

        roomManager.markConnected(normalizedRoomId, userId);
        room = room.players.some((player) => player.userId === userId)
          ? room
          : roomManager.joinRoom(normalizedRoomId, socket.user);

        const statusBeforeStart = room.status;
        room = await ensureMatchStarted(room);

        socket.data.roomId = normalizedRoomId;
        socket.join(`contest-room:${normalizedRoomId}`);

        if (statusBeforeStart === "waiting" && room.status === "active") {
          startRoomTimer(io, room);
          io.to(`contest-room:${normalizedRoomId}`).emit("contest:match-started", {
            roomId: normalizedRoomId,
            startedAt: room.startedAt,
            endsAt: room.endsAt,
          });
        }

        emitRoomState(io, room);
        callback({ ok: true });
      } catch (err) {
        callback({ ok: false, message: err.message || "Unable to join room" });
      }
    });

    socket.on("contest:submit-solution", async (payload, callback = () => {}) => {
      try {
        const roomId = String(payload?.roomId || socket.data.roomId || "").trim().toUpperCase();
        const code = payload?.code;
        const language = payload?.language;

        if (!roomId || !code || !language) {
          throw new Error("Incomplete submission payload");
        }

        const room = roomManager.getRoom(roomId);
        if (!room || room.status !== "active") {
          throw new Error("Match is not active");
        }

        const player = roomManager.getPlayer(room, userId);
        if (!player) {
          throw new Error("You are not part of this match");
        }

        const questionIndex = player.currentQuestionIndex;
        const currentQuestion = room.questions[questionIndex];

        if (!currentQuestion) {
          throw new Error("No question available");
        }

        const result = await evaluateContestSubmission(currentQuestion, code, language);

        await MatchSubmission.create({
          matchId: room.matchId,
          roomId: room.roomId,
          userId,
          problemId: currentQuestion.problemId,
          questionIndex,
          code,
          language,
          status: result.status,
          runtime: result.runtime,
          memory: result.memory,
          errorMessage: result.errorMessage,
          testCasesPassed: result.testCasesPassed,
          testCasesTotal: result.testCasesTotal,
        });

        if (result.status === "accepted") {
          roomManager.applyAcceptedSubmission(room, userId);
          await persistMatchState(room);
        }

        emitRoomState(io, room);

        io.to(`contest-user:${userId}`).emit("contest:submission-result", {
          roomId,
          questionIndex,
          result,
        });

        if (result.status === "accepted") {
          io.to(`contest-room:${roomId}`).emit("contest:question-advanced", {
            roomId,
            userId,
            solvedCount: roomManager.getPlayer(room, userId)?.solvedCount || 0,
          });
        }

        if (roomManager.areAllPlayersDone(room)) {
          await finishMatch(io, room, "completed");
        }

        callback({ ok: true, result });
      } catch (err) {
        callback({ ok: false, message: err.message || "Submission failed" });
      }
    });

    socket.on("contest:leave-room", async ({ roomId }, callback = () => {}) => {
      try {
        const normalizedRoomId = String(roomId || socket.data.roomId || "").trim().toUpperCase();
        const room = roomManager.getRoom(normalizedRoomId);
        if (!room) {
          return callback({ ok: true });
        }

        roomManager.markDisconnected(normalizedRoomId, userId);

        if (room.status === "active") {
          const opponent = roomManager.getOpponent(room, userId);
          if (opponent) {
            room.status = "finished";
            room.winner = {
              userId: opponent.userId,
              firstName: opponent.firstName,
              reason: "opponent-left",
            };
            roomManager.clearRoomTimer(room);
            await persistMatchState(room);
            emitRoomState(io, room);
            io.to(`contest-room:${normalizedRoomId}`).emit("contest:player-left", {
              roomId: normalizedRoomId,
              userId,
              winner: room.winner,
            });
          }
        } else {
          emitRoomState(io, room);
        }

        callback({ ok: true });
      } catch (err) {
        callback({ ok: false, message: err.message || "Unable to leave room" });
      }
    });

    socket.on("disconnect", async () => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      const room = roomManager.getRoom(roomId);
      if (!room) return;

      roomManager.markDisconnected(roomId, userId);

      if (room.status === "active") {
        const opponent = roomManager.getOpponent(room, userId);
        if (opponent) {
          room.status = "finished";
          room.winner = {
            userId: opponent.userId,
            firstName: opponent.firstName,
            reason: "opponent-disconnected",
          };
          roomManager.clearRoomTimer(room);
          await persistMatchState(room);
          emitRoomState(io, room);
          io.to(`contest-room:${roomId}`).emit("contest:player-left", {
            roomId,
            userId,
            winner: room.winner,
          });
        }
      } else {
        emitRoomState(io, room);
      }
    });
  });
}

module.exports = { registerContestSocket };
