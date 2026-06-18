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
            color: '#10B981',
            route: '/admin/create',
            btnLabel: 'Deploy'
        },
        {
            id: 'update',
            description: 'Update existing problem',
            icon: <FiEdit2 />,
            color: '#F59E0B',
            route: '/admin/update',
            btnLabel: 'Modify'
        },
        {
            id: 'delete',
            description: 'Remove DSA problem',
            icon: <MdDeleteOutline />,
            color: '#EF4444',
            route: '/admin/delete',
            btnLabel: 'Delete'
        },
        {
            id: 'video',
            description: 'Upload video solution',
            icon: <IoVideocamOutline />,
            color: '#8B5CF6',
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


                    <m.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden bg-[#120505] border border-[#EF4444]/20 p-8 rounded-3xl shadow-2xl mb-10"
                    >

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

                                </div>
                            </div>
                        </div>
                    </m.div>


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


                                    <h2 className="text-xl font-bold text-white group-hover:text-[#EF4444] transition-colors">
                                        {option.description}
                                    </h2>


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
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-center"
                    >

                    </m.div>
                </div>
            </div>
        </LazyMotion>
    );
}

export default AdminPanel;