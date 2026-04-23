import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate, useParams } from "react-router";
import Editor from '@monaco-editor/react';
import { useRef } from "react";
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
  const debouncedSave = useRef(
    debounce(({ selectedLanguage, value }) => {
      dispatch(getCodeWrittenOnEditor({ selectedLanguage, value }));
    }, 1000)
  ).current;
  const dispatch = useDispatch()
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
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  // const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
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
  // useEffect(() => {
  //     const fetchProblem = async () => {
  //         setLoading(true);
  //         try {
  //             const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
  //             console.log(data)
  //             const initialCode = data?.startCode?.find((lang) => lang.language.toLowerCase() == langMap[selectedLanguage.toLowerCase()].toLowerCase())?.initialCode
  //             setProblem(data)
  //             setCode(prevState => ({
  //                 ...prevState,
  //                 [selectedLanguage]: initialCode
  //             }))
  //             setLoading(false)
  //             // setTestCaseHistory(data?.visibleTestCases)
  //             // console.log(data?.visibleTestCases)
  //         } catch (err) {
  //             console.error('Error fetching problem: ', err);
  //             setLoading(false)
  //         }
  //     }
  //     fetchProblem();
  // }, [problemId]);
  // useEffect(() => {
  //     if (problemData) {
  //         const initialCode = problem?.startCode?.find((lang) => lang.language.toLowerCase() == langMap[selectedLanguage.toLowerCase()].toLowerCase())?.initialCode
  //         const codeSetInMonaco = () => {
  //             setCode((prevState) => ({
  //                 ...prevState,
  //                 [selectedLanguage]: initialCode
  //             }))
  //         }
  //         codeSetInMonaco()

  //     }
  // }, [selectedLanguage, problemId])
  // useEffect(() =>{
  //     const value= code[selectedLanguage]
  //     console.log('Hello')
  //     dispatch(getCodeWrittenOnEditor({selectedLanguage,value}))
  // },[problemId])
  // useEffect(() => {
  //     if (load) {
  //         console.log(updatedCode)
  //         setCode((prevState) => ({
  //             ...prevState,
  //             [selectedLanguage]: updatedCode
  //         }))
  //         // console.log(code)
  //         dispatch(changeLoadState())
  //     }
  // }, [load])

  useEffect(() => {
    setLoading(true)
    dispatch(getProblem(problemId))
    setLoading(false)
  }, [])
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
    if(testcase==='testcase'){
      setActiveRightTab('code') 
    }
    else{
      setActiveRightTab('testcase')
    }
  }
  // Run Code
  async function runCode(code, lang, driverCode) {
    try {
      const driverBefore = `${driverCode?.find((obj) => obj.lang.toLowerCase() == lang.toLowerCase())?.before}\n`
      const driverAfter = `${driverCode?.find((obj) => obj.lang.toLowerCase() == lang.toLowerCase())?.after}\n`
      // console.log("Hello",driverBefore,"World", driverAfter)
      const fullCode = driverBefore + code + driverAfter
      console.log(fullCode)
      const data = {
        fullCode,
        lang
      }
      const response = await axiosClient.post(`/submission/run/${problemId}`, data)
      console.log(response?.data)
      if (response?.data[0].status.id === 3) {
        alert('Code Run successfully')
      }
      else {
        alert(`${response?.data[0]?.status.description}`)
      }
      // setTestCaseHistory(response?.data)
      // setActiveRightTab('testcase')
    } catch (err) {
      return err.message;
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
      setSubmissionHistory([...submissionHistory, response?.data])
      setResultHistory(response?.data)
      setActiveRightTab('result')
      setActiveLeftTab('Submissions')
      // alert('Problem Submitted successfully')
    } catch (err) {
      console.log(err.message)
    }
  }
  useEffect(() => {  // All submissions made till now by same user for same problem fetch all 
    async function submittedProblem() {
      try {
        const { data } = await axiosClient.get(`/problem/submittedProblem/${problemId}`)
        if (typeof data === object) {
          setSubmissionHistory(data)
        }
        console.log(submissionHistory)
      } catch (err) {
        return err.message
      }
    }
    submittedProblem()
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

      <section className="flex-[1.3] min-w-0 bg-[#0D0D0D] flex flex-col overflow-hidden">
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
              onClick={()=>showTestCases(activeRightTab)} 
              className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 bg-transparent hover:bg-white/5 hover:text-white transition-all"
            >
              Console
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

          {activeRightTab === "result" &&
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
                <h3>Memory: {resultHistory?.memory}</h3>
                <h3>Time: {resultHistory?.runtime}</h3>
              </div>
            ) : (
              <div className="flex justify-center items-center flex-1 font-bold text-[#EF4444]">
                <h1>Submit problem first</h1>
              </div>
            ))}

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