import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';

// function Homepage() {
//   const navigate= useNavigate();

//   const {user} = useSelector((state) => state.slice1)
//   // const handleLogout= () =>{
//   //   dispatch(logoutUser());
//   // }
//   const [problems, setProblems] = useState([]);
//   const [solvedProblems, setSolvedProblems] = useState([]);
//   const [search, setSearch]= useState('')
//   const [filters, setFilters] = useState({
//     difficulty: 'all',
//     tag: 'all',
//     status: 'all' 
//   });
//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         const { data } = await axiosClient.get('/problem/getAllProblem');
//         setProblems(data);
//       } catch (error) {
//         console.error('Error fetching problems:', error);
//       }
//     };

//     const fetchSolvedProblems = async () => {
//       try {
//         const { data } = await axiosClient.get('/problem/problemSolvedByUser');
//         setSolvedProblems(data);
//       } catch (error) {
//         console.error('Error fetching solved problems:', error);
//       }
//     };

//     fetchProblems();
//     if (user) fetchSolvedProblems();
//   }, [user]);

//   const filteredProblems = problems.filter(problem => {
//     const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
//     const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
//     const statusMatch = filters.status === 'all' || solvedProblems.some(sp => sp._id === problem._id);
//     const searchProblem= problem.title.toLowerCase().includes(search)
//     return difficultyMatch && tagMatch && statusMatch && searchProblem;
//   });
//   function handleChange(e){
//     console.log(e)
//     const {name, value}= e.target
//     setFilters((prev) =>({
//       ...prev,
//       [name] : value
//     }))
//   }
//   function handleSearch(e){
//     setSearch(e.target.value)
//   }
//   return (
//     <div className="min-h-screen bg-base-200">
//       <div className="p-6">
//         <div className="flex flex-wrap items-center gap-4">
//           <div className="form-control">
//             <label className="label hidden">Problem set</label>
//             <select className="select select-bordered w-48" value={filters.status} onChange={handleChange} name='status'>
//               <option value='all'>All Problems</option>
//               <option value='solved problems'>Solved Problems</option>
//             </select>
//           </div>

//           <div className="form-control">
//             <label className="label hidden">Difficulty</label>
//             <select className="select select-bordered w-40" onChange={handleChange} value={filters.difficulty} name='difficulty'>
//               <option value='all'>All Difficulties</option>
//               <option value='easy'>Easy</option>
//               <option value='medium'>Medium</option>
//               <option value='hard'>Hard</option>
//             </select>
//           </div>

//           <div className="form-control">
//             <label className="label hidden">Tags</label>
//             <select className="select select-bordered w-56" onChange={handleChange} value={filters.tag} name='tag'>
//               <option value='all'>All tags</option>
//               <option value='array'>Array</option>
//               <option value='linkedlist'>LinkedList</option>
//               <option value='trees'>Trees</option>
//               <option value='string'>String</option>
//               <option value='graph'>Graph</option>
//             </select>
//           </div>

//           <div className="form-control">
//             <label className="label hidden">Search</label>
//             <input type="text" placeholder="Search problems..." className="input input-bordered w-64" value={search} onChange={handleSearch}/>
//           </div>
// {/* 
//           <div className="flex items-center gap-2">
//             <button className="btn btn-primary">Apply</button>
//             <button className="btn btn-ghost">Reset</button>
//           </div> */}
//         </div>
//       </div>

//       <div className="grid gap-4">
//           {filteredProblems.map(problem => (
//             <div key={problem._id} className="card bg-base-100 shadow-xl">
//               <div className="card-body">
//                 <div className="flex items-center justify-between">
//                   <h2 className="card-title">
//                     <NavLink to={`/problem/${problem._id}`} className="hover:text-primary">
//                       {problem.title}
//                     </NavLink>
//                   </h2>
//                   {solvedProblems.some(sp => sp._id === problem._id) && (
//                     <div className="badge badge-success gap-2">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                       Solved
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex gap-2">
//                   <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
//                     {problem.difficulty}
//                   </div>
//                   <div className="badge badge-info">
//                     {problem.tags}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//     </div>
//   );
// }

// const getDifficultyBadgeColor = (difficulty) => {
//   switch (difficulty.toLowerCase()) {
//     case 'easy': return 'badge-success';
//     case 'medium': return 'badge-warning';
//     case 'hard': return 'badge-error';
//     default: return 'badge-neutral';
//   }
// };
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
// import { useSelector } from 'react-redux';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { Search, Filter, Hash, Zap, CheckCircle, Flame } from 'lucide-react';
// import axiosClient from '../utils/axiosClient';

function Homepage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.slice1);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || solvedProblems.some(sp => sp._id === problem._id);
    const searchProblem = problem.title.toLowerCase().includes(search.toLowerCase());
    return difficultyMatch && tagMatch && statusMatch && searchProblem;
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gradient-to-br from-[#261212] via-[#120505] to-[#000000] pb-20">
        
        {/* TOP BACKGROUND GRADIENT (Matches your Landing Page) */}
        <div className="absolute top-0 left-0 w-full h-125 bg-linear-to-b from-[#1A0A0A] to-transparent pointer-events-none opacity-60" />

        <div className="max-w-7xl mx-auto p-6 relative z-10">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-2 tracking-tighter">
                <Flame className="text-[#EF4444] fill-[#EF4444]" />
                SOLVE
              </h1>
              {/* <p className="text-slate-500 text-sm font-mono mt-1">Status: Online // Connection: Secure</p> */}
            </div>
          </div>

          {/* INTERACTIVE FILTER BAR */}
          <m.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#120505]/60 backdrop-blur-md border border-[#EF4444]/10 rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-4 shadow-xl"
          >
            <div className="relative group grow min-w-70">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#EF4444] transition-colors" />
              <input 
                type="text" 
                placeholder="Search problem index..." 
                className="w-full bg-[#1A0A0A] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#EF4444]/40 transition-all placeholder:text-slate-600" 
                value={search} 
                onChange={handleSearch}
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
               {/* CUSTOM DROPDOWN STYLE */}
               {[
                 { name: 'status', icon: Filter, options: [['all', 'All Problems'], ['solved problems', 'Solved Only']] },
                 { name: 'difficulty', icon: Zap, options: [['all', 'Any Difficulty'], ['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']] },
                 { name: 'tag', icon: Hash, options: [['all', 'All Tags'], ['array', 'Array'], ['linkedlist', 'Linked List'], ['trees', 'Trees'], ['string', 'String'], ['graph', 'Graph']] }
               ].map((drop) => (
                 <div key={drop.name} className="relative">
                   <drop.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#EF4444]/50 pointer-events-none" />
                   <select 
                     name={drop.name}
                     value={filters[drop.name]}
                     onChange={handleChange}
                     className="bg-[#1A0A0A] border border-white/5 text-slate-300 text-sm rounded-xl pl-10 pr-4 py-3 cursor-pointer hover:border-[#EF4444]/30 focus:outline-none focus:border-[#EF4444]/50 appearance-none transition-all"
                   >
                     {drop.options.map(([val, label]) => (
                       <option key={val} value={val}>{label}</option>
                     ))}
                   </select>
                 </div>
               ))}
            </div>
          </m.div>

          {/* PROBLEM CARDS GRID */}
          <m.div 
            layout
            className="grid gap-3"
          >
            <AnimatePresence mode='popLayout'>
              {filteredProblems.map((problem, index) => (
                <m.div 
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: index * 0.03 } }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={problem._id} 
                  className="group bg-[#121212] hover:bg-[#1A0A0A] border border-white/[0.03] hover:border-[#EF4444]/30 rounded-xl p-5 transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        {solvedProblems.some(sp => sp._id === problem._id) && (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        )}
                        <h2 className="text-lg font-bold text-white group-hover:text-[#EF4444] transition-colors">
                          <NavLink to={`/problem/${problem._id}`}>
                            {problem.title}
                          </NavLink>
                        </h2>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getDifficultyStyle(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        <span className="bg-white/5 border border-white/10 px-3 py-0.5 rounded-full text-[10px] text-slate-400 font-medium">
                          {problem.tags}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <NavLink 
                        to={`/problem/${problem._id}`}
                        className="opacity-0 group-hover:opacity-100 bg-[#EF4444] text-white px-5 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 active:scale-95"
                      >
                        SOLVE
                      </NavLink>
                    </div>
                  </div>
                </m.div>
              ))}
            </AnimatePresence>

            {filteredProblems.length === 0 && (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                <p className="text-slate-600 font-mono">No matching problems found in the database.</p>
              </div>
            )}
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
}

// STYLING HELPER
const getDifficultyStyle = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
    case 'medium': return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
    case 'hard': return 'text-[#EF4444] border-[#EF4444]/20 bg-[#EF4444]/5';
    default: return 'text-slate-400 border-slate-400/20 bg-slate-400/5';
  }
};
export default Homepage;