import { useEffect,useState } from "react"
import axiosClient from "../utils/axiosClient"
import { Link } from "react-router"

export default function AdminDelete(){
    const [allProblem, setAllProblem]= useState([])
    const [Disabled,setDisabled]= useState(false)
    useEffect(() =>{
        const getAllProblem= async () =>{
            try{
                const data= await axiosClient.get('/problem/getAllProblem') // we prefer destructuring the data coz axios sends an object which contians more info than the data in object 
                            // we can see that through console.log 
                // const {data}= await axiosClient.get('/problem/getAllProblem')
                console.log(data)
                setAllProblem(data?.data);
            }
            catch(err){
                console.error('Error fetching problems:', err);
                return err.message;
            }
        }
        getAllProblem();
    },[])

    const handleClick=async (problem) =>{
        const problemId= problem._id
        try{
            setDisabled(true)
            await axiosClient.delete(`/problem/delete/${problem._id}`)
            allProblem.filter((prev) => prev._id !== problemId)
            alert('Problem deleted successfully')
        }                                
        catch(err){
            console.log(err.message)            
        }                                                          
    }
    return (
        <div className="min-h-screen p-6 bg-neutral-950 transition-colors duration-300">
            <div>
                <h1 className="text-center font-bold text-primary mb-8 drop-shadow-sm">Delete problem</h1>
                <div className="flex flex-col gap-4 bg-neutral-700 rounded-xl">
                    {
                        allProblem?.map((problem) => (
                            <div key={problem._id} className="card bg-base-100 dark:bg-base-200/5 shadow-md p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-transform duration-200 hover:scale-[1.02] hover:shadow-2xl motion-safe:transform-gpu">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <h1 className="text-lg font-semibold text-base-content">{problem?.title}</h1>
                                    <div className="flex gap-2 mt-2 sm:mt-0">
                                        <h2 className="badge badge-primary">{problem?.difficulty}</h2>
                                        {Array.isArray(problem?.tags) ? (
                                            problem.tags.map((t,i) => (
                                                <span key={i} className="badge badge-ghost">{t}</span>
                                            ))
                                        ) : (
                                            <span className="badge badge-ghost">{problem?.tags}</span>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => handleClick(problem)} disabled={Disabled} className={`btn btn-error rounded-full w-40 ${Disabled ? 'loading' : ''} transition-transform duration-150 active:scale-95`}>Delete</button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
