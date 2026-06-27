import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Standard react-router-dom
import axiosClient from '../utils/axiosClient';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { Edit3, Search, Filter, Hash, Zap, AlertCircle } from 'lucide-react';

export default function AdminUpdate() {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Added search for better UX
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    }
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const searchMatch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());

    return difficultyMatch && tagMatch && searchMatch;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className='min-h-screen p-8 bg-[#0A0A0B] text-slate-200 selection:bg-amber-500/30'>
        <div className="max-w-5xl mx-auto">
          <m.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <Edit3 className="text-amber-500 w-8 h-8" />
            </div>
            <div>
              <h1 className='text-4xl font-black text-white tracking-tighter uppercase'>
                Modify <span className="text-amber-500">Problem</span>
              </h1>
            </div>
          </m.div>

          <m.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#141415]/60 backdrop-blur-md border border-white/5 p-4 rounded-2xl mb-8 flex flex-wrap gap-4 items-center shadow-2xl"
          >
            <div className="relative grow min-w-62.5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                type="text" 
                placeholder="Search by title..."
                className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-amber-500/40 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500/50" />
                <select 
                  name="difficulty" 
                  onChange={handleFilterChange}
                  className="bg-[#1A0A0A] border border-white/5 text-slate-300 text-sm rounded-xl pl-10 pr-4 py-3 cursor-pointer hover:border-[#EF4444]/30 focus:outline-none focus:border-[#EF4444]/50 appearance-none transition-all"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500/50" />
                <select 
                  name="tag" 
                  onChange={handleFilterChange}
                  className="bg-[#1A0A0A] border border-white/5 text-slate-300 text-sm rounded-xl pl-10 pr-4 py-3 cursor-pointer hover:border-[#EF4444]/30 focus:outline-none focus:border-[#EF4444]/50 appearance-none transition-all"
                >
                  <option value="all">All Tags</option>
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </m.div>


          <div className="grid gap-3">
              {filteredProblems.map((problem) => (
                <div 
                  key={problem._id} 
                  className="group bg-[#121212] border border-white/5 hover:border-amber-500/30 rounded-2xl p-5 transition-all duration-300 shadow-lg flex items-center justify-between"
                >
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">
                      {problem.title}
                    </h2>
                    <div className="flex gap-2">
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getDifficultyStyle(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      <span className="bg-white/5 border border-white/10 px-3 py-0.5 rounded-full text-[10px] text-slate-500 font-mono">
                        {problem.tags}
                      </span>
                    </div>
                  </div>

                  <NavLink to={`/admin/update/${problem._id}`}>
                    <m.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className='bg-amber-500 hover:bg-amber-600 text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 transition-all'
                    >
                      Update
                    </m.button>
                  </NavLink>
                </div>
              ))}
            </div>
       

          {filteredProblems.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
              <AlertCircle className="mx-auto text-slate-700 mb-4" size={40} />
              <p className="text-slate-600 font-mono text-sm">No records matching the current filter set.</p>
            </div>
          )}
        </div>
      </div>
    </LazyMotion>
  )
}

const getDifficultyStyle = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
    case 'medium': return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
    case 'hard': return 'text-rose-500 border-rose-500/20 bg-rose-500/5';
    default: return 'text-slate-400 border-slate-400/20 bg-slate-400/5';
  }
};