import { useMemo, useState } from "react";
import { ArrowLeft, Code2, CheckCircle2, XCircle, Terminal, AlertTriangle, Zap, Cpu, Calendar, ChevronRight } from "lucide-react";
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
    if (normalized === "compile_error" || normalized === "error") return "Compile Error";
    if (normalized === "pending") return "Pending";
    return status || "--";
  }

  function statusStyle(status = "") {
    const s = String(status).toLowerCase();
    if (s.includes("accepted")) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (s.includes("wrong")) return "text-red-400 bg-red-500/10 border-red-500/20";
    return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  }

  return (
    <div className="space-y-6 text-slate-200 antialiased font-sans">
      
      {/* SECTION TOP HEADER */}
      <div className="flex items-end justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Submissions
          </h2>
        </div>
      </div>

      {selected ? (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* HEADER BACK-MENU NAVIGATION BAR */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1F2633]/60 backdrop-blur-md p-4 border border-slate-700/40 rounded-2xl shadow-xl">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 bg-[#161B26] text-slate-300 hover:text-white hover:bg-[#1F2633] hover:border-slate-500 transition-all active:scale-95 shadow-md"
            >
              <ArrowLeft size={14} /> Back
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Calendar size={13} />
              <span>{formatSubmittedAt(selected?.createdAt)}</span>
            </div>
          </div>

          {/* TWO COLUMN SIDE-BY-SIDE INTERACTIVE LAYOUT WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN CONTAINER: PREMIUM SOURCE CODE VIEWER */}
            <div className="lg:col-span-7 xl:col-span-8 group">
              <CodeBlock
                label={`${selected?.language || "Unknown"}`}
                code={selected?.code || ""}
                className="shadow-2xl border border-slate-700/40 rounded-2xl overflow-hidden transition-all group-hover:border-slate-600/60"
              />
            </div>

            <div className="lg:col-span-5 xl:col-span-4 space-y-5">
              <div className="bg-[#121824] border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent rounded-full pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                  <span className={`px-2.5 py-0.5 rounded-md border text-[10px] font-bold font-mono uppercase tracking-wide ${statusStyle(selected?.status)}`}>
                    {formatStatus(selected?.status)}
                  </span>
                </div>

                {String(selected?.status).toLowerCase() === "accepted" ? (
                  /* PREMIUM HIGH-CONTRAST SUCCESS METRIC VIEWER */
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center text-center space-y-3 py-2">
                      <div className="relative p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 shadow-lg shadow-emerald-950/40 animate-pulse">
                        <CheckCircle2 size={36} />
                        <div className="absolute inset-0 border border-dashed border-emerald-400/20 rounded-full scale-125" />
                      </div>
                    </div>

                    {/* INTERACTIVE METRIC BLOCKS */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-[#161B26] border border-slate-800 p-3.5 rounded-xl space-y-1 hover:border-slate-700 transition-all">
                        <div className="flex items-center gap-1 text-slate-400"><Zap size={13} className="text-amber-400" /> <span className="text-[10px] font-bold uppercase tracking-wider font-mono">RunTime</span></div>
                        <p className="text-lg font-black font-mono text-white tracking-tight">{formatRuntime(selected?.runtime)}</p>
                      </div>
                      <div className="bg-[#161B26] border border-slate-800 p-3.5 rounded-xl space-y-1 hover:border-slate-700 transition-all">
                        <div className="flex items-center gap-1 text-slate-400"><Cpu size={13} className="text-blue-400" /> <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Memory</span></div>
                        <p className="text-lg font-black font-mono text-white tracking-tight">{formatMemory(selected?.memory)}</p>
                      </div>
                    </div>

                    <div className="bg-emerald-500/[0.02] border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between font-mono text-xs">
                      <span className="text-slate-400 font-sans font-medium">TestCase:</span>
                      <span className="text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-md">
                        {selected?.testCasesPassed} / {selected?.testCasesTotal}
                      </span>
                    </div>
                  </div>
                ) : String(selected?.status).toLowerCase() === "wrong" && selected?.failedTestCaseDetails ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-[#161B26] border border-slate-800 p-4 rounded-xl shadow-inner">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Passed Sub-Tests:</span>
                      <span className="text-xs font-bold text-red-400 font-mono bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20">
                        {selected?.testCasesPassed} Passed / {selected?.testCasesTotal} Total
                      </span>
                    </div>

                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-1.5 font-sans text-xs font-bold text-slate-300 uppercase tracking-wide">
                        <Terminal size={14} className="text-red-400" />
                        Mismatch Traceback (Testcase {selected?.failedTestCaseDetails?.index})
                      </div>

                      <div className="bg-[#161B26] border border-slate-800/80 rounded-xl p-4 space-y-4 font-mono text-xs shadow-inner">
                        <div>
                          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500 block mb-1">Standard Input Stream (`stdin`)</span>
                          <div className="bg-[#0B0F19] border border-slate-800/60 text-slate-200 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-24 break-all">
                            {selected?.failedTestCaseDetails?.input}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-emerald-400 block mb-1">Expected Output</span>
                            <div className="bg-[#0B0F19] border border-emerald-950/30 text-emerald-400 p-3 rounded-lg overflow-x-auto font-bold break-all">
                              {selected?.failedTestCaseDetails?.expected}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-red-400 block mb-1">Received Output</span>
                            <div className="bg-[#0B0F19] border border-red-950/30 text-red-400 p-3 rounded-lg overflow-x-auto font-bold break-all">
                              {selected?.failedTestCaseDetails?.received || "No Output"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  (selected?.errorMessage || selected?.compile_output) && (
                    <div className="space-y-2 font-mono text-xs">
                      <div className="flex items-center gap-1.5 font-sans text-xs font-bold text-red-400 uppercase tracking-wide">
                        {/* <AlertTriangle size={14} /> Diagnostic Error Stack */}
                      </div>
                      <pre className="w-full bg-[#161B26] border border-red-500/20 p-4 rounded-xl text-red-300 text-[11px] overflow-x-auto whitespace-pre-wrap max-h-56 leading-relaxed shadow-inner">
                        {selected?.errorMessage || selected?.compile_output}
                      </pre>
                    </div>
                  )
                )}
              </div>
            </div>

          </div>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-[#121824]/40 p-12 text-center text-slate-500 font-mono text-xs uppercase tracking-wider">
          No submissions yet.
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800/80 bg-[#121824] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-4 px-5 py-4 bg-[#161B26] border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            <div className="col-span-1">#</div>
            <div className="col-span-3 lg:col-span-2">Execution State</div>
            <div className="col-span-2">Language</div>
            <div className="col-span-2">Runtime</div>
            <div className="col-span-2">Memory</div>
            <div className="col-span-1 hidden lg:block">TestCase</div>
          </div>

          <div className="divide-y divide-slate-800/60">
            {rows.map((submission, index) => (
              <div
                key={submission?._id || index}
                className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-[#161B26]/30 transition-colors"
              >
                <div className="col-span-1 text-slate-500 font-mono text-xs font-bold">{index + 1}</div>
                <div className="col-span-3 lg:col-span-2">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-md border text-xs font-bold font-mono tracking-wide ${statusStyle(submission?.status)}`}>
                    {formatStatus(submission?.status)}
                  </span>
                </div>
                <div className="col-span-2 text-slate-200 font-mono text-xs uppercase font-bold">{submission?.language || "--"}</div>
                <div className="col-span-2 text-slate-300 text-xs font-mono">
                  {formatRuntime(submission?.runtime)}
                </div>
                <div className="col-span-2 text-slate-300 text-xs font-mono">
                  {formatMemory(submission?.memory)}
                </div>
                <div className="col-span-1 text-slate-300 text-xs font-mono font-black">
                  {submission?.testCasesPassed ?? 0} <span className="text-slate-600">/</span> {submission?.testCasesTotal ?? 0}
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelected(submission)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 bg-[#161B26] text-slate-300 hover:text-white hover:bg-[#1F2633] hover:border-slate-500 transition-all active:scale-95 shadow"
                  >
                    <Code2 size={13} />
                    <span>View</span>
                    <ChevronRight size={12} className="opacity-40" />
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
