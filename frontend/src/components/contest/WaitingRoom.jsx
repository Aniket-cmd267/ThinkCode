export default function WaitingRoom({ room, onCopyRoomCode }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="rounded-3xl border border-white/10 bg-[#101010] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#F87171] font-semibold">
              Waiting Room
            </p>
            <h1 className="mt-2 text-3xl font-black text-white">
              Room {room?.roomId}
            </h1>
          </div>
          <button
            type="button"
            onClick={onCopyRoomCode}
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-200 hover:border-[#F87171]/60"
          >
            Copy Code
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[0, 1].map((index) => {
            const player = room?.players?.[index];
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                  Slot {index + 1}
                </p>
                <p className="mt-3 text-xl font-bold text-white">
                  {player ? player.firstName : "Waiting for player..."}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {player ? "Ready in room" : "Share the room code with your opponent"}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-[#F87171]/10 bg-[#140909] p-4 text-slate-300">
          Match starts automatically as soon as both players enter.
        </div>
      </div>
    </div>
  );
}
