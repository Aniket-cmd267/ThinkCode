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

const TestCaseSchema = z.object({
    visibleTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required')
        })
    )
})
function Problem() {
    const navigate= useNavigate();
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
    const {isAuthenticated}= useSelector(state => state.slice1)
    const [code, setCode] = useState({
        'c++': '',
        'java': '',
        'javascript': ''
    });
    let { problemId } = useParams();
    const { updatedCode , problemData} = useSelector(state => state.slice2)
    const editorRef = useRef(null);
    // console.log(problemId)
    const langMap = {
        'javascript': 'JavaScript',
        'java': 'Java',
        'c++': 'C++'
    }
    useEffect(() =>{
        if(!isAuthenticated){
            navigate('/')
        }
    },[isAuthenticated])
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

    useEffect(() =>{
        setLoading(true)
        dispatch(getProblem(problemId))
        setLoading(false)
    },[])
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
    function handleEditorDidMount(editor) { // we are giving the instance of monaco editor 
        editorRef.current = editor
    }
    // Console
    const showTestCases = () => {
        setActiveRightTab('testcase')
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
    async function onSubmit(data) {
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
        <div className="flex bg-base-100 min-h-screen ">
            <div className="w-1/2 flex flex-col border-r border-base-300 ">
                {/* Tab section */}
                <div className="tabs tabs-bordered bg-base-200 px-4">
                    <button className={`tab ${activeLeftTab === 'description' ? 'tab-active' : ''}`}
                        onClick={() => setActiveLeftTab('description')}
                    >Description</button>
                    <button className={`tab ${activeLeftTab === 'Editorial' ? 'tab-active' : ''}`}
                        onClick={() => setActiveLeftTab('Editorial')}
                    >Editorial</button>
                    <button className={`tab ${activeLeftTab === 'Solutions' ? 'tab-active' : ''}`}
                        onClick={() => setActiveLeftTab('Solutions')}
                    >Solutions</button>
                    <button className={`tab ${activeLeftTab === 'Submissions' ? 'tab-active' : ''}`}
                        onClick={() => setActiveLeftTab('Submissions')}
                    >Submissions</button>
                    <button className={`tab ${activeLeftTab === 'ChatAi' ? 'tab-active' : ''}`}
                        onClick={() => setActiveLeftTab('ChatAi')}>ChatAi
                    </button>
                </div>
                {/* COntent Section */}
                <div className="flex-1 overflow-y-auto p-6">
                    {problemData && (
                        <>
                            {activeLeftTab === 'description' && (
                                <Description problem={problemData} />
                            )}
                            {activeLeftTab === 'Editorial' && (
                                <Editorial />
                            )}
                            {activeLeftTab === 'Solutions' && (
                                <Solutions problem={problemData} />
                            )}
                            {activeLeftTab === 'Submissions' && (
                                <Submissions submissionHistory={submissionHistory} />
                            )}
                            {activeLeftTab === 'ChatAi' && (
                                <ChatAi className="overflow-y-scroll" problem={problemData} problemId= {problemId}></ChatAi>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="w-1/2 flex flex-col overflow-hidden">
                <div className="tabs tabs-bordered bg-base-200 px-4">
                    <button className={`tab ${activeRightTab === 'code' ? 'tab-active' : ''}`}
                        onClick={() => setActiveRightTab('code')}>Code</button>
                    <button className={`tab ${activeRightTab === 'testcase' ? 'tab-active' : ''}`}
                        onClick={() => setActiveRightTab('testcase')}>TestCase</button>
                    <button className={`tab ${activeRightTab === 'result' ? 'tab-active' : ''}`}
                        onClick={() => setActiveRightTab('result')}>Result</button>
                </div>
                <div className="flex-1 flex flex-col">
                    {activeRightTab === 'code' && (
                        <div className="flex-1 flex flex-col">
                            <div className="flex items-center gap-4 p-4 border-b border-base-300">
                                {['javascript', 'java', 'c++'].map((lang) => (
                                    <div className="flex" key={lang}>
                                        <button className={`btn ${selectedLanguage === lang ? 'btn-sm btn-primary' : 'btn-sm btn-accent'}`}
                                            onClick={() => setSelectedLanguage(lang)}>
                                            {lang === 'javascript' ? 'Javascript' : lang === 'c++' ? 'C++' : 'Java'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex-1 h-[500px]">
                                <Editor
                                    height='100%'
                                    language={getLanguageForMonaco(selectedLanguage)}
                                    onChange={handleEditorChange}
                                    value={updatedCode[selectedLanguage]}
                                    onMount={handleEditorDidMount}
                                    theme="vs-dark"
                                    options={{
                                        fontSize: 14,
                                        minimap: { enabled: true },
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        tabSize: 2,
                                        insertSpaces: true,
                                        wordWrap: 'on',
                                        lineNumbers: 'on',
                                        glyphMargin: false,
                                        folding: true,
                                        lineDecorationsWidth: 11,
                                        lineNumbersMinChars: 3,
                                        ColorDecorators: 'always',
                                        renderLineHighlight: 'line',
                                        selectOnLineNumbers: true,
                                        roundedSelection: true,
                                        readOnly: false,
                                        cursorStyle: 'line',
                                        mouseWheelZoom: true,
                                        fontFamily: 'JetBrains Mono, Fira Code, monospace',
                                        smoothScrolling: true,
                                        cursorBlinking: 'smooth'
                                    }}
                                />
                            </div>
                            <div className="p-4 border-t border-base-300 flex justify-center gap-4">
                                <button className="btn btn-ghost" onClick={() => showTestCases()}>Console</button>
                                <button className="btn btn-ghost" onClick={() => runCode(code, selectedLanguage, problemData?.driverCode)}>Run</button>
                                <button className="btn btn-ghost" onClick={() => submitCode(code, selectedLanguage)}>Submit</button>
                            </div>
                        </div>
                    )}
                    {activeRightTab === 'result' &&
                        (Object.keys(resultHistory).length !== 0 ?
                            (<div className={`${resultHistory?.status === 'accepted' ? 'bg-success' : 'bg-error'}`}>
                                <h2>TestCase: {resultHistory?.testCasesPassed + '/' + resultHistory?.testCasesTotal}</h2>
                                <h3>Memory: {resultHistory?.memory}</h3>
                                <h3>Time: {resultHistory?.runtime}</h3>
                            </div>) : (
                                <div className="flex justify-center items-center min-h-screen font-bold text-primary">
                                    <h1>Submit problem first</h1>
                                </div>
                            )
                        )
                    }
                    {activeRightTab === 'testcase' && problemData &&
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 ml-4 bg-neutral-950 p-4">
                            {visibleFields.map((field, i) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                    <div>
                                        <label className="label"><span className="label-text">Input</span></label>
                                        <input className="input input-bordered w-full" {...register(`visibleTestCases.${i}.input`)} defaultValue={field.input} />
                                    </div>
                                    <div>
                                        <label className="label"><span className="label-text">Output</span></label>
                                        <input className="input input-bordered w-full" {...register(`visibleTestCases.${i}.output`)} defaultValue={field.output} />
                                    </div>
                                    <div>
                                        <div className="mt-2 flex gap-2">
                                            <button type="button" className="btn btn-xs btn-ghost" onClick={() => removeVisible(i)}>X</button>
                                        </div>
                                    </div>
                                </div>))}
                            {errors.visibleTestCases && <p className="text-sm text-error">{errors.visibleTestCases.message}</p>}
                            <div>
                                <button type="button" className="btn btn-sm" onClick={() => appendVisible({ input: "", output: "", explanation: "" })}>
                                    <IoIosAddCircle size={25} /> Add TestCase
                                </button>
                            </div>
                            <button type="submit" className="btn">Submit</button>
                        </form>}
                </div>
            </div>
        </div>
    )
}
export default Problem;