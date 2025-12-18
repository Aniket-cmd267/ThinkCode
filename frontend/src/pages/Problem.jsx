import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useParams } from "react-router";
import Editor from '@monaco-editor/react';
import { useRef } from "react";
import ChatAi from "./ChatAi";

function Problem() {
    const [activeLeftTab, setActiveLeftTab] = useState('description');
    const [activeRightTab, setActiveRightTab]= useState('code');
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [code, setCode] = useState('');
    let { problemId } = useParams();
    const editorRef = useRef(null);
    // console.log(problemId)
    useEffect(() => {
        const fetchProblem = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get(`/problem/problemById/${problemId}`);
                const initialCode = response.data.startCode.find((sc) => {
                    if (sc.language == 'C++' && selectedLanguage == 'cpp')
                        return true;
                    else if (sc.language == 'Java' && selectedLanguage == 'java')
                        return true;
                    else if (sc.language == 'Javascript' && selectedLanguage == 'javascript')
                        return true;
                    return false;

                })?.initialCode || 'Hello';
                setProblem(response.data);
                setCode(initialCode)
                setLoading(false);
            } catch (err) {
                console.error('Error fetching problem: ', err);
                setLoading(false)
            }
        }
        fetchProblem();

    }, [problemId]);
    function getDifficultyColor(difficulty) {
        switch (difficulty) {
            case 'easy': return 'text-green-500'
            case 'medium': return 'text-yellow-500'
            case 'hard': return 'text-red-300'
            default: return 'text-gray-500'
        }
    }
    function handleLanguageChange(language){
        setSelectedLanguage(language);
    }
    const handleEditorChange= (value) =>{
        setCode(value || '');
    }
    const handleEditorDidMount= (editor) =>{
        editorRef.current= editor
    }
    const getLanguageForMonaco = (lang) => {
        switch (lang) {
        case 'javascript': return 'javascript';
        case 'java': return 'java';
        case 'cpp': return 'cpp';
        default: return 'javascript';
        }
    };
    return (
        <div className="h-screen flex bg-base-100">
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
                    <button className={`tab ${activeLeftTab==='ChatAi' ? 'tab-active' : ''}`}
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
                            {activeLeftTab=== 'Editorial' &&  (
                                <div>
                                    <div className="prose max-w-none">
                                        <h2 className="text-xl font-bold mb-4">Editorial</h2>
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {'Editorial is here for the problem'}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeLeftTab=== 'Solutions' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Solutions</h2>
                                    <div className="space-y-6">
                                        {problem.referenceSolution?.map((solution,index) => (
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
                            {activeLeftTab=== 'Submissions' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                                    <div className="text-gray-500">
                                        Your submission history will appear here.
                                    </div>
                                </div>
                            )}
                            {activeLeftTab=== 'ChatAi' && (
                                <ChatAi className="overflow-y-scroll"></ChatAi>
                            )}
                        </>
                    )}
                </div>  
            </div>
                {/* Right Section */}
                <div className="w-1/2 flex flex-col">
                    <div className="tabs tabs-bordered bg-base-200 px-4">
                        <button className={`tab ${activeRightTab=== 'code' ? 'tab-active' : ''}`}
                        onClick={() => setActiveRightTab('code')}>Code</button>
                        <button className={`tab ${activeRightTab==='testcase' ? 'tab-active' : ''}`}
                            onClick={() => setActiveRightTab('testcase')}>TestCase</button>
                        <button className={`tab ${activeRightTab=== 'result' ? 'tab-active' : ''}`}
                            onClick={() => setActiveRightTab('result')}>Result</button>
                    </div>

                    <div className="flex-1 flex flex-col">
                        {activeRightTab === 'code' && (
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-center p-4 border-b border-base-300">
                                    <div className="flex gap-2">
                                        {['javascript','cpp','java'].map((lang) =>(
                                            <button 
                                                key={lang}
                                                className={`btn btn-sm ${selectedLanguage=== lang ? 'btn-primary' : 'btn-ghost'}`}
                                                onClick={() => handleLanguageChange(lang)}
                                            >{lang=== 'cpp' ? 'C++' : lang==='javascript' ? 'Javascript' : 'Java'}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <Editor
                                        height='100%'
                                        language={getLanguageForMonaco(selectedLanguage)}
                                        value={code}
                                        onChange={handleEditorChange}
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
                                    <button className="btn btn-ghost">Console</button>
                                    <button className="btn btn-ghost">Run</button>
                                    <button className="btn btn-ghost">Submit</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>   
        </div>
    )
}
export default Problem;