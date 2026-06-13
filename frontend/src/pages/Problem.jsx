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
    debounce(({ selectedLanguage, value }) => {
      dispatch(getCodeWrittenOnEditor({ selectedLanguage, value }));
    }, 1000)
  ).current;
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(TestCaseSchema),
    defaultValue: {
      visibleTestCases: [{ input: "", output: "" }]
    }
  })
  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
    control,
    name: "visibleTestCases",
  });
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [resultHistory, setResultHistory] = useState({});
  const [testCaseResults, setTestCaseResults] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  // const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const { isAuthenticated } = useSelector(state => state.slice1)
  const [code, setCode] = useState({
    'c++': '',
    'java': '',
    'javascript': ''
  });
  let { problemId } = useParams();
  const { updatedCode, problemData } = useSelector(state => state.slice2)
  const editorRef = useRef(null);
  // console.log(problemId)

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
  function formatRuntime(runtime) {
    const value = Number(runtime)
    if (!Number.isFinite(value) || value < 0) return '--'
    if (value === 0) return '0 ms'

    const milliseconds = value < 10 ? value * 1000 : value
    if (milliseconds < 1000) return `${milliseconds.toFixed(0)} ms`
    return `${(milliseconds / 1000).toFixed(2)} s`
  }
  function formatMemory(memory) {
    const value = Number(memory)
    if (!Number.isFinite(value) || value < 0) return '--'
    if (value >= 1024) return `${(value / 1024).toFixed(2)} MB`
    return `${value.toFixed(0)} KB`
  }
  function getLanguageForMonaco(lang) {
    switch (lang) {
      case 'javascript': return 'Javascript'
      case 'cpp': return 'C++'
      case 'java': return 'Java'
      default: return ''
    }
  }
  function handleEditorChange(value) {
    // console.log(value)
    // console.log(selectedLanguage)
    setCode((prevState) => ({
      ...prevState,
      [selectedLanguage]: value
    }))
    debouncedSave({ selectedLanguage, value })
    // console.log(code)
  }
  function handleEditorDidMount(editor, monaco) { // we are giving the instance of monaco editor 
    editorRef.current = editor

    // Custom dark theme with soft-red comments for eye-strain reduction
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
  // Console
  const showTestCases = (testcase) => {
    if (testcase === 'testcase') {
      setActiveRightTab('code')
    }
    else {
      setActiveRightTab('testcase')
    }
  }
  // Run Code
  async function runCode(code, lang, driverCode) {
    try {
      const driverBefore = `${driverCode?.find((obj) => obj.lang.toLowerCase() == lang.toLowerCase())?.before}\n`
      const driverAfter = `${driverCode?.find((obj) => obj.lang.toLowerCase() == lang.toLowerCase())?.after}\n`
      const fullCode = driverBefore + code + driverAfter
      console.log(fullCode)
      const data = {
        fullCode,
        lang
      }
      const response = await axiosClient.post(`/submission/run/${problemId}`, data)
      console.log("Run Code Response:", response?.data)

      // Store the detailed test case results
      setTestCaseResults(response?.data)

      // Switch to result tab
      setActiveRightTab('testrun')
    } catch (err) {
      console.log(err.message)
      // Show error in testrun tab
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
  // Submission 
  async function submitCode(code, lang) {
    try {
      const driverBefore = `${problemData?.driverCode?.find((obj) => obj.lang.toLowerCase() == lang.toLowerCase())?.before}\n`
      const driverAfter = `${problemData?.driverCode?.find((obj) => obj.lang.toLowerCase() == lang.toLowerCase())?.after}\n`
      // console.log("Hello",driverBefore,"World", driverAfter)
      const fullCode = driverBefore + code + driverAfter
      console.log(fullCode)
      const data = {
        code,
        fullCode,
        lang
      }
      const response = await axiosClient.post(`/submission/submit/${problemId}`, data)
      console.log(response)
      console.log(response?.data)
      if (response?.data?.status === 'accepted') {
        alert('Problem solved successfully')
      }
      setSubmissionHistory((prev) => [response?.data, ...prev])
      setResultHistory(response?.data)
      setActiveRightTab('result')
      setActiveLeftTab('Submissions')
      await fetchSubmissionHistory()
      // alert('Problem Submitted successfully')
    } catch (err) {
      console.log(err.message)
    }
  }
  useEffect(() => {  // All submissions made till now by same user for same problem fetch all 
    fetchSubmissionHistory()
  }, [problemId])

  if (loading) {
    return (
      <div className="loading loading-spinner"></div>
    )
  }
  async function onSubmit(data) { // this is for the testcases.
    try {
      console.log(data)
      await axiosClient.put(`/problem/update/${problemId}`, {
        problemData,
        hiddenTestCases: data
      })
      alert('Problem updated successfully')
    } catch (err) {
      console.log(err.message)
    }
  }
  return (
    <div className="h-[calc(100vh-64px)] bg-[#0D0D0D] text-slate-100 flex overflow-hidden">
      <aside
        className="relative flex flex-col border-r border-white/[0.06] bg-[#111111] transition-all duration-300 w-[72px] shrink-0"
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

      <section className="flex-[1.3] min-w-0 bg-[#141414] border-r border-white/[0.06] flex flex-col overflow-hidden">
        {problemData && (
          <>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
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
                  className="overflow-y-scroll"
                  problem={problemData}
                  problemId={problemId}
                />
              )}
            </div>
          </>
        )}
      </section>

      {/* <section className="flex-[1.3] min-w-0 bg-[#2684bb] flex flex-col overflow-hidden"> */}
      <section className="flex-[1.3] min-w-0 bg-[#121824] flex flex-col overflow-hidden border-l border-slate-800/80">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#111111]">
          <div className="flex items-center gap-2">
            <select
              className="bg-[#1A1A1A] border border-white/10 rounded-lg text-xs text-slate-100 px-3 py-2 outline-none focus:border-[#EF4444]/60 focus:ring-0"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
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
                  code[selectedLanguage],
                  selectedLanguage,
                  problemData?.driverCode
                )
              }
              className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg border border-white/10 text-slate-300 bg-transparent hover:bg-white/5 hover:text-white transition-all"
            >
              Run
            </button>
            <button
              type="button"
              onClick={() => submitCode(code[selectedLanguage], selectedLanguage)}
              className="inline-flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg bg-[#EF4444] text-white font-semibold hover:bg-[#DC2626] active:scale-95 transition-all"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
          {activeRightTab === "code" && (
            <div className="flex-1">
              <Editor
                height="100%"
                language={getLanguageForMonaco(selectedLanguage)}
                onChange={handleEditorChange}
                value={updatedCode[selectedLanguage]}
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

          {/* {activeRightTab === "result" &&
            (Object.keys(resultHistory).length !== 0 ? (
              <div
                className={`p-4 ${resultHistory?.status === "accepted"
                  ? "bg-emerald-950 text-emerald-300"
                  : "bg-[#3b0b0b] text-rose-200"
                  }`}
              >
                <h2>
                  TestCase: {resultHistory?.testCasesPassed}/
                  {resultHistory?.testCasesTotal}
                </h2>
                <h3>Memory: {formatMemory(resultHistory?.memory)}</h3>
                <h3>Time: {formatRuntime(resultHistory?.runtime)}</h3>
              </div>
            ) : (
              <div className="flex justify-center items-center flex-1 font-bold text-[#EF4444]">
                <h1>Submit problem first</h1>
              </div>
            ))} */}
          {activeRightTab === "result" &&
            (Object.keys(resultHistory).length !== 0 ? (
              <div className="p-6 space-y-5 overflow-y-auto flex-1 scrollbar-thin">

                {/* TOP CARD: STATUS HEADER */}
                <div className="flex items-center justify-between border-b border-slate-700/40 pb-4">
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                      Submission
                    </h3>
                    {/* <p className="text-[11px] text-slate-400 mt-0.5">Automated runtime assertions evaluation</p> */}
                  </div>
                  <div>
                    {(() => {
                      const s = String(resultHistory?.status || "").toLowerCase();
                      if (s === "accepted") {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase">
                            Accepted
                          </span>
                        );
                      } else if (s === "wrong") {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 uppercase">
                            Wrong Answer
                          </span>
                        );
                      } else if (s === "time_limit_exceeded" || s.includes("tle") || s.includes("time")) {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase">
                            Time Limit Exceeded
                          </span>
                        );
                      } else if (s === "memory_limit_exceeded" || s.includes("mle") || s.includes("memory")) {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono tracking-wider bg-purple-500/10 border border-purple-500/30 text-purple-400 uppercase">
                            Memory Limit Exceeded
                          </span>
                        );
                      } else {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-mono tracking-wider bg-slate-700/40 border border-slate-600/30 text-slate-300 uppercase">
                            Runtime Error
                          </span>
                        );
                      }
                    })()}
                  </div>
                </div>

                {/* CRISP METRIC HERO ACCENT DISPLAY */}
                <div className={`p-6 rounded-xl text-center space-y-1.5 border relative overflow-hidden ${resultHistory?.status === "accepted"
                  ? "bg-emerald-500/[0.02] border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/[0.02] border-red-500/20 text-red-400"
                  }`}>
                  <p className="text-[10px] uppercase font-mono tracking-widest opacity-80 font-bold">
                    {resultHistory?.status === "accepted" ? "Passed" : "Failed"}
                  </p>
                  <h1 className="text-4xl font-black font-mono text-white tracking-tight">
                    TestCase: {resultHistory?.testCasesPassed}
                    <span className={resultHistory?.status === "accepted" ? "text-emerald-500" : "text-red-500"}> / </span>
                    {resultHistory?.testCasesTotal}
                  </h1>
                </div>

                {/* TWIN SYSTEM METRICS GRID */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-[#161B26] border border-slate-800 p-3.5 rounded-xl space-y-1 hover:border-slate-700/60 transition-colors">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                      Memory
                    </span>
                    <p className="text-sm font-black font-mono text-slate-200">
                      {formatMemory(resultHistory?.memory)}
                    </p>
                  </div>

                  <div className="bg-[#161B26] border border-slate-800 p-3.5 rounded-xl space-y-1 hover:border-slate-700/60 transition-colors">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                      RunTime
                    </span>
                    <p className="text-sm font-black font-mono text-slate-200">
                      {formatRuntime(resultHistory?.runtime)}
                    </p>
                  </div>
                </div>

                {/* EXCLUSIVE FAILURE DETAILED TERMINAL BLOCK */}
                {resultHistory?.status !== "accepted" && resultHistory?.failedTestCaseDetails && (
                  <div className="space-y-2.5 font-mono text-xs pt-2">
                    <div className="text-slate-300 font-sans font-bold uppercase tracking-wide">
                      Execution Mismatch Breakdown
                    </div>

                    <div className="bg-[#161B26] border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-inner">
                      <div>
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500 block mb-1">
                          Input Stream (`stdin`)
                        </span>
                        <div className="bg-[#0B0F19] border border-slate-800 text-slate-200 p-2.5 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-24 break-all">
                          {resultHistory.failedTestCaseDetails.input}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                            Expected Output
                          </span>
                          <div className="bg-[#0B0F19] border border-emerald-950/40 text-emerald-400 p-2.5 rounded-lg overflow-x-auto font-bold break-all">
                            {resultHistory.failedTestCaseDetails.expected}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-red-400 block mb-1">
                            Your Output
                          </span>
                          <div className="bg-[#0B0F19] border border-red-950/40 text-red-400 p-2.5 rounded-lg overflow-x-auto font-bold break-all">
                            {resultHistory.failedTestCaseDetails.received || "No Output"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TRACEBACK RUNTIME COMPILER ERRORS DIAGNOSTIC */}
                {resultHistory?.status !== "accepted" && resultHistory?.errorMessage && (
                  <div className="space-y-1.5 font-mono text-xs pt-1">
                    <span className="text-red-400 font-sans font-bold uppercase tracking-wider block">
                      Diagnostic Traceback Stack:
                    </span>
                    <pre className="w-full bg-[#161B26] border border-red-500/20 p-3.5 rounded-xl text-red-300 overflow-x-auto whitespace-pre-wrap max-h-36 shadow-inner">
                      {resultHistory.errorMessage}
                    </pre>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex flex-col justify-center items-center flex-1 space-y-2 p-6 bg-[#0F131C]">
                {/* <div className="p-3 bg-red-500/10 rounded-full text-[#EF4444] animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            Awaiting Evaluation
          </h1>
          <p className="text-xs text-slate-500 text-center max-w-xs">
            Submit your solution
          </p> */}
              </div>
            ))}
          {activeRightTab === "testrun" && testCaseResults && (
            <TestCaseResults
              // Run Code states
              results={runResult?.results} // Array of visible test cases from running

              // Submit Code summary states
              status={submitResult?.status || runResult?.status}
              errorMessage={submitResult?.errorMessage || runResult?.errorMessage}
              runtime={submitResult?.runtime || runResult?.runtime}
              memory={submitResult?.memory || runResult?.memory}
              failedTestCaseDetails={submitResult?.failedTestCaseDetails}

              // Totals
              totalTestCases={submitResult?.testCasesTotal || runResult?.totalTestCases}
            />
          )}

          {activeRightTab === "testcase" && problemData && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto bg-[#0D0D0D] px-4 py-4 space-y-4"
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
                  Save Hidden Tests
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
