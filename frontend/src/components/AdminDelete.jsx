import { useEffect, useState } from "react"
import axiosClient from "../utils/axiosClient"
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion"
import { Trash2, AlertTriangle, ShieldAlert, Search } from "lucide-react"

export default function AdminDelete() {
    const [allProblem, setAllProblem] = useState([])
    const [deletingId, setDeletingId] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const getAllProblem = async () => {
            try {
                const { data } = await axiosClient.get('/problem/getAllProblem')
                setAllProblem(data);
            } catch (err) {
                console.error('Error fetching problems:', err);
            }
        }
        getAllProblem();
    }, [])

    const handleDelete = async (problem) => {
        const problemId = problem._id
        if (!window.confirm(`Are you sure you want to purge "${problem.title}"?`)) return;

        try {
            setDeletingId(problemId)
            await axiosClient.delete(`/problem/delete/${problemId}`)
            // FIX: Update state so the UI reflects the deletion
            setAllProblem((prev) => prev.filter((p) => p._id !== problemId))
            setDeletingId(null)
        } catch (err) {
            console.log(err.message)
            setDeletingId(null)
        }
    }

    const filteredProblems = allProblem?.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <LazyMotion features={domAnimation}>
            <div className="min-h-screen p-8 bg-[#0A0A0B] text-slate-200">
                <div className="max-w-5xl mx-auto">
                    <m.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#120505] border border-rose-500/20 rounded-3xl p-8 mb-10 flex items-center justify-between overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <ShieldAlert size={120} className="text-rose-600" />
                        </div>
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/30">
                                <Trash2 className="w-10 h-10 text-rose-500" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Delete <span className="text-rose-500">Repository</span></h1>
                            </div>
                        </div>
                    </m.div>
                    <div className="relative mb-8 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-rose-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Identify target problem by title..."
                            className="w-full bg-[#121212] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500/40 transition-all placeholder:text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredProblems?.map((problem) => (
                                <m.div 
                                    layout
                                    key={problem._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                                    className="group bg-[#121212] border border-white/5 hover:border-rose-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300"
                                >
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">{problem?.title}</h2>
                                        <div className="flex gap-2">
                                            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDifficultyStyle(problem.difficulty)}`}>
                                                {problem?.difficulty}
                                            </span>
                                            {Array.isArray(problem?.tags) ? (
                                                problem.tags.map((t, i) => (
                                                    <span key={i} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-[10px] text-slate-500 font-mono uppercase">{t}</span>
                                                ))
                                            ) : (
                                                <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-[10px] text-slate-500 font-mono uppercase">{problem?.tags}</span>
                                            )}
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => handleDelete(problem)} 
                                        disabled={deletingId === problem._id} 
                                        className={`btn border-none rounded-xl w-40 font-black text-xs uppercase tracking-widest shadow-lg transition-all 
                                            ${deletingId === problem._id 
                                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                                : 'bg-red-500 hover:bg-red-700 text-white shadow-rose-900/20 active:scale-95'}`}
                                    >
                                        {deletingId === problem._id ? (
                                            <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div> Purging</span>
                                        ) : 'Delete Problem'}
                                    </button>
                                </m.div>
                            ))}
                        </AnimatePresence>

                        {filteredProblems?.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                                <AlertTriangle className="mx-auto text-slate-800 mb-4" size={48} />
                                <p className="text-slate-600 font-mono uppercase text-sm tracking-widest">No target problems identified</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LazyMotion>
    )
}

const getDifficultyStyle = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
        case 'easy': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
        case 'medium': return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
        case 'hard': return 'text-rose-500 border-rose-500/20 bg-rose-500/5';
        default: return 'text-slate-400 border-slate-400/20 bg-slate-400/5';
    }
};
