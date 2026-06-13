// import { useEffect, useRef, useState, useCallback, useMemo } from "react";

// /* ─── Language map: internal key → Prism grammar name ─── */
// const LANG_MAP = {
//     javascript: "javascript",
//     java: "java",
//     "c++": "cpp",
//     cpp: "cpp",
//     python: "python",
// };

// /* ─── Prism CDN URLs ─── */
// const PRISM_CORE =
//     "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
// const PRISM_LANG = (lang) =>
//     `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js`;

// /* ─── VS Code-inspired token → color map (injected as <style>) ─── */
// const PRISM_THEME_CSS = `
// /* ── ThinkCode Prism Dark Theme ── */
// code[class*="language-"],
// pre[class*="language-"] {
//   color: #E2E8F0;
//   text-shadow: none;
//   font-family: 'JetBrains Mono', 'Fira Code', monospace;
//   font-variant-ligatures: contextual;
//   direction: ltr;
//   text-align: left;
//   white-space: pre;
//   word-spacing: normal;
//   word-break: normal;
//   tab-size: 2;
//   hyphens: none;
//   background: none;
// }

// /* ── Keywords (if, return, function, class, const, let, var …) ── */
// .token.keyword,
// .token.control-flow { color: #EF4444; font-weight: 600; }

// /* ── Strings ── */
// .token.string,
// .token.template-string,
// .token.char   { color: #10B981; }

// /* ── Numbers & Booleans ── */
// .token.number,
// .token.boolean { color: #F472B6; }

// /* ── Functions & class names ── */
// .token.function,
// .token.class-name { color: #60A5FA; }

// /* ── Comments ── */
// .token.comment,
// .token.prolog,
// .token.doctype,
// .token.cdata { color: #64748B; font-style: italic; }

// /* ── Operators & Punctuation ── */
// .token.operator,
// .token.punctuation { color: #F87171; }

// /* ── Built-in / constants ── */
// .token.builtin,
// .token.constant { color: #C084FC; }

// /* ── Regex ── */
// .token.regex { color: #FCD34D; }

// /* ── Property / attr ── */
// .token.property,
// .token.attr-name { color: #93C5FD; }
// .token.attr-value { color: #10B981; }

// /* ── Tags (for JSX / HTML) ── */
// .token.tag { color: #EF4444; }

// /* ── Variable ── */
// .token.variable { color: #E2E8F0; }

// /* ── Selection ── */
// code[class*="language-"]::selection,
// code[class*="language-"] *::selection {
//   background: rgba(239, 68, 68, 0.25);
// }
// `;

// /**
//  * Load a script from a URL, resolving when ready.
//  * Prevents duplicate script tags.
//  */
// function loadScript(src) {
//     return new Promise((resolve, reject) => {
//         if (document.querySelector(`script[src="${src}"]`)) {
//             resolve();
//             return;
//         }
//         const s = document.createElement("script");
//         s.src = src;
//         s.async = true;
//         s.onload = () => resolve();
//         s.onerror = () => reject(new Error(`Failed to load ${src}`));
//         document.head.appendChild(s);
//     });
// }

// /**
//  * Inject the theme stylesheet once.
//  */
// function injectThemeCSS() {
//     const id = "thinkcode-prism-theme";
//     if (document.getElementById(id)) return;
//     const style = document.createElement("style");
//     style.id = id;
//     style.textContent = PRISM_THEME_CSS;
//     document.head.appendChild(style);
// }

// /* ═══════════════════════════════════════════════════════════
//    ThinkCodeEditor — textarea + highlighted <pre> overlay
//    ═══════════════════════════════════════════════════════════ */
// export default function ThinkCodeEditor({
//     value = "",
//     onChange,
//     language = "javascript",
//     readOnly = false,
//     className = "",
//     fontSize = 14,
// }) {
//     const textareaRef = useRef(null);
//     const preRef = useRef(null);
//     const lineNumRef = useRef(null);
//     const [prismReady, setPrismReady] = useState(false);

//     const prismLang = LANG_MAP[language?.toLowerCase()] || "javascript";

//     /* ── 1. Load Prism core + language grammar via CDN ── */
//     useEffect(() => {
//         let cancelled = false;

//         (async () => {
//             try {
//                 injectThemeCSS();
//                 await loadScript(PRISM_CORE);

//                 // Load the specific language component
//                 if (prismLang !== "javascript") {
//                     // javascript is part of the core, no need to load separately
//                     await loadScript(PRISM_LANG(prismLang));
//                 }

//                 if (!cancelled) setPrismReady(true);
//             } catch (err) {
//                 console.warn("[ThinkCodeEditor] Prism load error:", err);
//                 if (!cancelled) setPrismReady(true); // fallback to plain text
//             }
//         })();

//         return () => {
//             cancelled = true;
//         };
//     }, [prismLang]);

//     /* ── 2. Highlight with Prism ── */
//     const highlightedHTML = useMemo(() => {
//         if (
//             !prismReady ||
//             typeof window === "undefined" ||
//             !window.Prism
//         ) {
//             // Escape HTML and return as plain text
//             return escapeHtml(value || "");
//         }

//         const grammar = window.Prism.languages[prismLang];
//         if (!grammar) {
//             return escapeHtml(value || "");
//         }

//         return window.Prism.highlight(value || "", grammar, prismLang);
//     }, [value, prismLang, prismReady]);

//     /* ── 3. Sync scroll between textarea → pre & line numbers ── */
//     const handleScroll = useCallback(() => {
//         if (textareaRef.current && preRef.current) {
//             preRef.current.scrollTop = textareaRef.current.scrollTop;
//             preRef.current.scrollLeft = textareaRef.current.scrollLeft;
//         }
//         if (textareaRef.current && lineNumRef.current) {
//             lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
//         }
//     }, []);

//     /* ── 4. Handle text change ── */
//     const handleChange = useCallback(
//         (e) => {
//             if (onChange) onChange(e.target.value);
//         },
//         [onChange]
//     );

//     /* ── 5. Handle tab key ── */
//     const handleKeyDown = useCallback(
//         (e) => {
//             if (e.key === "Tab") {
//                 e.preventDefault();
//                 const ta = textareaRef.current;
//                 if (!ta) return;
//                 const start = ta.selectionStart;
//                 const end = ta.selectionEnd;
//                 const newVal =
//                     value.substring(0, start) + "  " + value.substring(end);
//                 if (onChange) onChange(newVal);
//                 // Restore caret position after React re-render
//                 requestAnimationFrame(() => {
//                     ta.selectionStart = ta.selectionEnd = start + 2;
//                 });
//             }
//         },
//         [value, onChange]
//     );

//     /* ── 6. Line numbers ── */
//     const lineCount = (value || "").split("\n").length;
//     const lineNumbers = useMemo(() => {
//         return Array.from({ length: lineCount }, (_, i) => i + 1);
//     }, [lineCount]);

//     const lineHeight = Math.round(fontSize * 1.6);

//     return (
//         <div
//             className={`thinkcode-editor relative flex w-full h-full overflow-hidden bg-[#000000] ${className}`}
//             style={{
//                 fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//                 fontSize: `${fontSize}px`,
//                 lineHeight: `${lineHeight}px`,
//             }}
//         >
//             {/* ── Line Numbers ── */}
//             <div
//                 ref={lineNumRef}
//                 className="flex-shrink-0 overflow-hidden select-none text-right pr-3 pl-3 border-r border-white/[0.06]"
//                 style={{
//                     lineHeight: `${lineHeight}px`,
//                     paddingTop: "16px",
//                     color: "#555",
//                     minWidth: "48px",
//                 }}
//                 aria-hidden="true"
//             >
//                 {lineNumbers.map((n) => (
//                     <div key={n} style={{ height: `${lineHeight}px` }}>
//                         {n}
//                     </div>
//                 ))}
//             </div>

//             {/* ── Editor Area ── */}
//             <div className="relative flex-1 min-w-0 overflow-hidden">
//                 {/* Highlighted output (visual only, behind textarea) */}
//                 <pre
//                     ref={preRef}
//                     className={`language-${prismLang} absolute inset-0 overflow-auto m-0 p-4 pointer-events-none`}
//                     style={{
//                         lineHeight: `${lineHeight}px`,
//                         background: "transparent",
//                         border: "none",
//                         whiteSpace: "pre",
//                         wordWrap: "normal",
//                         overflowWrap: "normal",
//                     }}
//                     aria-hidden="true"
//                 >
//                     <code
//                         className={`language-${prismLang}`}
//                         dangerouslySetInnerHTML={{ __html: highlightedHTML + "\n" }}
//                     />
//                 </pre>

//                 {/* Invisible textarea (captures all input) */}
//                 <textarea
//                     ref={textareaRef}
//                     value={value}
//                     onChange={handleChange}
//                     onScroll={handleScroll}
//                     onKeyDown={handleKeyDown}
//                     readOnly={readOnly}
//                     spellCheck={false}
//                     autoCapitalize="off"
//                     autoComplete="off"
//                     autoCorrect="off"
//                     data-gramm="false"
//                     className="absolute inset-0 w-full h-full resize-none m-0 p-4 bg-transparent border-none outline-none overflow-auto"
//                     style={{
//                         color: "transparent",
//                         caretColor: "#EF4444",
//                         lineHeight: `${lineHeight}px`,
//                         fontFamily: "inherit",
//                         fontSize: "inherit",
//                         whiteSpace: "pre",
//                         wordWrap: "normal",
//                         overflowWrap: "normal",
//                         WebkitTextFillColor: "transparent",
//                     }}
//                 />
//             </div>
//         </div>
//     );
// }

// /* ─── Helper: HTML-escape for plain-text fallback ─── */
// function escapeHtml(str) {
//     return str
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/"/g, "&quot;")
//         .replace(/'/g, "&#039;");
// }
