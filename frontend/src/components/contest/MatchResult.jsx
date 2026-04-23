export default function MatchResult({ room, userId }) {
  const isWinner = room?.winner?.userId === userId;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#101010] p-5">
      <p className="text-[11px] uppercase tracking-[0.3em] text-[#F87171] font-semibold">
        Match Result
      </p>
      <h2 className="mt-3 text-2xl font-black text-white">
        {room?.winner
          ? `${room.winner.firstName} wins`
          : "Match finished"}
      </h2>
      <p className="mt-3 text-slate-300">
        {isWinner
          ? "You won this duel."
          : room?.winner
            ? `${room.winner.firstName} took this one.`
            : "No winner was recorded."}
      </p>
      <p className="mt-2 text-sm text-slate-400">
        Reason: {room?.winner?.reason || "completed"}
      </p>
    </div>
  );
}
