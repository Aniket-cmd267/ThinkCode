import { useMemo, useState } from "react";
import { ArrowLeft, Code2 } from "lucide-react";
import { CodeBlock } from "./CodeBlock";

export default function Submissions({ submissionHistory }) {
  const [selected, setSelected] = useState(null);

  const rows = useMemo(() => submissionHistory || [], [submissionHistory]);

  function statusStyle(status = "") {
    const s = String(status).toLowerCase();
    if (s.includes("accepted")) return "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";
    if (s.includes("wrong")) return "text-rose-300 bg-rose-500/10 border-rose-500/20";
    if (s.includes("time")) return "text-amber-300 bg-amber-400/10 border-amber-400/20";
    return "text-slate-300 bg-white/5 border-white/10";
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
            Submissions
          </h2>
        </div>
        <span className="text-[10px] uppercase tracking-[0.28em] text-[#F87171]/80 font-semibold">
          {rows.length} total
        </span>
      </div>

      {selected ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all"
            >
              <ArrowLeft size={16} />
              Back to list
            </button>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={["px-3 py-1 rounded-full border", statusStyle(selected?.status)].join(" ")}>
                {selected?.status || "status"}
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-black/20 text-slate-200">
                {selected?.language || "lang"}
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-black/20 text-slate-300">
                {selected?.runtime != null ? `${selected.runtime} s` : "—"}
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-black/20 text-slate-300">
                {selected?.memory != null ? `${selected.memory} kb` : "—"}
              </span>
            </div>
          </div>

          <CodeBlock
            label={`Submitted Code • ${selected?.language || "Unknown"}`}
            code={selected?.code || ""}
            className="shadow-[0_0_34px_rgba(248,113,113,0.14)]"
          />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-slate-400">
          No submissions yet. Run or submit your code to see history here.
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-[#161616]/50 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-[#1A1A1A]/60 border-b border-white/[0.06] text-[10px] uppercase tracking-[0.22em] text-slate-500">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2">Lang</div>
            <div className="col-span-2">Runtime</div>
            <div className="col-span-2">Memory</div>
            <div className="col-span-2 text-right">Code</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {rows.map((s, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-black/25 transition-colors"
              >
                <div className="col-span-1 text-slate-400 text-sm">{i + 1}</div>
                <div className="col-span-3">
                  <span className={["inline-flex px-3 py-1 rounded-full border text-xs", statusStyle(s?.status)].join(" ")}>
                    {s?.status || "—"}
                  </span>
                </div>
                <div className="col-span-2 text-slate-200 text-sm">{s?.language || "—"}</div>
                <div className="col-span-2 text-slate-300 text-sm">
                  {s?.runtime != null ? `${s.runtime} s` : "—"}
                </div>
                <div className="col-span-2 text-slate-300 text-sm">
                  {s?.memory != null ? `${s.memory} kb` : "—"}
                </div>
                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelected(s)}
                    className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all"
                  >
                    <Code2 size={16} />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}