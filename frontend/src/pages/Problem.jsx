import { useEffect, useRef, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate, useParams } from "react-router";
import Editor from '@monaco-editor/react';
import ChatAi from "./editorPage/ChatAi";
import { useDispatch, useSelector } from "react-redux"
import { IoIosAddCircle } from "react-icons/io";
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import debounce from 'lodash.debounce';
import { getCodeWrittenOnEditor, getProblem } from '../store/editorSlice'
import Description from "./editorPage/Description";
import Editorial from "./editorPage/Editorial";
import Solutions from "./editorPage/Solutions";
import Submissions from "./editorPage/Submissions";
import TestCaseResults from "./editorPage/TestCaseResults";
import {
  Info,
  BookOpen,
  Lightbulb,
  History,
  Bot,
} from "lucide-react";
const TestCaseSchema = z.object({
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  )
})
function Problem() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const debouncedSave = useRef(
    debounce(({ problemId, selectedLanguage, value }) => {
      dispatch(getCodeWrittenOnEditor({ problemId, selectedLanguage, value }));
    }, 1000)
  ).current;
  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(TestCaseSchema),
    defaultValues: {
      visibleTestCases: [{ input: "", output: "" }]
    }
  })
  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
    control,
    name: "visibleTestCases",
  });
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [resultHistory, setResultHistory] = useState({});
  const [sessionMessage, setSessionMessage] = useState('');
  const [sessionTestCases, setSessionTestCases] = useState([]);
  const watchVisibleTestCases = watch('visibleTestCases');
  const [testCaseResults, setTestCaseResults] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const { isAuthenticated } = useSelector(state => state.slice1)
  let { problemId } = useParams();
  const { updatedCode, problemData } = useSelector(state => state.slice2)
  const currentProblemCode = updatedCode?.[problemId] || {};
  const [editorValue, setEditorValue] = useState('');
  const editorRef = useRef(null);


  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])

  useEffect(() => {
    async function loadProblem() {
      setLoading(true);
      try {
        await dispatch(getProblem(problemId)).unwrap();
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadProblem();
  }, [dispatch, problemId])

  useEffect(() => {
    if (!problemData) return;
    const initialCases = (problemData.visibleTestCases?.length ? problemData.visibleTestCases : [{ input: "", output: "" }]).map((tc) => ({
      input: tc.input ?? "",
      output: tc.output ?? ""
    }));

    reset({ visibleTestCases: initialCases });
    setSessionTestCases(initialCases);

    const availableLanguages = (problemData.startCode || []).map((item) => String(item.language || "").toLowerCase());
    if (availableLanguages.length && !availableLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(availableLanguages[0]);
    }
  }, [problemData, reset, selectedLanguage]);

  useEffect(() => {
    const savedCode = currentProblemCode?.[selectedLanguage];
    if (savedCode !== undefined) {
      setEditorValue(savedCode);
      return;
    }

    const template = problemData?.startCode?.find((item) =>
      String(item.language || "").toLowerCase() === selectedLanguage.toLowerCase()
    )?.initialCode;

    setEditorValue(template || '');
  }, [currentProblemCode, selectedLanguage, problemData]);

  const getRunTestCases = () => {
    const customCases = (watchVisibleTestCases || []).map((tc) => ({
      input: String(tc.input || ""),
      output: String(tc.output || "")
    })).filter((tc) => tc.input.trim() || tc.output.trim());

    return customCases.length ? customCases : (problemData?.visibleTestCases || []);
  };

  async function fetchSubmissionHistory() {
    try {
      const { data } = await axiosClient.get(`/problem/submittedProblem/${problemId}`)
      if (Array.isArray(data)) {
        setSubmissionHistory(data)
      } else {
        setSubmissionHistory([])
      }
    } catch (err) {
      console.log(err.message)
      setSubmissionHistory([])
    }
  }
  // function formatRuntime(runtime) {
  //   const value = Number(runtime)
  //   if (!Number.isFinite(value) || value < 0) return '--'
  //   if (value === 0) return '0 ms'

  //   const milliseconds = value < 10 ? value * 1000 : value
  //   if (milliseconds < 1000) return `${milliseconds.toFixed(0)} ms`
  //   return `${(milliseconds / 1000).toFixed(2)} s`
  // }
  // function formatMemory(memory) {
  //   const value = Number(memory)
  //   if (!Number.isFinite(value) || value < 0) return '--'
  //   if (value >= 1024) return `${(value / 1024).toFixed(2)} MB`
  //   return `${value.toFixed(0)} KB`
  // }
  function getLanguageForMonaco(lang) {
    switch (lang) {
      case 'javascript': return 'Javascript'
      case 'cpp': return 'C++'
      case 'java': return 'Java'
      default: return ''
    }
  }
  function getEditorValue(language) {
    const existing = currentProblemCode?.[language];
    if (existing !== undefined) {
      return existing;
    }
    return problemData?.startCode?.find((item) =>
      String(item.language || "").toLowerCase() === language.toLowerCase()
    )?.initialCode || '';
  }

  function persistEditorValue(language, value) {
    if (!problemId || value === undefined) return;
    dispatch(getCodeWrittenOnEditor({ problemId, selectedLanguage: language, value }));
  }

  function handleEditorChange(value) {
    const normalizedValue = value ?? '';
    setEditorValue(normalizedValue);
    debouncedSave({ problemId, selectedLanguage, value: normalizedValue })
  }

  function handleLanguageChange(language) {
    if (language === selectedLanguage) return;
    persistEditorValue(selectedLanguage, editorValue);
    setSelectedLanguage(language);
  }
  function handleEditorDidMount(editor, monaco) { 
    editorRef.current = editor
    monaco.editor.defineTheme('thinkcode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: 'D48A8A', fontStyle: 'italic' },
        { token: 'comment.line', foreground: 'D48A8A', fontStyle: 'italic' },
        { token: 'comment.block', foreground: 'D48A8A', fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': '#0D0D0D',
        'editor.lineHighlightBackground': '#1A1A1A',
        'editorLineNumber.foreground': '#555555',
        'editorLineNumber.activeForeground': '#999999',
      }
    });
    monaco.editor.setTheme('thinkcode-dark');
  }
  const showTestCases = (testcase) => {
    if (testcase === 'testcase') {
      setActiveRightTab('code')
    }
    else {
      setActiveRightTab('testcase')
    }
  }
  async function runCode(code, lang, driverCode, customTestCases = []) {
    try {
      const driverBefore = `${driverCode?.find((obj) => obj.lang.toLowerCase() == lang.toLowerCase())?.before}\n`
      const driverAfter = `${driverCode?.find((obj) => obj.lang.toLowerCase() == lang.toLowerCase())?.after}\n`
      const fullCode = driverBefore + code + driverAfter
      const data = {
        fullCode,
        lang,
        customTestCases: customTestCases.length ? customTestCases : undefined
      }
      const response = await axiosClient.post(`/submission/run/${problemId}`, data)
      setTestCaseResults(response?.data)
      setActiveRightTab('testrun')
    } catch (err) {
      console.log(err.message)
      setTestCaseResults({
        status: 'error',
        errorMessage: err.message || 'Failed to run code',
        totalPassed: 0,
        totalTestCases: 0,
        results: []
      })
      setActiveRightTab('testrun')
    }
  }

  async function submitCode(code, lang) {
    try {
      const driverBefore = `${problemData?.driverCode?.find((obj) => obj.lang.toLowerCase() == lang.toLowerCase())?.before}\n`
      const driverAfter = `${problemData?.driverCode?.find((obj) => obj.lang.toLowerCase() == lang.toLowerCase())?.after}\n`
      const fullCode = driverBefore + code + driverAfter
      
      const data = {
        code,
        fullCode,
        lang
      }

      setResultHistory({ status: 'pending' })
      setActiveRightTab('result')

      const response = await axiosClient.post(`/submission/submit/${problemId}`, data)
      console.log("Submit Code Response Data Payload:", response?.data)
      setResultHistory(response?.data)
      setSubmissionHistory((prev) => [response?.data, ...prev])
      
      setActiveRightTab('result')
      setActiveLeftTab('Submissions')
      await fetchSubmissionHistory()

    } catch (err) {
      console.error("Submission Trigger Network Fault:", err)
      setResultHistory({
        status: 'error',
        errorMessage: err.response?.data?.errorMessage || err.response?.data || err.message || 'Submission process broken'
      })
      setActiveRightTab('result')
      setActiveLeftTab('Submissions')
    }
  }
  useEffect(() => {  
    fetchSubmissionHistory()
  }, [problemId])

  if (loading) {
    return (
      <div className="loading loading-spinner"></div>
    )
  }
  async function onSubmit(data) {
    const appliedCases = (data.visibleTestCases || []).map((testcase) => ({
      input: testcase.input || "",
      output: testcase.output || ""
    })).filter((tc) => tc.input.trim() || tc.output.trim());
    setSessionTestCases(appliedCases);
    setSessionMessage(`Applied ${appliedCases.length} session-only testcase${appliedCases.length === 1 ? '' : 's'}. They will not be saved to the database.`);
  }
  return (
    <div className="h-screen w-screen bg-[#0D0D0D] text-slate-100 flex overflow-hidden fixed top-16 left-0 right-0 bottom-0">
      <aside
        className="relative flex flex-col border-r border-white/[0.06] bg-[#111111] transition-all duration-300 w-[72px] shrink-0 h-full overflow-hidden"
      >
        <div className="mt-5 flex flex-col gap-2 px-2">
          {[
            { id: "description", icon: Info, label: "Description" },
            { id: "Editorial", icon: BookOpen, label: "Editorial" },
            { id: "Solutions", icon: Lightbulb, label: "Solutions" },
            { id: "Submissions", icon: History, label: "Submissions" },
            { id: "ChatAi", icon: Bot, label: "ChatAI" }
          ].map(({ id, icon: Icon, label }) => {
            const active = activeLeftTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveLeftTab(id)}
                className={[
                  "group relative flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 transition-all",
                  active
                    ? "bg-[#1C1C1C] text-white"
                    : "text-slate-500 hover:bg-[#1C1C1C]/60 hover:text-slate-300"
                ].join(" ")}
              >
                {active && (
                  <span
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[#EF4444]"
                  />
                )}
                <Icon
                  size={18}
                  className={active ? "text-[#EF4444] flex-shrink-0" : "text-slate-500 group-hover:text-slate-400 flex-shrink-0"}
                />
                <span className={`text-[9px] font-medium leading-tight ${active ? "text-white" : "text-slate-500 group-hover:text-slate-400"}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="flex-1 min-w-0 bg-[#141414] border-r border-white/[0.06] flex flex-col overflow-hidden h-full">
        {problemData && (
          <>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-5 pb-20 space-y-4">
              {activeLeftTab === "description" && (
                <Description problem={problemData} />
              )}
              {activeLeftTab === "Editorial" && <Editorial />}
              {activeLeftTab === "Solutions" && (
                <Solutions problem={problemData} />
              )}
              {activeLeftTab === "Submissions" && (
                <Submissions submissionHistory={submissionHistory} />
              )}
              {activeLeftTab === "ChatAi" && (
                <ChatAi
                  className="overflow-y-auto"
                  problem={problemData}
                  problemId={problemId}
                />
              )}
            </div>
          </>
        )}
      </section>
      <section className="flex-1 min-w-0 bg-[#121824] flex flex-col overflow-hidden border-l border-slate-800/80 h-full">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#111111] flex-shrink-0">
          <div className="flex items-center gap-2">
            <select
              className="bg-[#1A1A1A] border border-white/10 rounded-lg text-xs text-slate-100 px-3 py-2 outline-none focus:border-[#EF4444]/60 focus:ring-0"
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="c++">C++</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveRightTab('code')}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${activeRightTab === 'code'
                ? 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]'
                : 'border-white/10 text-slate-300 hover:bg-white/5'
                }`}
            >
              Code
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('testrun')}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${activeRightTab === 'testrun'
                ? 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]'
                : 'border-white/10 text-slate-300 hover:bg-white/5'
                }`}
            >
              Test Results
            </button>
            <button
              type="button"
              onClick={() => showTestCases(activeRightTab)}
              className="hidden sm:inline-flex text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 bg-transparent hover:bg-white/5 hover:text-white transition-all"
            >
              Testcase Input
            </button>
            <button
              type="button"
              onClick={() =>
                runCode(
                  editorValue,
                  selectedLanguage,
                  problemData?.driverCode,
                  getRunTestCases()
                )
              }
              className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg border border-white/10 text-slate-300 bg-transparent hover:bg-white/5 hover:text-white transition-all"
            >
              Run
            </button>
            <button
              type="button"
              onClick={() => submitCode(editorValue, selectedLanguage)}
              className="inline-flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg bg-[#EF4444] text-white font-semibold hover:bg-[#DC2626] active:scale-95 transition-all"
            >
              Submit
            </button>
          </div>
        </div>
        {sessionMessage && (
          <div className="px-4 py-3 border-b border-white/[0.06] bg-[#111111] text-xs text-slate-300">
            <span className="font-medium text-slate-100">Session testcases active:</span> {sessionMessage}
          </div>
        )}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {activeRightTab === "code" && (
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={getLanguageForMonaco(selectedLanguage)}
                onChange={handleEditorChange}
                value={editorValue}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  lineHeight: 1.6 * 14,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: "on",
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: true,
                  lineDecorationsWidth: 11,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: "line",
                  selectOnLineNumbers: true,
                  roundedSelection: true,
                  readOnly: false,
                  mouseWheelZoom: true,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontLigatures: true,
                  smoothScrolling: true
                }}
                wrapperProps={{
                  className:
                    "bg-[#0D0D0D] [&_.monaco-editor]:bg-[#0D0D0D] [&_.margin]:bg-[#0D0D0D]"
                }}
              />
            </div>
          )}
          {activeRightTab === "result" && (
            Object.keys(resultHistory).length !== 0 ? (
              <div className="flex-1 min-h-0 overflow-y-auto w-full p-6 pb-20 space-y-5 bg-[#0D0D0D] text-slate-200 scrollbar-thin select-text animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono">Execution Feedback</h3>
                  <div>
                    {(() => {
                      const s = String(resultHistory?.status || "").toLowerCase().trim();
                      if (s === "accepted") return <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono uppercase">Accepted</span>;
                      if (s === "wrong" || s === "wrong answer") return <span className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold font-mono uppercase">Wrong Answer</span>;
                      if (s.includes("time") || s === "tle" || s === "time_limit_exceeded") return <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono uppercase">Time Limit Exceeded</span>;
                      if (s.includes("memory") || s === "mle" || s === "memory_limit_exceeded") return <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold font-mono uppercase">Memory Limit Exceeded</span>;
                      return <span className="px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold font-mono uppercase">{resultHistory?.status || "Runtime Error"}</span>;
                    })()}
                  </div>
                </div>
                {(() => {
                  const s = String(resultHistory?.status || "").toLowerCase().trim();
                  let bgStyle = "bg-slate-900/40 border-slate-800 text-slate-400";
                  let title = "Evaluation Ended";
                  let description = "Your code execution completed processing.";

                  if (s === "accepted") {
                    bgStyle = "bg-emerald-500/[0.02] border-emerald-500/20 text-emerald-400";
                    title = "Passed";
                    description = "All Testcases Passed";
                  } else if (s === "wrong" || s === "wrong answer") {
                    bgStyle = "bg-rose-500/[0.02] border-rose-500/20 text-rose-400";
                    title = "Wrong Answer";
                    description = "Solution is incorrect";
                  } else if (s.includes("time") || s === "tle" || s === "time_limit_exceeded") {
                    bgStyle = "bg-amber-500/[0.02] border-amber-500/20 text-amber-400";
                    title = "Time Limit Exceeded";
                    description = "Algorithm's time limit exceeded";
                  } else if (s.includes("memory") || s === "mle" || s === "memory_limit_exceeded") {
                    bgStyle = "bg-purple-500/[0.02] border-purple-500/20 text-purple-400";
                    title = "Memory Overflow";
                    description = "Heap allocations went outside your language's sandbox memory threshold.";
                  }

                  return (
                    <div className={`p-6 rounded-xl text-center space-y-1.5 border relative overflow-hidden ${bgStyle}`}>
                      <p className="text-[10px] uppercase font-mono tracking-widest opacity-80 font-bold">{title}</p>
                      <h1 className="text-3xl font-black font-mono text-white tracking-tight">
                        TestCase: {resultHistory?.testCasesPassed ?? 0} / {resultHistory?.testCasesTotal ?? 0}
                      </h1>
                      <p className="text-[11px] text-slate-400 max-w-xs mx-auto">{description}</p>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#141414] border border-slate-800 p-3.5 rounded-xl font-mono text-xs shadow-inner">
                    <span className="text-slate-500 font-bold block mb-1">Execution Time</span>
                    <span className="text-sm font-bold text-slate-200">{resultHistory?.runtime || "--"}</span>
                  </div>
                  <div className="bg-[#141414] border border-slate-800 p-3.5 rounded-xl font-mono text-xs shadow-inner">
                    <span className="text-slate-500 font-bold block mb-1">Memory Allocation</span>
                    <span className="text-sm font-bold text-slate-200">{resultHistory?.memory || "-- "}</span>
                  </div>
                </div>
                {String(resultHistory?.status || "").toLowerCase().includes("wrong") && resultHistory?.failedTestCaseDetails && (
                  <div className="space-y-2 font-mono text-xs pt-2">
                    <div className="bg-[#141414] border border-slate-800 rounded-xl p-4 space-y-3 shadow-inner">
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">Input Stream</span>
                        <pre className="bg-black/40 p-2.5 rounded border border-slate-800 text-slate-300 overflow-x-auto whitespace-pre-wrap">{resultHistory.failedTestCaseDetails.input}</pre>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] text-emerald-500 block mb-1">Expected Output</span>
                          <pre className="bg-black/40 p-2.5 rounded border border-slate-800 text-emerald-400 font-bold overflow-x-auto">{resultHistory.failedTestCaseDetails.expected}</pre>
                        </div>
                        <div>
                          <span className="text-[10px] text-rose-500 block mb-1">Your Output</span>
                          <pre className="bg-black/40 p-2.5 rounded border border-slate-800 text-rose-400 font-bold overflow-x-auto">{resultHistory.failedTestCaseDetails.received || "No Output"}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {resultHistory?.errorMessage && (
                  <div className="space-y-1.5 font-mono text-xs pt-1">
                    <pre className="w-full bg-[#141414] border border-rose-900/30 p-3.5 rounded-xl text-rose-300 overflow-x-auto whitespace-pre-wrap max-h-48 shadow-inner">
                      {resultHistory.errorMessage}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full w-full p-6 text-slate-500 text-xs font-mono uppercase tracking-widest bg-[#0D0D0D]">
                Submit problem first
              </div>
            ))
          }
          {activeRightTab === "testrun" && testCaseResults && (
            <div className="flex-1 min-h-0 overflow-y-auto pb-20">
              <TestCaseResults
                results={testCaseResults?.results} 
                status={testCaseResults?.status}
                errorMessage={testCaseResults?.errorMessage}
                runtime={testCaseResults?.runtime}
                memory={testCaseResults?.memory}
                failedTestCaseDetails={testCaseResults?.failedTestCaseDetails}
                totalTestCases={testCaseResults?.testCasesTotal}
              />
            </div>
          )}

          {activeRightTab === "testcase" && problemData && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 min-h-0 overflow-y-auto bg-[#0D0D0D] px-4 py-4 pb-20 space-y-4"
            >
              {visibleFields.map((field, i) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-[#1A1A1A] border border-white/[0.06] rounded-xl p-3"
                >
                  <div>
                    <label className="label">
                      <span className="label-text text-xs text-slate-300">
                        Input
                      </span>
                    </label>
                    <input
                      className="input input-bordered w-full bg-black/40 border-white/10 text-slate-100"
                      {...register(`visibleTestCases.${i}.input`)}
                      defaultValue={field.input}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-xs text-slate-300">
                        Output
                      </span>
                    </label>
                    <input
                      className="input input-bordered w-full bg-black/40 border-white/10 text-slate-100"
                      {...register(`visibleTestCases.${i}.output`)}
                      defaultValue={field.output}
                    />
                  </div>
                  <div className="mt-6 flex gap-2">
                    <button
                      type="button"
                      className="btn btn-xs btn-ghost text-rose-400 hover:bg-rose-500/10"
                      onClick={() => removeVisible(i)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}

              {errors.visibleTestCases && (
                <p className="text-sm text-[#F87171]">
                  {errors.visibleTestCases.message}
                </p>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  className="btn btn-sm border-white/10 bg-[#1A1A1A] text-slate-100 hover:border-white/20 hover:bg-[#222]"
                  onClick={() =>
                    appendVisible({ input: "", output: "", explanation: "" })
                  }
                >
                  <IoIosAddCircle size={18} /> Add TestCase
                </button>
                <button
                  type="submit"
                  className="btn btn-sm bg-[#EF4444] text-white border-0 hover:bg-[#DC2626]"
                >
                  Apply Session Cases
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
export default Problem;
