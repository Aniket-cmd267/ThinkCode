import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import Description from "../../pages/editorPage/Description";
import MatchResult from "./MatchResult";

function formatTimeLeft(timeLeftMs = 0) {
  const totalSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function MatchArena({
  room,
  userId,
  submissionResult,
  onSubmit,
  submitting,
}) {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript");
  const [drafts, setDrafts] = useState({});
  const currentProblem = room?.currentProblem;

  const currentProblemDrafts = useMemo(() => {
    if (!currentProblem?._id) return {};
    return drafts[currentProblem._id] || {};
  }, [drafts, currentProblem]);

  useEffect(() => {
    if (!currentProblem?._id) return;

    setDrafts((prev) => {
      if (prev[currentProblem._id]) {
        return prev;
      }

      const initialDrafts = {};
      (currentProblem.startCode || []).forEach((code) => {
        initialDrafts[code.language] = code.initialCode;
      });

      return {
        ...prev,
        [currentProblem._id]: initialDrafts,
      };
    });
  }, [currentProblem]);

  function handleEditorMount(editor, monaco) {
    editorRef.current = editor;

    monaco.editor.defineTheme("contest-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [{ token: "comment", foreground: "D48A8A", fontStyle: "italic" }],
      colors: {
        "editor.background": "#0D0D0D",
      },
    });

    monaco.editor.setTheme("contest-dark");
  }

  function getEditorLanguage(value) {
    if (value === "c++") return "cpp";
    return value;
  }

  function handleEditorChange(value) {
    if (!currentProblem?._id) return;
    setDrafts((prev) => ({
      ...prev,
      [currentProblem._id]: {
        ...(prev[currentProblem._id] || {}),
        [language]: value,
      },
    }));
  }

  const code = currentProblemDrafts[language] || "";
  const viewer = room?.viewer;
  const opponent = room?.opponent;

  return (
    <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 xl:grid-cols-[1.1fr_1fr]">
      <section className="border-r border-white/8 bg-[#121212] p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/20 p-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#F87171] font-semibold">
              Live Match
            </p>
            <h1 className="mt-2 text-2xl font-black text-white">
              Room {room?.roomId}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-slate-200">
              Timer {formatTimeLeft(room?.timeLeftMs)}
            </span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-slate-200">
              Question {Math.min(room?.currentQuestionNumber || 1, room?.totalQuestions || 1)}/{room?.totalQuestions || 3}
            </span>
          </div>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
              You
            </p>
            <h2 className="mt-2 text-xl font-bold text-white">{viewer?.firstName}</h2>
            <p className="mt-2 text-sm text-slate-300">
              Score: {viewer?.score || 0} | Solved: {viewer?.solvedCount || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
              Opponent
            </p>
            <h2 className="mt-2 text-xl font-bold text-white">
              {opponent?.firstName || "Waiting"}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Score: {opponent?.score || 0} | Solved: {opponent?.solvedCount || 0}
            </p>
          </div>
        </div>

        {room?.status === "finished" ? (
          <MatchResult room={room} userId={userId} />
        ) : currentProblem ? (
          <Description problem={currentProblem} />
        ) : (
          <div className="rounded-2xl border border-white/8 bg-black/20 p-6 text-slate-300">
            Waiting for your next problem...
          </div>
        )}
      </section>

      <section className="flex min-h-0 flex-col bg-[#0D0D0D]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 bg-[#111111] px-4 py-3">
          <select
            className="rounded-lg border border-white/10 bg-[#1A1A1A] px-3 py-2 text-sm text-white outline-none"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="c++">C++</option>
          </select>

          <button
            type="button"
            onClick={() => onSubmit({ code, language })}
            disabled={submitting || room?.status === "finished" || !currentProblem}
            className="rounded-lg bg-[#EF4444] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#dc2626] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Submit Solution"}
          </button>
        </div>

        <div className="flex-1">
          <Editor
            height="100%"
            language={getEditorLanguage(language)}
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: true },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />
        </div>

        <div className="border-t border-white/8 bg-[#071a14] px-4 py-4">
          {submissionResult ? (
            <div className="text-emerald-200">
              <p>
                Status: <span className="font-semibold">{submissionResult.status}</span>
              </p>
              <p>
                TestCase: {submissionResult.testCasesPassed}/{submissionResult.testCasesTotal}
              </p>
              <p>Memory: {submissionResult.memory}</p>
              <p>Time: {submissionResult.runtime}</p>
              {submissionResult.errorMessage ? (
                <p className="mt-2 text-rose-200 whitespace-pre-wrap">
                  {submissionResult.errorMessage}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-slate-300">
              Submit your code to advance to the next question.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
