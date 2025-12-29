import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate, useParams } from "react-router";
import Editor from '@monaco-editor/react';
import { useRef } from "react";
import ChatAi from "./ChatAi";
import { useSelector } from "react-redux"
import { IoIosAddCircle } from "react-icons/io";

function Problem() {
    const navigate= useNavigate();
    const [selectTestCase, setTestCaseTab] =useState()
    const [submissionHistory, setSubmissionHistory]= useState([]);
    const [testcaseHistory, setTestCaseHistory]= useState([])
    const [resultHistory, setResultHistory]= useState({});
    const [activeLeftTab, setActiveLeftTab] = useState('description');
    const [activeRightTab, setActiveRightTab] = useState('code');
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    let { problemId } = useParams();
    const {isAuthenticated}= useSelector(state => state.slice1)
    const editorRef = useRef(null);
    // console.log(problemId)
    const langMap= {
        'javascript': 'JavaScript',
        'java' : 'Java',
        'c++' : 'C++'
    }
    useEffect(() =>{
        if(!isAuthenticated){
            navigate('/login')
        }
    },[isAuthenticated])
    useEffect(() => {
        const fetchProblem = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get(`/problem/problemById/${problemId}`);
                const initialCode= response?.data?.startCode?.find((lang) =>lang.language==langMap[selectedLanguage])?.initialCode
                setProblem(response.data)
                setCode(initialCode)
                setLoading(false)
                setTestCaseHistory(response?.data.visibleTestCases)
            } catch (err) {
                console.error('Error fetching problem: ', err);
                setLoading(false)
            }
        }
        fetchProblem();
    }, [problemId]);
    useEffect(() =>{
        if(problem){
            const initialCode= problem?.startCode?.find((lang) => lang.language== langMap[selectedLanguage]).initialCode
            setCode(initialCode)
        }
    },[selectedLanguage,problemId])
    function getDifficultyColor(difficulty) {
        switch (difficulty) {
            case 'easy': return 'text-green-500'
            case 'medium': return 'text-yellow-500'
            case 'hard': return 'text-red-300'
            default: return 'text-gray-500'
        }
    }
    function getLanguageForMonaco(lang){
        switch(lang){
            case 'javascript': return 'Javascript'
            case 'cpp'  : return 'C++'
            case 'java' : return 'Java'
            default: return '' 
        }
    }
    function handleEditorChange(value){
        setCode(value || '')
    }
    function handleEditorDidMount(editor){ // we are giving the instance of monaco editor 
        editorRef.current= editor
    }

    // Console
    const showTestCases= () =>{
        setActiveRightTab('testcase')
    }
    
    // Run Code
    async function runCode(code,lang) {
        try{
            const data={
                code,
                lang
            }
            console.log(data)
            const response= await axiosClient.post(`/submission/run/${problemId}`,data)
            console.log(response?.data)
            alert('Code Run successfully')
            // setTestCaseHistory(response?.data)
            // setActiveRightTab('testcase')
        }catch(err){
            return err.message;
        }
    }
    // Submission 
    async function submitCode(code,language){
        try{
            const data= {
                code,
                language
            }
            const response= await axiosClient.post(`/submission/submit/${problemId}`,data)
            console.log(response?.data)
            setSubmissionHistory([...submissionHistory,response?.data])
            setResultHistory(response?.data)
            setActiveRightTab('result')
            setActiveLeftTab('Submissions')
            // alert('Problem Submitted successfully')
        }catch(err){
            console.log(err.message)
        }
    }
    if (loading)
        return (
            <div className="loading loading-spinner"></div>
        )
    return (
        <div className="min-h-screen flex bg-base-100">
            <div className="w-1/2 flex flex-col border-r border-base-300">
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
                    {problem && (
                        <>
                            {activeLeftTab === 'description' && (
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <h1 className="text-2xl font-bold">{problem.title}</h1>
                                        <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
                                            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                        </div>
                                        <div className="badge badge-primary">{problem.tags.charAt(0).toUpperCase() + problem.tags.slice(1)}</div>
                                    </div>

                                    <div className="whitespace-pre-wrap leading-relaxed">{problem.description}</div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Examples: </h3>
                                        <div className="space-y-4">
                                            {problem.visibleTestCases.map((example, index) => (
                                                <div key={index} className="bg-base-200 p-4 rounded-lg">
                                                    <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
                                                    <div className="space-y-2 text-sm font-mono">
                                                        <div><strong>Input:</strong> {example.input}</div>
                                                        <div><strong>Output:</strong> {example.output}</div>
                                                        <div><strong>Explanation:</strong> {example.explanation}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeLeftTab === 'Editorial' && (
                                <div>
                                    <div className="prose max-w-none">
                                        <h2 className="text-xl font-bold mb-4">Editorial</h2>
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {'Editorial is here for the problem'}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeLeftTab === 'Solutions' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Solutions</h2>
                                    <div className="space-y-6">
                                        {problem.referenceSolution?.map((solution, index) => (
                                            <div key={index} className="border border-base-300 rounded-lg">
                                                <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                                                    <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
                                                </div>
                                                <div className="p-4">
                                                    {/* <p className="bg-base-300 p-4 rounded text-sm overflow-x-auto">{solution?.completeCode}</p> */}
                                                    <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">{solution?.completeCode}</pre>
                                                </div>

                                            </div>

                                        ))}
                                    </div>
                                </div>
                            )}
                            {activeLeftTab === 'Submissions' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                                    <div className=" p-3 rounded-2xl">
                                        <div className="flex justify-around text-warning w-full bg-neutral-800">
                                            <p>No</p>
                                            <h3>Status</h3>
                                            <h3>Language</h3>
                                            <h3>Runtime</h3>
                                            <h3>Memory</h3> 
                                            {/* <p>TCPassed/TotalTCPassed</p> */}
                                        </div>
                                        {
                                            submissionHistory?.map((data,i) => (
                                                
                                                <div key={i} className="flex justify-around w-full text-accent bg-neutral-800">
                                                    
                                                    <p className="text-accent">{i + 1}</p>
                                                    <h3>{data?.status}</h3>
                                                    <h3>{data?.language}</h3>
                                                    <h3>{data?.runtime}</h3>
                                                    <h3>{data?.memory}</h3> 
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                            {activeLeftTab === 'ChatAi' && (
                                <ChatAi className="overflow-y-scroll" problem={problem}></ChatAi>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="w-1/2 flex flex-col min-h-screen">
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
                                {['javascript','java','c++'].map((lang) => (
                                    <div className="flex" key={lang}>
                                        <button className={`btn ${selectedLanguage===lang ? 'btn-sm btn-primary' : 'btn-sm btn-accent'}`}
                                         onClick={() => setSelectedLanguage(lang)}>
                                            {lang==='javascript' ? 'Javascript' : lang==='c++' ? 'C++' : 'Java'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex-1">
                                <Editor
                                    height='100%'
                                    language={getLanguageForMonaco(selectedLanguage)}
                                    onChange={handleEditorChange}
                                    value={code}
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
                                        ColorDecorators : 'always',
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
                                <button className="btn btn-ghost" onClick={() => runCode(code,selectedLanguage)}>Run</button>
                                <button className="btn btn-ghost" onClick={() => submitCode(code,selectedLanguage)}>Submit</button>
                            </div>
                        </div>
                    )}
                    {activeRightTab=== 'result' && (
                                <div className={`${resultHistory?.status === 'accepted' ? 'bg-success' : 'bg-error'}`}>
                                    <h2>TestCase: {resultHistory?.testCasesPassed+'/'+resultHistory?.testCasesTotal}</h2>
                                    <h3>Memory: {resultHistory?.memory}</h3>
                                    <h3>Time: {resultHistory?.runtime}</h3>
                                </div>
                        )
                    }
                    {activeRightTab=== 'testcase' && 
                    (
                        <div className="text-white flex gap-3 items-center mt-10 ml-5 bg-neutral-950 p-3">
                            {problem && testcaseHistory.map((testcase,index) =>(
                                <div key={index}>
                                    <button className="btn btn-sm btn-accent" onClick={() => setTestCaseTab(testcase)}>TestCase {index+1}</button>
                                </div>
                            ))} 
                            <button className="btn-sm p-0"><IoIosAddCircle size={25}/></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Problem;