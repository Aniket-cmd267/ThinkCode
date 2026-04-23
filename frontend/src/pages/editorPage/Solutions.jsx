import { CodeBlock } from "./CodeBlock";

export default function Solutions({ problem }) {
  const solutions = problem?.referenceSolution || [];

  return (
    <div className="space-y-5">
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
        <div className="space-y-6">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/[0.06] bg-[#161616]/50 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">
                    Language:{" "}
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.22em] border border-[#EF4444]/25 bg-[#EF4444]/10 text-[#EF4444]">
                      {String(solution?.language || "code")}
                    </span>
                  </p>
                </div>

              </div>

              <CodeBlock
                label={`${solution?.language || "Code"}`}
                code={solution?.completeCode || ""}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}