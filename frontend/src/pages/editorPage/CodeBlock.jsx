import { useMemo } from "react";
function normalizeNewlines(s = "") {
  return String(s).replace(/\\n/g, "\n");
}

export function CodeBlock({ code, label, className = "" }) {
  const normalized = useMemo(() => normalizeNewlines(code), [code]);

  return (
    <div
      className={[
        "rounded-2xl border border-white/[0.06] bg-[#1A1A1A]",
        className
      ].join(" ")}
    >
      <div className="max-h-[52vh] overflow-y-auto bg-[#1A1A1A] w-full">
        <pre className="p-4 pb-6 text-[12px] md:text-[13px] leading-relaxed overflow-x-auto text-slate-100 whitespace-pre-wrap break-words bg-[#1A1A1A] font-mono">
          <code className="font-mono block w-full bg-[#1A1A1A]">{normalized}</code>
        </pre>
      </div>
    </div>
  );
}


function RichTextLine({ content }) {
  const parts = content.split(/(\*\*.*?\*\*)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </>
  );
}

export function FencedText({ text, defaultCodeLabel = "Code" }) {
  const chunks = useMemo(() => {
    const s = String(text ?? "");
    const re = /```(\w+)?\n([\s\S]*?)```/g;
    const out = [];
    let last = 0;
    let m;

    while ((m = re.exec(s)) !== null) {
      if (m.index > last) out.push({ type: "text", value: s.slice(last, m.index) });
      out.push({
        type: "code",
        lang: (m[1] || "").trim(),
        value: m[2] ?? ""
      });
      last = re.lastIndex;
    }
    if (last < s.length) out.push({ type: "text", value: s.slice(last) });
    return out;
  }, [text]);

  const renderTextContent = (val) => {
    const lines = val.split('\n');
    const elements = [];
    let currentBulletList = [];

    const flushBullets = (keyIdx) => {
      if (currentBulletList.length > 0) {
        elements.push(
          <ul key={`list-${keyIdx}`} className="space-y-2 my-2 ml-4">
            {currentBulletList.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <span className="mt-1.5 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                </span>
                <span><RichTextLine content={item} /></span>
              </li>
            ))}
          </ul>
        );
        currentBulletList = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();
      const bulletMatch = trimmedLine.match(/^[-*•]\s+(.*)/);
      const numberMatch = trimmedLine.match(/^(\d+\.)\s+(.*)/);

      if (bulletMatch) {
        currentBulletList.push(bulletMatch[1]);
      } else if (numberMatch) {
        flushBullets(idx);
        elements.push(
          <div key={idx} className="flex items-start gap-3 text-slate-300 my-2 ml-4">
            <span className="text-red-400 font-mono font-bold shrink-0">{numberMatch[1]}</span>
            <span><RichTextLine content={numberMatch[2]} /></span>
          </div>
        );
      } else if (trimmedLine === "") {
        flushBullets(idx);
        elements.push(<div key={idx} className="h-2" />);
      } else {
        flushBullets(idx);
        elements.push(
          <p key={idx} className="text-slate-200/90 leading-relaxed my-1">
            <RichTextLine content={trimmedLine} />
          </p>
        );
      }
    });

    flushBullets('final');
    return elements;
  };

  return (
    <div className="space-y-6">
      {chunks.map((c, i) => {
        if (c.type === "code") {
          const label = c.lang ? `${c.lang.toUpperCase()} ${defaultCodeLabel}` : defaultCodeLabel;
          return (
            <div key={`code-${i}`} className="rounded-xl border border-white/[0.06] bg-[#1A1A1A]/50 overflow-hidden">
              <div className="bg-[#161616] px-4 py-2 border-b border-white/[0.06] flex justify-between items-center">
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest">{label}</span>
              </div>
              <pre className="p-4 text-sm font-mono text-red-50/90 overflow-x-auto">
                <code>{c.value}</code>
              </pre>
            </div>
          );
        }

        const value = String(c.value ?? "");
        if (!value.trim()) return null;

        return (
          <div key={`text-${i}`} className="font-sans">
            {renderTextContent(value)}
          </div>
        );
      })}
    </div>
  );
}

