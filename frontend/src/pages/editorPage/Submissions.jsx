import { useState } from "react"

export default function Submissions({submissionHistory}) {
    const [viewCode, setViewCode] = useState(false)
    let [showCode, setShowCode] = useState('')
    const getSubmittedCode = (data) => {
        const update = data.replace('/\n/g', '\n')
        setViewCode(true)
        setShowCode(update)
    }
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">My Submissions</h2>
            <div className=" p-3 rounded-2xl">
                {!viewCode ? (<div className="flex justify-between text-warning w-full bg-neutral-800 p-1">
                    <p>No</p>
                    <h3>Status</h3>
                    <h3>Language</h3>
                    <h3>Runtime</h3>
                    <h3>Memory</h3>
                    <p>Code</p>
                </div>
                ) : (
                    <div className="text-accent flex justify-between">
                        <h2>Submitted Code</h2>
                        <button onClick={() => setViewCode(false)} className="btn btn-accent">x</button>
                    </div>
                )}
                {!viewCode ? (
                    submissionHistory?.map((data, i) => (
                        <div key={i} className={`flex justify-between items-center w-full bg-neutral-800 p-1 text-accent`}>

                            <p>{i + 1}</p>
                            <h3>{data?.status}</h3>
                            <h3>{data?.language}</h3>
                            <h3>{data?.runtime + ' s'}</h3>
                            <h3>{data?.memory + ' kb'}</h3>
                            <button className="btn" onClick={() => getSubmittedCode(data?.code)}>View</button>
                        </div>

                    ))
                ) : (
                    <div className="bg-neutral-950 p-2 scrollbar-hidden ">
                        <pre className="whitespace-pre-wrap">{showCode}</pre>
                    </div>
                )}
            </div>
        </div>
    )
}