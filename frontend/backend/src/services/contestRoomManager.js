const ROOM_SIZE = 2;
const MATCH_DURATION_MS = 20 * 60 * 1000;
const POINTS_PER_SOLVE = 100;

class ContestRoomManager {
  constructor() {
    this.rooms = new Map();
  }

  generateRoomId() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let roomId = "";
    for (let index = 0; index < 6; index += 1) {
      roomId += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return roomId;
  }

  createRoom(hostUser) {
    // generating a room.
    let roomId = this.generateRoomId();
    // this loop ensures that generated code for the room is unique.
    while (this.rooms.has(roomId)) {
      roomId = this.generateRoomId();
    }

    const room = {
      roomId,
      status: "waiting",
      players: [
        {
          userId: String(hostUser._id),
          firstName: hostUser.firstName,
          connected: true,
          score: 0,
          currentQuestionIndex: 0,
          solvedCount: 0,
          completedAt: null,
        },
      ],
      questions: [],
      startedAt: null,
      endsAt: null,
      winner: null,
      matchId: null,
      intervalId: null,
    };

    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId) || null;
  }

  joinRoom(roomId, user) {
    const room = this.getRoom(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const userId = String(user._id);
    const existingPlayer = room.players.find((player) => player.userId === userId);
    if (existingPlayer) {
      existingPlayer.connected = true;
      return room;
    }

    if (room.players.length >= ROOM_SIZE) {
      throw new Error("Room is already full");
    }

    room.players.push({
      userId,
      firstName: user.firstName,
      connected: true,
      score: 0,
      currentQuestionIndex: 0,
      solvedCount: 0,
      completedAt: null,
    });

    return room;
  }

  markConnected(roomId, userId) {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const player = room.players.find((item) => item.userId === String(userId));
    if (player) {
      player.connected = true;
    }
    return room;
  }

  markDisconnected(roomId, userId) {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const player = room.players.find((item) => item.userId === String(userId));
    if (player) {
      player.connected = false;
    }

    return room;
  }

  startMatch(room, questions) {
    room.status = "active";
    room.questions = questions;
    room.startedAt = new Date();
    room.endsAt = new Date(Date.now() + MATCH_DURATION_MS);
    room.winner = null;

    room.players = room.players.map((player) => ({
      ...player,
      connected: true,
      score: 0,
      currentQuestionIndex: 0,
      solvedCount: 0,
      completedAt: null,
    }));

    return room;
  }

  getPlayer(room, userId) {
    return room.players.find((item) => item.userId === String(userId)) || null;
  }

  getOpponent(room, userId) {
    return room.players.find((item) => item.userId !== String(userId)) || null;
  }

  getCurrentProblem(room, userId) {
    const player = this.getPlayer(room, userId);
    if (!player) return null;

    const currentQuestion =
      room.questions[player.currentQuestionIndex] || room.questions[0];
    if (!currentQuestion) return null;

    return currentQuestion.publicProblem || currentQuestion || null;
  }

  applyAcceptedSubmission(room, userId) {
    const player = this.getPlayer(room, userId);
    if (!player) {
      throw new Error("Player not found");
    }

    player.score += POINTS_PER_SOLVE;
    player.solvedCount += 1;
    player.currentQuestionIndex += 1;

    if (player.currentQuestionIndex >= room.questions.length) {
      player.completedAt = new Date();
    }

    return player;
  }

  areAllPlayersDone(room) {
    return room.players.every(
      (player) => player.currentQuestionIndex >= room.questions.length
    );
  }

  resolveWinner(room, reason = "completed") {
    const [first, second] = room.players;
    let winner = null;

    if (!second) {
      winner = first || null;
    } else if (first.score > second.score) {
      winner = first;
    } else if (second.score > first.score) {
      winner = second;
    } else if (first.completedAt && second.completedAt) {
      winner = first.completedAt <= second.completedAt ? first : second;
    } else if (first.completedAt) {
      winner = first;
    } else if (second.completedAt) {
      winner = second;
    } else {
      winner = null;
    }

    room.status = "finished";
    room.winner = winner
      ? {
          userId: winner.userId,
          firstName: winner.firstName,
          reason,
        }
      : null;

    return room.winner;
  }

  getTimeLeftMs(room) {
    if (!room?.endsAt) return 0;
    return Math.max(0, room.endsAt.getTime() - Date.now());
  }

  clearRoomTimer(room) {
    if (room?.intervalId) {
      clearInterval(room.intervalId);
      room.intervalId = null;
    }
  }

  removeRoom(roomId) {
    const room = this.getRoom(roomId);
    if (room) {
      this.clearRoomTimer(room);
    }
    this.rooms.delete(roomId);
  }

  buildStateForUser(room, userId) {
    const player = this.getPlayer(room, userId);
    const opponent = this.getOpponent(room, userId);

    return {
      roomId: room.roomId,
      status: room.status,
      players: room.players.map((item) => ({
        userId: item.userId,
        firstName: item.firstName,
        connected: item.connected,
        score: item.score,
        solvedCount: item.solvedCount,
        currentQuestionIndex: item.currentQuestionIndex,
      })),
      viewer: player
        ? {
            userId: player.userId,
            firstName: player.firstName,
            score: player.score,
            solvedCount: player.solvedCount,
            currentQuestionIndex: player.currentQuestionIndex,
          }
        : null,
      opponent: opponent
        ? {
            userId: opponent.userId,
            firstName: opponent.firstName,
            score: opponent.score,
            solvedCount: opponent.solvedCount,
            currentQuestionIndex: opponent.currentQuestionIndex,
            connected: opponent.connected,
          }
        : null,
      totalQuestions: room.questions.length,
      currentProblem: this.getCurrentProblem(room, userId),
      currentQuestionNumber: player ? player.currentQuestionIndex + 1 : 1,
      timeLeftMs: this.getTimeLeftMs(room),
      winner: room.winner,
      startedAt: room.startedAt,
      endsAt: room.endsAt,
    };
  }
}

module.exports = new ContestRoomManager();
