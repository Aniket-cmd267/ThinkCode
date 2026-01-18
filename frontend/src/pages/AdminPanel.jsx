
// import React, { useEffect } from "react";
// import { useState } from "react";
// import { useNavigate } from "react-router";
// import { IoAdd } from "react-icons/io5";
// import { MdDelete } from "react-icons/md";
// import { FiEdit2 } from "react-icons/fi";
// import { Link } from "react-router";

// function AdminPanel() {
//     const navigate= useNavigate();
//     const adminOptions = [
//         {
//             id: 'create',
//             description: 'Create a DSA problem',
//             bgColor: 'bg-neutral',
//             route: '/admin/create',
//             btn: 'btn-success'
//         },
//         {
//             id: 'update',
//             description: 'Update problem',
//             bgColor: 'bg-neutral',
//             route: '/admin/update',
//             btn: 'btn-warning'
//         },
//         {
//             id: 'delete',
//             description: 'Delete problem',
//             bgColor: 'bg-neutral',
//             route: '/admin/delete',
//             btn: 'btn-error'
//         },
//         {
//             id: 'video',
//             description: 'Upload video solution',
//             bgColor: 'bg-neutral',
//             btn: 'btn-secondary',
//             route: '/admin/video'
//         }
//     ]

//     function handleClick(option){
//         navigate(`${option.route}`)
//     }
//     return (
//         <div className="min-h-screen p-8 bg-neutral-900">
//             <div className="max-w-6xl mx-auto">
//                 <div className="hero bg-neutral p-6 rounded-lg shadow-sm mb-6">
//                     <div className="hero-content">
//                         <div>
//                             <h1 className="text-3xl font-bold">Admin Panel</h1>
//                             <p className="py-2 text-sm opacity-70">Manage problems: create, update or delete DSA problems from this panel.</p>
//                         </div>
//                         <div className="ml-auto hidden md:block">
//                             <div className="badge badge-lg badge-primary">Admin</div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
//                     {adminOptions.map((option) => (
//                         <div
//                             key={option.id}
//                             role="button"
//                             onClick={() => handleClick(option)}
//                             className={`card ${option.bgColor} shadow hover:shadow-lg transition-all duration-150 cursor-pointer`}
//                         >
//                             <div className="card-body">
//                                 <div className="flex items-start gap-4">
//                                     <div className="text-3xl">{option.id === 'create' ? <IoAdd /> : option.id === 'update' ? <FiEdit2 /> : <MdDelete />}</div>
//                                     <div className="flex-1">
//                                         <h2 className="card-title">{option.description}</h2>
//                                         <p className="text-sm opacity-70">Quick action: {option.id}</p>
//                                     </div>
//                                     <div className="self-start">
//                                         <button className={`btn ${option.btn} btn-sm`}>{option.id}</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AdminPanel;

import React from "react";
import { useNavigate } from "react-router";
import { IoAdd, IoVideocamOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Terminal, ShieldCheck, Activity } from "lucide-react";

function AdminPanel() {
    const navigate = useNavigate();
    
    const adminOptions = [
        {
            id: 'create',
            description: 'Create a DSA problem',
            icon: <IoAdd />,
            color: '#10B981', // Emerald for success/creation
            route: '/admin/create',
            btnLabel: 'Deploy'
        },
        {
            id: 'update',
            description: 'Update existing problem',
            icon: <FiEdit2 />,
            color: '#F59E0B', // Amber for warnings/updates
            route: '/admin/update',
            btnLabel: 'Modify'
        },
        {
            id: 'delete',
            description: 'Remove DSA problem',
            icon: <MdDeleteOutline />,
            color: '#EF4444', // Crimson for destructive actions
            route: '/admin/delete',
            btnLabel: 'Purge'
        },
        {
            id: 'video',
            description: 'Upload video solution',
            icon: <IoVideocamOutline />,
            color: '#8B5CF6', // Violet for secondary features
            route: '/admin/video',
            btnLabel: 'Stream'
        }
    ];

    const handleClick = (option) => {
        navigate(option.route);
    };

    return (
        <LazyMotion features={domAnimation}>
            <div className="min-h-screen bg-[#0A0A0A] text-slate-200 p-8 selection:bg-[#EF4444]/30">
                <div className="max-w-6xl mx-auto">
                    
                    {/* COMMAND CENTER HEADER */}
                    <m.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden bg-[#120505] border border-[#EF4444]/20 p-8 rounded-3xl shadow-2xl mb-10"
                    >
                        {/* Decorative background grid */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-[#EF4444]/10 rounded-2xl border border-[#EF4444]/30">
                                    <ShieldCheck className="w-10 h-10 text-[#EF4444]" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black text-white tracking-tighter">
                                        SYSTEM <span className="text-[#EF4444]">ADMIN</span>
                                    </h1>
                                    <p className="text-slate-500 font-mono text-sm mt-1 uppercase tracking-widest">
                                        ThinkCode Core // Problem Management
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                                <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold tracking-tighter">
                                    Auth Level: Level 1 Admin
                                </span>
                            </div>
                        </div>
                    </m.div>

                    {/* ACTION GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {adminOptions.map((option, index) => (
                            <m.div
                                key={option.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleClick(option)}
                                className="group relative cursor-pointer bg-[#121212] border border-white/5 hover:border-[#EF4444]/30 rounded-3xl p-6 transition-all shadow-xl overflow-hidden"
                            >
                                {/* Hover Glow Effect */}
                                <div 
                                    className="absolute -right-10 -top-10 w-40 h-40 opacity-0 group-hover:opacity-10 transition-opacity blur-3xl rounded-full"
                                    style={{ backgroundColor: option.color }}
                                />

                                <div className="flex items-center gap-6">
                                    <div 
                                        className="text-4xl p-5 rounded-2xl transition-all"
                                        style={{ 
                                            backgroundColor: `${option.color}10`, 
                                            color: option.color,
                                            border: `1px solid ${option.color}30`
                                        }}
                                    >
                                        {option.icon}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-white group-hover:text-[#EF4444] transition-colors">
                                            {option.description}
                                        </h2>
                                        <p className="text-xs font-mono text-slate-500 uppercase mt-1 tracking-widest">
                                            Process: {option.id}_op
                                        </p>
                                    </div>

                                    <div className="hidden sm:block">
                                        <button 
                                            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all"
                                            style={{ 
                                                borderColor: `${option.color}40`,
                                                color: option.color
                                            }}
                                        >
                                            {option.btnLabel}
                                        </button>
                                    </div>
                                </div>
                            </m.div>
                        ))}
                    </div>

                    {/* FOOTER STATS */}
                    <m.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center"
                    >
                        {/* <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.4em]">
                            System V1.0.2 // thinkcode.admin.sh
                        </p> */}
                    </m.div>
                </div>
            </div>
        </LazyMotion>
    );
}

export default AdminPanel;