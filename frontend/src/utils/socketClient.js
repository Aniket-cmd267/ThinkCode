import { io } from "socket.io-client";

let contestSocket = null;

export function getContestSocket() {
  if (!contestSocket) {
    contestSocket = io("http://localhost:3000", {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }
  return contestSocket;
}
