import React from 'react';
import { useSelector } from 'react-redux';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { 
     Globe, MapPin, 
  Award, Calendar, CheckCircle, TrendingUp 
} from 'lucide-react';

export default function Profile() {
  const { user } = useSelector((state) => state.slice1);

  const stats = {
    solved: 142,
    total: 850,
    easy: 80,
    medium: 50,
    hard: 12,
    rank: "12,405",
    streak: 14
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#0A0A0A] text-slate-200 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR - IDENTITY */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <m.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#120505] border border-white/5 rounded-3xl p-6 shadow-2xl sticky top-24"
            >
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 bg-linear-to-tr from-[#EF4444] to-[#F87171] rounded-3xl rotate-6 opacity-20" />
                <div className="relative w-full h-full bg-[#1A1A1A] border-2 border-[#EF4444]/30 rounded-3xl flex items-center justify-center overflow-hidden">
                  <span className="text-4xl font-black text-white">{user?.firstName?.charAt(0)}</span>
                </div>
              </div>

              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">{user?.firstName} {user?.lastName}</h1>
                <p className="text-slate-500 font-mono text-sm">@{user?.firstName?.toLowerCase()}_dev</p>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-[#EF4444]/20">
                  Edit Profile
                </button>
                
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center gap-3 text-slate-400 text-sm hover:text-[#EF4444] cursor-pointer transition-colors">
                    <MapPin size={16} /> <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm hover:text-[#EF4444] cursor-pointer transition-colors">
                    {/* <Github size={16} /> <span>github.com/{user?.firstName?.toLowerCase()}</span> */}
                  </div>
                </div>
              </div>
            </m.div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            
            {/* TOP ROW - PROGRESS GAUGE & QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <m.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="col-span-1 md:col-span-2 bg-[#120505] border border-white/5 rounded-3xl p-8 flex items-center justify-between shadow-xl"
              >
                <div className="relative w-40 h-40">
                  {/* Circular Progress (Simplified SVG) */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * (stats.solved / stats.total))} className="text-[#EF4444] transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{stats.solved}</span>
                    <span className="text-[10px] uppercase text-slate-500 font-bold">Solved</span>
                  </div>
                </div>

                <div className="space-y-4 flex-grow ml-12">
                   <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold uppercase mb-1"><span className="text-emerald-400">Easy</span><span className="text-slate-400">{stats.easy}/300</span></div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[26%]" /></div>
                   </div>
                   <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold uppercase mb-1"><span className="text-amber-400">Medium</span><span className="text-slate-400">{stats.medium}/400</span></div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-500 h-full w-[12%]" /></div>
                   </div>
                   <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold uppercase mb-1"><span className="text-rose-500">Hard</span><span className="text-slate-400">{stats.hard}/150</span></div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-rose-500 h-full w-[8%]" /></div>
                   </div>
                </div>
              </m.div>

              <div className="grid grid-rows-2 gap-6">
                <m.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-[#120505] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-2xl"><Award className="text-amber-500" /></div>
                  <div><p className="text-xs font-bold text-slate-500 uppercase">Global Rank</p><p className="text-xl font-black text-white">#{stats.rank}</p></div>
                </m.div>
                <m.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-[#120505] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
                  <div className="p-3 bg-[#EF4444]/10 rounded-2xl"><TrendingUp className="text-[#EF4444]" /></div>
                  <div><p className="text-xs font-bold text-slate-500 uppercase">Streak</p><p className="text-xl font-black text-white">{stats.streak} Days 🔥</p></div>
                </m.div>
              </div>
            </div>

            {/* MIDDLE ROW - HEATMAP PLACEHOLDER */}
            <m.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-[#120505] border border-white/5 rounded-3xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold flex items-center gap-2"><Calendar size={18} className="text-[#EF4444]" /> Submission Activity</h3>
                <span className="text-xs text-slate-500 font-mono">Total Submissions: 482</span>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {/* Mock Heatmap Nodes */}
                {[...Array(112)].map((_, i) => (
                  <div key={i} className={`w-3.5 h-3.5 rounded-[2px] ${i % 7 === 0 ? 'bg-[#EF4444]' : i % 5 === 0 ? 'bg-[#EF4444]/60' : i % 3 === 0 ? 'bg-[#EF4444]/30' : 'bg-white/5'}`} />
                ))}
              </div>
            </m.div>

            {/* BOTTOM ROW - RECENT ACTIVITY */}
            <m.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-[#120505] border border-white/5 rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2 text-white"><CheckCircle size={18} className="text-emerald-500" /> Recent Submissions</h3>
                <button className="text-xs font-bold text-[#EF4444] hover:underline">View All</button>
              </div>
              <div className="divide-y divide-white/5">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-5 flex items-center justify-between hover:bg-white/2 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <p className="text-sm font-bold text-white">Two Sum II - Input Array Is Sorted</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">Jan 18, 2026 20:34</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-emerald-400">Accepted</p>
                      <p className="text-[10px] text-slate-600">Runtime: 52ms</p>
                    </div>
                  </div>
                ))}
              </div>
            </m.div>

          </div>
        </div>
      </div>
    </LazyMotion>
  );
}