import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { getContestSocket } from "../utils/socketClient";
import WaitingRoom from "../components/contest/WaitingRoom";
import MatchArena from "../components/contest/MatchArena";

const pendingLeaveTimeouts = new Map();

export default function ContestRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.slice1);
  const hasJoinedLiveRoomRef = useRef(false);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [error, setError] = useState("");

  const normalizedRoomId = useMemo(
    () => String(roomId || "").trim().toUpperCase(),
    [roomId]
  );

  useEffect(() => {
    let mounted = true;
    const socket = getContestSocket();
    const existingTimeout = pendingLeaveTimeouts.get(normalizedRoomId);

    if (existingTimeout) {
      clearTimeout(existingTimeout);
      pendingLeaveTimeouts.delete(normalizedRoomId);
    }

    async function loadRoom() {
      try {
        setLoading(true);
        setError("");
        const { data } = await axiosClient.get(`/contest/room/${normalizedRoomId}`);
        if (!mounted) return;
        setRoom(data.room);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Unable to load room");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadRoom();

    if (!socket.connected) {
      socket.connect();
    }

    function handleRoomUpdated(payload) {
      if (payload?.roomId !== normalizedRoomId) return;
      setRoom(payload);
    }

    function handleTimerUpdated(payload) {
      if (payload?.roomId !== normalizedRoomId) return;
      setRoom((prev) => (prev ? { ...prev, timeLeftMs: payload.timeLeftMs } : prev));
    }

    function handleSubmissionResult(payload) {
      if (payload?.roomId !== normalizedRoomId) return;
      setSubmissionResult(payload.result);
      setSubmitting(false);
    }

    function handleMatchFinished(payload) {
      if (payload?.roomId !== normalizedRoomId) return;
      setRoom((prev) =>
        prev
          ? {
              ...prev,
              status: "finished",
              winner: payload.winner,
            }
          : prev
      );
      setSubmitting(false);
    }

    socket.on("contest:room-updated", handleRoomUpdated);
    socket.on("contest:timer-updated", handleTimerUpdated);
    socket.on("contest:submission-result", handleSubmissionResult);
    socket.on("contest:match-finished", handleMatchFinished);

    socket.emit("contest:join-room", { roomId: normalizedRoomId }, (response) => {
      if (!response?.ok) {
        setError(response?.message || "Unable to join live room");
        hasJoinedLiveRoomRef.current = false;
        return;
      }

      hasJoinedLiveRoomRef.current = true;
    });

    function handlePageHide() {
      if (hasJoinedLiveRoomRef.current) {
        socket.emit("contest:leave-room", { roomId: normalizedRoomId });
      }
    }

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      mounted = false;
      window.removeEventListener("pagehide", handlePageHide);

      if (hasJoinedLiveRoomRef.current) {
        const timeoutId = window.setTimeout(() => {
          socket.emit("contest:leave-room", { roomId: normalizedRoomId });
          pendingLeaveTimeouts.delete(normalizedRoomId);
        }, 300);

        pendingLeaveTimeouts.set(normalizedRoomId, timeoutId);
      }

      socket.off("contest:room-updated", handleRoomUpdated);
      socket.off("contest:timer-updated", handleTimerUpdated);
      socket.off("contest:submission-result", handleSubmissionResult);
      socket.off("contest:match-finished", handleMatchFinished);
    };
  }, [normalizedRoomId]);

  async function handleSubmit({ code, language }) {
    const socket = getContestSocket();
    setSubmitting(true);

    socket.emit(
      "contest:submit-solution",
      {
        roomId: normalizedRoomId,
        code,
        language,
      },
      (response) => {
        if (!response?.ok) {
          setSubmitting(false);
          setSubmissionResult({
            status: "error",
            testCasesPassed: 0,
            testCasesTotal: 0,
            runtime: 0,
            memory: 0,
            errorMessage: response?.message || "Submission failed",
          });
        }
      }
    );
  }

  async function handleCopyRoomCode() {
    try {
      await navigator.clipboard.writeText(normalizedRoomId);
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading room...
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-200">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => navigate("/contest")}
            className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-sm text-white"
          >
            Back to Contest Lobby
          </button>
        </div>
      </div>
    );
  }

  if (room?.status === "waiting") {
    return <WaitingRoom room={room} onCopyRoomCode={handleCopyRoomCode} />;
  }

  return (
    <MatchArena
      room={room}
      userId={String(user?._id || "")}
      submissionResult={submissionResult}
      onSubmit={handleSubmit}
      submitting={submitting}
    />
  );
}
