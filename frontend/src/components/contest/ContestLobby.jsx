export default function ContestLobby({
  roomCode,
  setRoomCode,
  onCreateRoom,
  onJoinRoom,
  loading,
  error,
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-[#140909] p-6 shadow-[0_0_40px_rgba(239,68,68,0.08)]">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#F87171] font-semibold">
            Ranked Duel
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
            Real-time DSA battle rooms
          </h1>
          <p className="mt-4 text-slate-300 leading-relaxed">
            Create a private room, invite one opponent, race through three DSA
            questions, and let the timer decide who handled pressure better.
          </p>

          <div className="mt-6 grid gap-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
              2 players only, match starts automatically when both join.
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
              2 questions, sequential progression, 100 points per accepted solve.
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
              If one player leaves mid-match, the other wins instantly.
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#101010] p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-semibold">
                Create
              </p>
              <button
                type="button"
                onClick={onCreateRoom}
                disabled={loading}
                className="mt-3 w-full rounded-2xl bg-[#EF4444] px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#dc2626] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Working..." : "Create Room"}
              </button>
            </div>

            <div className="border-t border-white/8 pt-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-semibold">
                Join
              </p>
              <input
                type="text"
                value={roomCode}
                onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
                placeholder="Enter room code"
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all focus:border-[#F87171]/60"
              />
              <button
                type="button"
                onClick={onJoinRoom}
                disabled={loading || !roomCode.trim()}
                className="mt-3 w-full rounded-2xl border border-[#F87171]/25 bg-[#1A0A0A] px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-100 transition-all hover:border-[#F87171]/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                Join Room
              </button>
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
