import { useMemo, useState } from "react";
import { Check, Copy, Circle } from "lucide-react";
function normalizeNewlines(s = "") {
  // Handles both real newlines and "\n" sequences coming from APIs/db.
  return String(s).replace(/\\n/g, "\n");
}

export function CodeBlock({ code, label, className = "" }) {
  const [copied, setCopied] = useState(false);
  const normalized = useMemo(() => normalizeNewlines(code), [code]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(normalized ?? "");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore (clipboard may be blocked); no UX break
    }
  }

  return (
    <div
      className={[
        "rounded-2xl border border-white/[0.06] bg-[#1A1A1A] overflow-hidden",
        className
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#161616]/70 border-b border-white/[0.06]">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#F87171]/90 font-semibold truncate">
            {label || "Code"}
          </p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="p-4 text-[12px] md:text-[13px] leading-relaxed overflow-x-auto text-slate-100">
        <code className="font-mono whitespace-pre">{normalized}</code>
      </pre>
    </div>
  );
}



/**
 * A helper component to render "Rich Text" lines (handling bolding and bullets)
 */
function RichTextLine({ content }) {
  // 1. Handle Bold Text: **text** -> <strong>text</strong>
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
    // Split the text block into individual lines
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

      // Detect Bullet points (- item, * item, • item)
      const bulletMatch = trimmedLine.match(/^[-*•]\s+(.*)/);
      // Detect Numbered points (1. item)
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
        // Empty line acts as a paragraph break
        flushBullets(idx);
        elements.push(<div key={idx} className="h-2" />);
      } else {
        // Regular paragraph text
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
          // Note: Assuming CodeBlock is defined elsewhere in your project
          // return <CodeBlock key={`code-${i}`} code={c.value} label={label} />;
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

