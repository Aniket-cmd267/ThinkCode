import { CodeBlock, FencedText } from "./CodeBlock";

export default function Description({ problem, showHeader = true }) {
  function difficultyPill(difficulty = "") {
    const d = String(difficulty).toLowerCase();
    if (d === "easy") return "text-emerald-300 border-emerald-400/20 bg-emerald-400/5";
    if (d === "medium") return "text-amber-300 border-amber-400/20 bg-amber-400/5";
    if (d === "hard") return "text-[#EF4444] border-[#EF4444]/25 bg-[#EF4444]/10";
    return "text-slate-300 border-white/10 bg-white/5";
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            {problem?.title}
          </h1>
          <span
            className={[
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.22em] border",
              difficultyPill(problem?.difficulty)
            ].join(" ")}
          >
            {String(problem?.difficulty || "").slice(0, 1).toUpperCase() +
              String(problem?.difficulty || "").slice(1)}
          </span>
          {problem?.tags && (
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em] border border-white/10 bg-black/20 text-slate-200">
              {String(problem.tags).slice(0, 1).toUpperCase() + String(problem.tags).slice(1)}
            </span>
          )}
        </div>
      )}

      <section className="rounded-2xl border border-white/[0.06] bg-[#1A1A1A]/50 p-5">
        <FencedText text={problem?.description} defaultCodeLabel="Snippet" />
      </section>

      <section className="space-y-3">
        <div className="space-y-4">
          {(problem?.visibleTestCases || []).map((example, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/[0.06] bg-[#161616]/60 p-5"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <h4 className="text-sm font-semibold text-white">
                  Example {index + 1}
                </h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CodeBlock
                  label="Input"
                  code={example?.input ?? ""}
                />
                <CodeBlock
                  label="Output"
                  code={example?.output ?? ""}
                />
              </div>

              {example?.explanation ? (
                <div className="mt-4 rounded-xl border border-white/5 bg-black/30 p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#F87171]/80 font-semibold mb-2">
                    Explanation
                  </p>
                  <div className="text-sm text-slate-200/90 whitespace-pre-wrap leading-relaxed">
                    {example.explanation}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}