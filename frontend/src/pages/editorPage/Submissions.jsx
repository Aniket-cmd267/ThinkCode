import { useMemo, useState } from "react";
import { ArrowLeft, Code2 } from "lucide-react";
import { CodeBlock } from "./CodeBlock";

export default function Submissions({ submissionHistory }) {
  const [selected, setSelected] = useState(null);

  const rows = useMemo(() => {
    if (!Array.isArray(submissionHistory)) return [];

    return [...submissionHistory].sort((a, b) => {
      const first = new Date(b?.createdAt || 0).getTime();
      const second = new Date(a?.createdAt || 0).getTime();
      return first - second;
    });
  }, [submissionHistory]);

  function formatRuntime(runtime) {
    const value = Number(runtime);
    if (!Number.isFinite(value) || value < 0) return "--";
    if (value === 0) return "0 ms";

    const milliseconds = value < 10 ? value * 1000 : value;
    if (milliseconds < 1000) return `${milliseconds.toFixed(0)} ms`;
    return `${(milliseconds / 1000).toFixed(2)} s`;
  }

  function formatMemory(memory) {
    const value = Number(memory);
    if (!Number.isFinite(value) || value < 0) return "--";
    if (value >= 1024) return `${(value / 1024).toFixed(2)} MB`;
    return `${value.toFixed(0)} KB`;
  }

  function formatSubmittedAt(dateString) {
    if (!dateString) return "--";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "--";

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  function formatStatus(status = "") {
    const normalized = String(status).toLowerCase();
    if (normalized === "accepted") return "Accepted";
    if (normalized === "wrong") return "Wrong Answer";
    if (normalized === "error") return "Runtime / Compile Error";
    if (normalized === "pending") return "Pending";
    return status || "--";
  }

  function statusStyle(status = "") {
    const s = String(status).toLowerCase();
    if (s.includes("accepted")) return "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";
    if (s.includes("wrong")) return "text-rose-300 bg-rose-500/10 border-rose-500/20";
    if (s.includes("error") || s.includes("time")) return "text-amber-300 bg-amber-400/10 border-amber-400/20";
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
                {formatStatus(selected?.status)}
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-black/20 text-slate-200">
                {selected?.language || "--"}
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-black/20 text-slate-300">
                {formatRuntime(selected?.runtime)}
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-black/20 text-slate-300">
                {formatMemory(selected?.memory)}
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-black/20 text-slate-300">
                {selected?.testCasesPassed ?? 0}/{selected?.testCasesTotal ?? 0}
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-black/20 text-slate-300">
                {formatSubmittedAt(selected?.createdAt)}
              </span>
            </div>
          </div>

          <CodeBlock
            label={`Submitted Code - ${selected?.language || "Unknown"}`}
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
          <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-[#1A1A1A]/60 border-b border-white/[0.06] text-[10px] uppercase tracking-[0.22em] text-slate-500">
            <div className="col-span-1">#</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Lang</div>
            <div className="col-span-2">Runtime</div>
            <div className="col-span-2">Memory</div>
            <div className="col-span-1">Pass</div>
            <div className="col-span-1">When</div>
            <div className="col-span-1 text-right">Code</div>
          </div>

          <div className="divide-y divide-white/5">
            {rows.map((submission, index) => (
              <div
                key={submission?._id || index}
                className="grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-black/25 transition-colors"
              >
                <div className="col-span-1 text-slate-400 text-sm">{index + 1}</div>
                <div className="col-span-2">
                  <span className={["inline-flex px-3 py-1 rounded-full border text-xs", statusStyle(submission?.status)].join(" ")}>
                    {formatStatus(submission?.status)}
                  </span>
                </div>
                <div className="col-span-2 text-slate-200 text-sm">{submission?.language || "--"}</div>
                <div className="col-span-2 text-slate-300 text-sm">
                  {formatRuntime(submission?.runtime)}
                </div>
                <div className="col-span-2 text-slate-300 text-sm">
                  {formatMemory(submission?.memory)}
                </div>
                <div className="col-span-1 text-slate-300 text-sm">
                  {submission?.testCasesPassed ?? 0}/{submission?.testCasesTotal ?? 0}
                </div>
                <div className="col-span-1 text-slate-400 text-sm">
                  {formatSubmittedAt(submission?.createdAt)}
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelected(submission)}
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
