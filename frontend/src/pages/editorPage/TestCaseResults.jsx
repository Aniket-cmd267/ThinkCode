import { useState } from "react";
import { ChevronDown, CheckCircle, XCircle, AlertCircle, Clock, Cpu, Terminal, ShieldAlert, Zap, HelpCircle } from "lucide-react";

function normalizeNewlines(s = "") {
  return String(s).replace(/\\n/g, "\n");
}

export default function TestCaseResults({ results, totalTestCases, status, errorMessage, runtime, memory, failedTestCaseDetails }) {
  const [expandedTestCase, setExpandedTestCase] = useState(0);

  // Safely normalize status values from backend
  const normalizedStatus = String(status || "").toLowerCase().trim();

  // 1. CONDITIONAL FALLBACK: EMPTY APP STATE
  if (!status && (!results || results.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-2xl bg-[#0D0D0D]">
        <HelpCircle size={20} className="mb-2 opacity-60 text-slate-600" />
        <span>Execute "Run" for visible testcases or "Submit" for evaluation metrics.</span>
      </div>
    );
  }

  // 2. COMPREHENSIVE STATUS ACCENT MANAGER FOR ALL STATES (RUN & SUBMIT)
  const getStatusConfig = () => {
    switch (normalizedStatus) {
      case "accepted":
        return {
          label: "Accepted",
          color: "text-emerald-400",
          bg: "bg-emerald-950/40",
          border: "border-emerald-600/40",
          icon: CheckCircle
        };
      case "wrong":
      case "wrong answer":
        return {
          label: "Wrong Answer",
          color: "text-rose-400",
          bg: "bg-rose-950/40",
          border: "border-rose-600/40",
          icon: XCircle
        };
      case "time_limit_exceeded":
      case "tle":
        return {
          label: "Time Limit Exceeded",
          color: "text-amber-400",
          bg: "bg-amber-950/40",
          border: "border-amber-600/40",
          icon: Clock
        };
      case "memory_limit_exceeded":
      case "mle":
        return {
          label: "Memory Limit Exceeded",
          color: "text-purple-400",
          bg: "bg-purple-950/40",
          border: "border-purple-600/40",
          icon: Cpu
        };
      case "compile_error":
      case "compile error":
        return {
          label: "Compilation Error",
          color: "text-slate-400",
          bg: "bg-slate-900/60",
          border: "border-slate-700/50",
          icon: ShieldAlert
        };
      case "runtime_error":
      case "runtime":
      case "error":
        return {
          label: "Runtime Error",
          color: "text-orange-400",
          bg: "bg-orange-950/40",
          border: "border-orange-600/40",
          icon: AlertCircle
        };
      case "output_limit_exceeded":
        return {
          label: "Output Limit Exceeded",
          color: "text-fuchsia-400",
          bg: "bg-fuchsia-950/40",
          border: "border-fuchsia-600/40",
          icon: Zap
        };
      default:
        return {
          label: "Unknown Error",
          color: "text-slate-400",
          bg: "bg-slate-900/60",
          border: "border-slate-700/50",
          icon: ShieldAlert
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;
  const testCasesPassed = results?.filter((t) => t.passed).length || 0;

  // Determine if this is a "Run" evaluation layer or a "Submit" layer
  const isSubmitMode = !results || results.length === 0;

  return (
    <div className="h-full bg-[#0D0D0D] text-slate-100 flex flex-col font-sans select-text">
      
      {/* ===== OVERALL SUMMARY SUB-HEADER BAR ===== */}
      <div className={`${config.bg} border-b ${config.border} p-4 md:p-6 transition-all duration-200 shadow-lg`}>
        <div className="flex items-start gap-4">
          <div className={`p-2 bg-black/20 rounded-xl border ${config.border} ${config.color}`}>
            <StatusIcon size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className={`text-xl md:text-2xl font-black tracking-tight ${config.color}`}>
                {config.label}
              </h2>
              
              {!isSubmitMode ? (
                /* Run Mode Assertion Count Indicator */
                <span className="text-xs font-semibold bg-black/30 border border-white/5 px-2.5 py-0.5 rounded-full text-slate-300">
                  {testCasesPassed}/{totalTestCases || results.length} Testcases Passed
                </span>
              ) : (
                /* Submit Mode Hidden Assertion Count Indicator */
                normalizedStatus !== "compile_error" && normalizedStatus !== "error" && totalTestCases !== undefined && (
                  <span className="text-xs font-bold bg-black/30 border border-white/5 px-2.5 py-0.5 rounded-full text-slate-300">
                    All Hidden Evaluations Complete
                  </span>
                )
              )}
            </div>

            {/* Error stack trace trace logs */}
            {errorMessage && (
              <div className="mt-4 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500 flex items-center gap-1">
                  <AlertCircle size={11} />
                </span>
                <div className="p-4 bg-black/40 rounded-xl border border-red-600/20 text-red-300 text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-40 shadow-inner scrollbar-thin">
                  {errorMessage}
                </div>
              </div>
            )}

            {/* Runtime Speed & Heap Memory Metadata Grid Layout */}
            {normalizedStatus !== "compile_error" && normalizedStatus !== "error" && (runtime !== undefined || memory !== undefined) && (
              <div className="mt-4 grid grid-cols-2 gap-3 max-w-sm">
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                  {/* <Zap size={14} className="text-amber-400 flex-shrink-0" /> */}
                  <div>
                    <span className="text-[10px] block text-slate-500 font-bold uppercase tracking-wider font-mono">Runtime</span>
                    <span className="text-sm font-bold font-mono text-slate-200">{runtime || "-- ms"}</span>
                  </div>
                </div>
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                  {/* <Cpu size={14} className="text-blue-400 flex-shrink-0" /> */}
                  <div>
                    <span className="text-[10px] block text-slate-500 font-bold uppercase tracking-wider font-mono">Memory</span>
                    <span className="text-sm font-bold font-mono text-slate-200">{memory || "-- MB"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== BOTTOM WORKSPACE ZONE ===== */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        
        {/* VIEW 1: RUN CODE VIEW LAYER (RENDER ACCORDION TABS) */}
        {!isSubmitMode && results && results.length > 0 && (
          <div className="divide-y divide-white/[0.06]">
            {results.map((testCase, index) => (
              <div
                key={index}
                className={`border-l-4 ${
                  testCase.passed
                    ? "border-l-green-500 bg-green-950/5 hover:bg-green-950/10"
                    : "border-l-red-500 bg-red-950/5 hover:bg-red-950/10"
                } transition-colors`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedTestCase(expandedTestCase === index ? -1 : index)}
                  className="w-full px-4 py-4 md:px-6 text-left flex items-center justify-between gap-3 transition-opacity"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {testCase.passed ? (
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-red-500 flex-shrink-0" />
                    )}
                    <p className="text-sm font-bold font-mono">
                      Case {index + 1}:{" "}
                      <span className={testCase.passed ? "text-green-400" : "text-red-400"}>
                        {testCase.passed ? "Passed" : "Failed"}
                      </span>
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                      expandedTestCase === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedTestCase === index && (
                  <div className="px-4 py-4 md:px-6 bg-black/40 border-t border-white/[0.06] space-y-4 animate-in fade-in duration-150">
                    <div>
                      <p className="text-[10px] uppercase font-bold font-sans tracking-wider text-slate-500 mb-1">Input</p>
                      <div className="bg-[#141414] border border-white/[0.04] rounded-lg p-3 text-xs font-mono text-slate-200 overflow-x-auto max-h-24 shadow-inner">
                        {normalizeNewlines(testCase.input) || "(empty)"}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold font-sans tracking-wider text-green-500/80 mb-1">Expected Output</p>
                        <div className="bg-green-950/10 border border-green-600/10 rounded-lg p-3 text-xs font-mono text-green-400 overflow-x-auto shadow-inner">
                          {normalizeNewlines(testCase.expectedOutput) || "(empty)"}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold font-sans tracking-wider text-slate-500 mb-1">Your Code Output</p>
                        <div className={`rounded-lg p-3 text-xs font-mono overflow-x-auto shadow-inner ${
                          testCase.passed
                            ? "bg-green-950/10 border border-green-600/10 text-green-400"
                            : "bg-red-950/10 border border-red-600/10 text-red-400"
                        }`}>
                          {normalizeNewlines(testCase.actualOutput) || "(empty)"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: SUBMIT CODE VIEW LAYER (RENDER TARGET MISMATCH TERMINAL PANEL) */}
        {isSubmitMode && normalizedStatus === "wrong" && failedTestCaseDetails && (
          <div className="p-4 md:p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Terminal size={14} className="text-red-400" />
              Mismatch Breakdown (Hidden Testcase #{failedTestCaseDetails.index || 1})
            </div>

            <div className="bg-black/30 border border-white/[0.06] rounded-xl p-4 space-y-4 font-mono text-xs shadow-2xl">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500 block mb-1">Standard Input Data (`stdin`)</span>
                <div className="bg-[#141414] border border-white/[0.04] text-slate-200 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-24 break-all shadow-inner">
                  {failedTestCaseDetails.input}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-emerald-500 block mb-1">Expected Output</span>
                  <div className="bg-[#141414] border border-emerald-950/40 text-emerald-400 p-3 rounded-lg overflow-x-auto font-bold break-all shadow-inner">
                    {failedTestCaseDetails.expected}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-red-400 block mb-1">Your Output</span>
                  <div className="bg-[#141414] border border-red-950/40 text-red-400 p-3 rounded-lg overflow-x-auto font-bold break-all shadow-inner">
                    {failedTestCaseDetails.received || "No Output"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SYSTEM TIMEOUTS / EXCEPTION ANCHOR LABELS PLACEHOLDERS */}
        {isSubmitMode && (normalizedStatus === "time_limit_exceeded" || normalizedStatus === "tle" || normalizedStatus === "memory_limit_exceeded" || normalizedStatus === "mle") && (
          <div className="p-8 text-center max-w-sm mx-auto space-y-2 pt-16">
            <div className="text-slate-500 text-xs font-mono font-medium">
              {normalizedStatus.includes("time") || normalizedStatus.includes("tle") 
                ? "Optimize your loop tracking variables or use a faster data structure approach to resolve algorithmic bottlenecks." 
                : "Avoid recursive heap leakage or infinite collection arrays to pass limits allocation bounds."
              }
            </div>
          </div>
        )}

      </div>
    </div>
  );
}