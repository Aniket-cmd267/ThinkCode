import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useParams } from "react-router";

function Problem(){
    const [activeLeftTab, setActiveLeftTab]= useState('description');
    const [problem, setProblem] = useState(null);
    const [loading,setLoading]= useState(false);
    const [code, setCode]= useState('');
    let {problemId}= useParams;
    useEffect(() => {
        const fetchProblem= async() =>{
            setLoading(true);
        try{
                console.log('Hello world')
                const response= await axiosClient.get(`/problem/problemById/${problemId}`);
                console.log('Hello world')
                const initialCode= response.data.startCode.find((sc) =>{
                    if(sc.language== 'C++' &&  selectedLanguage=='cpp')
                        return true;
                    else if(sc.language=='Java' && selectedLanguage== 'java')
                        return true;
                    else if(sc.language== 'Javascript' && selectedLanguage== 'javascript')
                        return true;
                return false;

            })?.initialCode || 'Hello';
            setProblem(response.data);
            setCode(initialCode)
            setLoading(false);
            }catch(err){
                console.error('Error fetching problem: ',err);
                setLoading(false)
            }
        }
    fetchProblem();

    },[problemId]);
    return (
        <div className="h-screen flex bg-base-100">
            <div className="w-1/2 flex flex-col border-r border-base-300">
                {/* Tab section */}
                <div className="tabs tabs-bordered bg-base-200 px-4">
                    <button className={`tab ${activeLeftTab === 'description' ? 'tab-active' : ''}`} 
                        onClick={()=> setActiveLeftTab('description')}
                    >Description</button>
                    <button className={`tab ${activeLeftTab=== 'Editorial' ? 'tab-active' : ''}`}
                        onClick={()=> setActiveLeftTab('Editorial')}
                    >Editorial</button>
                    <button className={`tab ${activeLeftTab=== 'Solutions' ? 'tab-active' : ''}`}
                        onClick={()=> setActiveLeftTab('Solutions')}
                    >Solutions</button>
                    <button className={`tab ${activeLeftTab=== 'Submissions' ? 'tab-active' : ''}`}
                        onClick={()=> setActiveLeftTab('Submissions')}
                    >Submissions</button>
                </div>
                {/* COntent Section */}
                <div className="flex-1 overflow-y-auto p-6">
                    {problem && (
                        <>
                            {activeLeftTab==='description' && (
                                <div>

                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>
            
        </div>
    )
}

export default Problem;