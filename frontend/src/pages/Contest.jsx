import { useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import ContestLobby from "../components/contest/ContestLobby";

export default function Contest() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateRoom() {
    try {
      setLoading(true);
      setError("");
      const { data } = await axiosClient.post("/contest/create-room");
      navigate(`/contest/${data.roomId}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to create room");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinRoom() {
    try {
      setLoading(true);
      setError("");
      const normalizedRoomCode = roomCode.trim().toUpperCase();
      console.log(normalizedRoomCode)
      await axiosClient.post("/contest/join-room", { roomId: normalizedRoomCode });
      navigate(`/contest/${normalizedRoomCode}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to join room");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ContestLobby
      roomCode={roomCode}
      setRoomCode={setRoomCode}
      onCreateRoom={handleCreateRoom}
      onJoinRoom={handleJoinRoom}
      loading={loading}
      error={error}
    />
  );
}
