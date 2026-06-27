import { useState } from "react";
import { ChevronDown, Copy } from "lucide-react";
import { CodeBlock } from "./CodeBlock";

export default function Solutions({ problem }) {
  const solutions = problem?.referenceSolution || [];
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [copiedIndex, setCopiedIndex] = useState(-1);

  const handleCopy = async (index, code) => {
    try {
      await navigator.clipboard.writeText(code || "");
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(-1), 1200);
    } catch {
      setCopiedIndex(-1);
    }
  };

  return (
    <div className="space-y-5 min-h-0 flex flex-col">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
            Solutions
          </h2>
        </div>
      </div>

      {solutions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-slate-400">
          No reference solutions have been added for this problem yet.
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto pb-10 space-y-4">
          {solutions.map((solution, index) => {
            const expanded = expandedIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/6 bg-[#161616]/50 overflow-hidden"
              >
                <div className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-transparent">
                  <div className="flex flex-1 items-center gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(expanded ? -1 : index)}
                      className="flex-1 text-left"
                    >
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 mb-1">
                          Language: {" "}
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.22em] border border-[#EF4444]/25 bg-[#EF4444]/10 text-[#EF4444]">
                            {String(solution?.language || "code")}
                          </span>
                        </p>
                      </div>
                    </button>
                  </div>
                  <button
                      type="button"
                      onClick={() => handleCopy(index, solution?.completeCode || "")}
                      className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all"
                    >
                      <Copy size={14} />
                      {copiedIndex === index ? "Copied" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(expanded ? -1 : index)}
                    className="inline-flex items-center justify-center rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
                {expanded && (
                  <div className="border-t border-white/6 p-5 max-h-[54vh] overflow-y-auto">
                    <CodeBlock
                      className="min-h-0"
                      label={`${solution?.language || "Code"}`}
                      code={solution?.completeCode || ""}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}