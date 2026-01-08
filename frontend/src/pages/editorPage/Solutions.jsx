export default function Solutions({problem}) {
    return (
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
    )
}