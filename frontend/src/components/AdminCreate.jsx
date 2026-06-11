// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import z from "zod";
// import axiosClient from "../utils/axiosClient";
// import { useNavigate } from "react-router";
// import { m, LazyMotion, domAnimation } from "framer-motion";
// import { Plus, Trash2, Terminal, Code, Database, Eye, EyeOff, Save, RotateCcw } from "lucide-react";

// // Schema stays exactly as yours
// const problemSchema = z.object({
//     title: z.string().min(1, "Title is required"),
//     description: z.string().min(1, "Description is required"),
//     difficulty: z.enum(["easy", "medium", "hard"]),
//     tags: z.enum(["array", "linkedList", "graph", "dp"]),
//     visibleTestCases: z.array(
//         z.object({
//             input: z.string().min(1, "Input is required"),
//             output: z.string().min(1, "Output is required"),
//             explanation: z.string().min(1, "Explanation is required"),
//         })
//     ).min(1, "At least one visible test case is required"),
//     hiddenTestCases: z.array(
//         z.object({
//             input: z.string().min(1, "Input is required"),
//             output: z.string().min(1, "Output is required"),
//         })
//     ).optional(),
//     startCode: z.array(
//         z.object({
//             language: z.string().min(1, "Language is required"),
//             initialCode: z.string().min(1, "Initial code is required"),
//         })
//     ).min(1, "At least one start code entry is required"),
//     referenceSolution: z.array(
//         z.object({
//             language: z.string().min(1, "Language is required"),
//             completeCode: z.string().min(1, "Complete code is required"),
//         })
//     ).min(1, "At least one reference solution is required"),
//     problemCreator: z.string().optional(),
// });

// export default function AdminCreate() {
//     const navigate = useNavigate();
//     const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
//         resolver: zodResolver(problemSchema),
//         defaultValues: {
//             title: "",
//             description: "",
//             difficulty: "easy",
//             tags: "array",
//             visibleTestCases: [{ input: "", output: "", explanation: "" }],
//             hiddenTestCases: [{ input: "", output: "" }],
//             startCode: [{ language: "javascript", initialCode: "" }],
//             referenceSolution: [{ language: "javascript", completeCode: "" }],
//             problemCreator: "",
//         },
//     });

//     // Field Arrays
//     const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: "visibleTestCases" });
//     const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: "hiddenTestCases" });
//     const { fields: startFields, append: appendStart, remove: removeStart } = useFieldArray({ control, name: "startCode" });
//     const { fields: refFields, append: appendRef, remove: removeRef } = useFieldArray({ control, name: "referenceSolution" });

//     async function onSubmit(data) {
//         try {
//             await axiosClient.post('/problem/create', data);
//             navigate('/');
//             alert('Problem deployed successfully');
//         } catch (error) {
//             alert(`Deployment Error: ${error?.response?.data?.message || error.message}`);
//         }
//     }

//     // Reuseable Input Styles
//     const inputStyle = "w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#EF4444]/50 transition-all placeholder:text-slate-700";
//     const labelStyle = "text-xs font-mono uppercase tracking-[0.2em] text-[#F87171] font-bold mb-2 block";
//     const sectionCard = "bg-[#050505] border border-white/5 rounded-3xl p-8 shadow-2xl mb-8 relative overflow-hidden";

//     return (
//         <LazyMotion features={domAnimation}>
//             <div className="p-8 bg-[#0A0A0A] min-h-screen text-slate-200 selection:bg-[#EF4444]/30">
//                 <m.div 
//                     initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//                     className="max-w-5xl mx-auto"
//                 >
//                     {/* STICKY FORM HEADER */}
//                     <div className="sticky top-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-md py-4 mb-8 border-b border-white/5 flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                             <div className="p-3 bg-[#EF4444]/10 rounded-2xl border border-[#EF4444]/20">
//                                 <Terminal className="text-[#EF4444]" />
//                             </div>
//                             <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Construct <span className="text-[#EF4444]">Problem</span></h1>
//                         </div>
//                         <div className="flex gap-3">
//                             <button onClick={() => reset()} className="btn btn-ghost border-white/5 text-slate-400 hover:text-white flex items-center gap-2">
//                                 <RotateCcw size={16} /> Reset
//                             </button>
//                             <button onClick={handleSubmit(onSubmit)} className="bg-[#dd0d0d] hover:bg-[#DC2626] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#EF4444]/20 transition-all active:scale-95">
//                                 <Save size={18} /> Deploy Problem
//                             </button>
//                         </div>
//                     </div>

//                     <form className="pb-20">
//                         {/* SECTION 1: CORE DETAILS */}
//                         <div className={sectionCard}>
//                             <div className="absolute top-0 right-0 p-4 opacity-5"><Database size={80} /></div>
//                             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 underline underline-offset-8 decoration-[#EF4444]/30">
//                                 <span className="text-[#EF4444]">01.</span> Core Metadata
//                             </h3>
//                             <div className="space-y-6">
//                                 <div>
//                                     <label className={labelStyle}>Problem Title</label>
//                                     <input className={inputStyle} {...register("title")} placeholder="e.g., Two Sum Matrix" />
//                                     {errors.title && <p className="text-xs text-[#EF4444] mt-2">{errors.title.message}</p>}
//                                 </div>
//                                 <div>
//                                     <label className={labelStyle}>Technical Description</label>
//                                     <textarea className={`${inputStyle} h-48 resize-none`} {...register("description")} placeholder="Describe the constraints, inputs, and algorithmic requirements..." />
//                                     {errors.description && <p className="text-xs text-[#EF4444] mt-2">{errors.description.message}</p>}
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div>
//                                         <label className={labelStyle}>Difficulty Level</label>
//                                         <select className={inputStyle} {...register("difficulty")}>
//                                             <option value="easy">Easy (Lvl 1)</option>
//                                             <option value="medium">Medium (Lvl 2)</option>
//                                             <option value="hard">Hard (Lvl 3)</option>
//                                         </select>
//                                     </div>
//                                     <div>
//                                         <label className={labelStyle}>Primary Tag</label>
//                                         <select className={inputStyle} {...register("tags")}>
//                                             <option value="array">Array</option>
//                                             <option value="linkedList">Linked List</option>
//                                             <option value="graph">Graph</option>
//                                             <option value="dp">Dynamic Programming</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* SECTION 2: TEST CASES (VISIBLE) */}
//                         <div className={sectionCard}>
//                             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 underline underline-offset-8 decoration-[#EF4444]/30">
//                                 <span className="text-[#EF4444]">02.</span> Public Test Cases
//                             </h3>
//                             <div className="space-y-4">
//                                 {visibleFields.map((field, i) => (
//                                     <m.div layout key={field.id} className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4 relative group">
//                                         <button type="button" onClick={() => removeVisible(i)} className="absolute top-4 right-4 text-slate-600 hover:text-[#EF4444] transition-colors">
//                                             <Trash2 size={16} />
//                                         </button>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <div>
//                                                 <label className={labelStyle}>Input</label>
//                                                 <input className={inputStyle} {...register(`visibleTestCases.${i}.input`)} />
//                                             </div>
//                                             <div>
//                                                 <label className={labelStyle}>Output</label>
//                                                 <input className={inputStyle} {...register(`visibleTestCases.${i}.output`)} />
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <label className={labelStyle}>Explanation</label>
//                                             <input className={inputStyle} {...register(`visibleTestCases.${i}.explanation`)} placeholder="Why is this the output?" />
//                                         </div>
//                                     </m.div>
//                                 ))}
//                                 <button type="button" onClick={() => appendVisible({ input: "", output: "", explanation: "" })} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 hover:text-[#EF4444] hover:border-[#EF4444]/30 transition-all flex items-center justify-center gap-2 font-mono text-xs uppercase">
//                                     <Plus size={16} /> Add Public Test Case
//                                 </button>
//                             </div>
//                         </div>

//                         {/* SECTION 3: CODE TEMPLATES */}
//                         <div className={sectionCard}>
//                             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 underline underline-offset-8 decoration-[#EF4444]/30">
//                                 <span className="text-[#e73939]">03.</span> Runtime Configurations
//                             </h3>
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                                 {/* Start Code */}
//                                 <div className="space-y-4">
//                                     <p className="text-sm font-bold text-white flex items-center gap-2"><Code size={16} className="text-[#EF4444]" /> Start Code Template</p>
//                                     {startFields.map((field, i) => (
//                                         <div key={field.id} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
//                                             <input className={inputStyle} placeholder="Language (e.g. javascript)" {...register(`startCode.${i}.language`)} />
//                                             <textarea className={`${inputStyle} h-32 font-mono text-sm`} placeholder="Initial code function..." {...register(`startCode.${i}.initialCode`)} />
//                                             <button type="button" onClick={() => removeStart(i)} className="text-[10px] font-bold uppercase text-slate-600 hover:text-[#EF4444]">Remove Entry</button>
//                                         </div>
//                                     ))}
//                                     <button type="button" onClick={() => appendStart({ language: "javascript", initialCode: "" })} className="text-xs text-[#EF4444] font-bold hover:underline">+ Add Language Support</button>
//                                 </div>

//                                 {/* Reference Solution */}
//                                 <div className="space-y-4">
//                                     <p className="text-sm font-bold text-white flex items-center gap-2"><Eye size={16} className="text-emerald-500" /> Reference Solution</p>
//                                     {refFields.map((field, i) => (
//                                         <div key={field.id} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
//                                             <input className={inputStyle} placeholder="Language" {...register(`referenceSolution.${i}.language`)} />
//                                             <textarea className={`${inputStyle} h-32 font-mono text-sm border-emerald-500/10 focus:border-emerald-500/50`} placeholder="Correct solution code..." {...register(`referenceSolution.${i}.completeCode`)} />
//                                             <button type="button" onClick={() => removeRef(i)} className="text-[10px] font-bold uppercase text-slate-600 hover:text-emerald-500">Remove Entry</button>
//                                         </div>
//                                     ))}
//                                     <button type="button" onClick={() => appendRef({ language: "javascript", completeCode: "" })} className="text-xs text-emerald-500 font-bold hover:underline">+ Add Solution Template</button>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* FINAL CREDITS */}
//                         <div className="bg-[#050505] p-6 rounded-3xl border border-white/5 flex items-center gap-6">
//                             <div className="grow">
//                                 <label className={labelStyle}>Problem Originator (ID)</label>
//                                 <input className={inputStyle} {...register("problemCreator")} placeholder="User UUID or Handle" />
//                             </div>
//                         </div>
//                     </form>
//                 </m.div>
//             </div>
//         </LazyMotion>
//     );
// }

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { Plus, Trash2, Terminal, Code, Database, Eye, Save, RotateCcw, Layers } from "lucide-react";

const problemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    tags: z.enum(["array", "string", "tree", "linkedList", "graph", "dp"]),
    visibleTestCases: z.array(
        z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional(),
        })
    ).min(1, "At least one visible test case is required"),
    hiddenTestCases: z.array(
        z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
        })
    ).min(1, "At least one hidden test case is required"),
    startCode: z.array(
        z.object({
            language: z.string().min(1, "Language is required"),
            initialCode: z.string().min(1, "Initial code is required"),
        })
    ).min(1, "At least one start code entry is required"),
    driverCode: z.array(
        z.object({
            lang: z.string().min(1, "Language is required"),
            before: z.string().min(1, "Before code template is required"),
            after: z.string().min(1, "After code template is required"),
        })
    ).min(1, "At least one driver code layout is required"),
    referenceSolution: z.array(
        z.object({
            language: z.string().min(1, "Language is required"),
            completeCode: z.string().min(1, "Complete code is required"),
        })
    ).min(1, "At least one reference solution is required")
});

export default function AdminCreate() {
    const navigate = useNavigate();
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            title: "",
            description: "",
            difficulty: "easy",
            tags: "array",
            visibleTestCases: [{ input: "", output: "", explanation: "" }],
            hiddenTestCases: [{ input: "", output: "" }],
            startCode: [{ language: "javascript", initialCode: "" }],
            driverCode: [{ lang: "javascript", before: "// Solution wrapper setup\n", after: "// Validation checks\n" }],
            referenceSolution: [{ language: "javascript", completeCode: "" }]
        },
    });

    const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: "visibleTestCases" });
    const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: "hiddenTestCases" });
    const { fields: startFields, append: appendStart, remove: removeStart } = useFieldArray({ control, name: "startCode" });
    const { fields: driverFields, append: appendDriver, remove: removeDriver } = useFieldArray({ control, name: "driverCode" });
    const { fields: refFields, append: appendRef, remove: removeRef } = useFieldArray({ control, name: "referenceSolution" });

    async function onSubmit(data) {
        try {
            await axiosClient.post('/problem/create', data);
            navigate('/');
            alert('Problem deployed successfully');
        } catch (error) {
            alert(`Deployment Error: ${error?.response?.data?.message || error.message}`);
        }
    }

    // High-contrast clean styling parameters
    const inputStyle = "w-full bg-[#161B26] border border-slate-700/60 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30 transition-all font-mono text-sm shadow-inner";
    const labelStyle = "text-xs font-sans font-bold uppercase tracking-wider text-slate-300 mb-2 block";
    const sectionCard = "bg-[#1F2633] border border-slate-700/40 rounded-2xl p-8 shadow-xl mb-8 relative overflow-hidden";

    return (
        <LazyMotion features={domAnimation}>
            <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-100 antialiased">
                <m.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
                    
                    {/* ACCESSIBLE HERO STICKY HEADER */}
                    <div className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md py-4 mb-8 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/30">
                                <Terminal className="text-red-400 w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-white tracking-tight">Create DSA Problem</h1>
                                <p className="text-xs text-slate-400 font-medium">Core Workspace</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => reset()} 
                                className="px-4 py-2.5 border border-slate-700 hover:border-slate-500 rounded-xl text-sm font-semibold text-slate-300 hover:text-white flex items-center gap-2 bg-[#161B26] transition-all active:scale-95"
                            >
                                <RotateCcw size={15} /> Reset
                            </button>
                            <button 
                                type="button" 
                                onClick={handleSubmit(onSubmit)} 
                                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-900/20 transition-all active:scale-95"
                            >
                                <Save size={16} /> Deploy Challenge
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="pb-20">
                        {/* SECTION 1: METADATA */}
                        <div className={sectionCard}>
                            <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-400"><Database size={70} /></div>
                            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700/60 pb-3">
                                <span className="text-red-400 font-mono">01.</span> Core Metadata
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <label className={labelStyle}>Problem Title</label>
                                    <input className={inputStyle} {...register("title")} placeholder="e.g., Search in Rotated Sorted Array" />
                                    {errors.title && <p className="text-xs text-red-400 mt-1.5 font-medium">{errors.title.message}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>Technical Description</label>
                                    <textarea className={`${inputStyle} h-40 resize-none`} {...register("description")} placeholder="Provide descriptions, format specifications, and runtime constraints..." />
                                    {errors.description && <p className="text-xs text-red-400 mt-1.5 font-medium">{errors.description.message}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelStyle}>Difficulty Classification</label>
                                        <select className={`${inputStyle} appearance-none cursor-pointer`} {...register("difficulty")}>
                                            <option value="easy" className="bg-[#161B26]">Easy</option>
                                            <option value="medium" className="bg-[#161B26]">Medium</option>
                                            <option value="hard" className="bg-[#161B26]">Hard</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelStyle}>Algorithmic Tag Category</label>
                                        <select className={`${inputStyle} appearance-none cursor-pointer`} {...register("tags")}>
                                            <option value="array" className="bg-[#161B26]">Array</option>
                                            <option value="string" className="bg-[#161B26]">String</option>
                                            <option value="tree" className="bg-[#161B26]">Tree</option>
                                            <option value="linkedList" className="bg-[#161B26]">Linked List</option>
                                            <option value="graph" className="bg-[#161B26]">Graph</option>
                                            <option value="dp" className="bg-[#161B26]">Dynamic Programming</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: ASSERTION SUITES */}
                        <div className={sectionCard}>
                            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700/60 pb-3">
                                <span className="text-red-400 font-mono">02.</span> Test Case Suites
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Visible Assertions (User Facing)</p>
                                    <div className="space-y-4">
                                        {visibleFields.map((field, i) => (
                                            <m.div layout key={field.id} className="p-5 bg-[#161B26] rounded-xl border border-slate-700/40 space-y-4 relative">
                                                <button type="button" onClick={() => removeVisible(i)} className="absolute top-4 right-4 text-slate-400 hover:text-red-400 transition-colors">
                                                    <Trash2 size={15} />
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={labelStyle}>Input Data</label>
                                                        <input className={inputStyle} {...register(`visibleTestCases.${i}.input`)} />
                                                    </div>
                                                    <div>
                                                        <label className={labelStyle}>Expected Output</label>
                                                        <input className={inputStyle} {...register(`visibleTestCases.${i}.output`)} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelStyle}>Explanation (Optional)</label>
                                                    <input className={inputStyle} {...register(`visibleTestCases.${i}.explanation`)} placeholder="Why is this matching?" />
                                                </div>
                                            </m.div>
                                        ))}
                                        <button type="button" onClick={() => appendVisible({ input: "", output: "", explanation: "" })} className="w-full py-2.5 border border-dashed border-slate-600/60 hover:border-red-500/60 bg-[#161B26]/40 rounded-xl text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2 text-xs font-semibold uppercase">
                                            <Plus size={14} /> Append Public Case
                                        </button>
                                        {errors.visibleTestCases && <p className="text-xs text-red-400 font-medium mt-1">{errors.visibleTestCases.message}</p>}
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-slate-700/40">
                                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Hidden Validation Cases (System Verification)</p>
                                    <div className="space-y-4">
                                        {hiddenFields.map((field, i) => (
                                            <m.div layout key={field.id} className="p-5 bg-[#161B26] rounded-xl border border-slate-700/40 relative grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <button type="button" onClick={() => removeHidden(i)} className="absolute top-4 right-4 text-slate-400 hover:text-red-400 transition-colors">
                                                    <Trash2 size={15} />
                                                </button>
                                                <div>
                                                    <label className={labelStyle}>System Input</label>
                                                    <input className={inputStyle} {...register(`hiddenTestCases.${i}.input`)} />
                                                </div>
                                                <div>
                                                    <label className={labelStyle}>System Output</label>
                                                    <input className={inputStyle} {...register(`hiddenTestCases.${i}.output`)} />
                                                </div>
                                            </m.div>
                                        ))}
                                        <button type="button" onClick={() => appendHidden({ input: "", output: "" })} className="w-full py-2.5 border border-dashed border-slate-600/60 hover:border-red-500/60 bg-[#161B26]/40 rounded-xl text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2 text-xs font-semibold uppercase">
                                            <Plus size={14} /> Append Hidden Case
                                        </button>
                                        {errors.hiddenTestCases && <p className="text-xs text-red-400 font-medium mt-1">{errors.hiddenTestCases.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: RUNTIMES */}
                        <div className={sectionCard}>
                            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700/60 pb-3">
                                <span className="text-red-400 font-mono">03.</span> Runtime Configurations
                            </h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <p className="text-sm font-bold text-white flex items-center gap-2"><Code size={15} className="text-red-400" /> User Code Structure</p>
                                        {startFields.map((field, i) => (
                                            <div key={field.id} className="p-4 bg-[#161B26] rounded-xl border border-slate-700/40 space-y-3">
                                                <input className={inputStyle} placeholder="Language (e.g. javascript)" {...register(`startCode.${i}.language`)} />
                                                <textarea className={`${inputStyle} h-28 font-mono resize-none`} placeholder="Initial method definitions..." {...register(`startCode.${i}.initialCode`)} />
                                                <button type="button" onClick={() => removeStart(i)} className="text-[10px] font-bold tracking-wider uppercase text-slate-400 hover:text-red-400 transition-colors">Remove Setup</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => appendStart({ language: "javascript", initialCode: "" })} className="text-xs text-red-400 font-bold hover:underline hover:text-red-300 transition-colors">+ Add Language Runtime</button>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-sm font-bold text-white flex items-center gap-2"><Eye size={15} className="text-emerald-400" /> Reference Solution</p>
                                        {refFields.map((field, i) => (
                                            <div key={field.id} className="p-4 bg-[#161B26] rounded-xl border border-slate-700/40 space-y-3">
                                                <input className={inputStyle} placeholder="Language" {...register(`referenceSolution.${i}.language`)} />
                                                <textarea className={`${inputStyle} h-28 font-mono resize-none border-emerald-500/20 focus:border-emerald-500/60`} placeholder="Full working script configuration..." {...register(`referenceSolution.${i}.completeCode`)} />
                                                <button type="button" onClick={() => removeRef(i)} className="text-[10px] font-bold tracking-wider uppercase text-slate-400 hover:text-emerald-400 transition-colors">Remove Solution</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => appendRef({ language: "javascript", completeCode: "" })} className="text-xs text-emerald-400 font-bold hover:underline hover:text-emerald-300 transition-colors">+ Add Solution Script</button>
                                    </div>
                                </div>

                                {/* DRIVER CODE MIDDLEWARE WRAPPER */}
                                <div className="pt-5 border-t border-slate-700/40 space-y-4">
                                    <p className="text-sm font-bold text-white flex items-center gap-2"><Layers size={15} className="text-blue-400" /> Execution Template Setup (`driverCode`)</p>
                                    <div className="space-y-4">
                                        {driverFields.map((field, i) => (
                                            <div key={field.id} className="p-5 bg-[#161B26] rounded-xl border border-slate-700/40 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <input className={`${inputStyle} max-w-xs`} placeholder="Lang Reference" {...register(`driverCode.${i}.lang`)} />
                                                    <button type="button" onClick={() => removeDriver(i)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={labelStyle}>Prefix Code Wrapper (`before`)</label>
                                                        <textarea className={`${inputStyle} h-36 font-mono resize-none`} {...register(`driverCode.${i}.before`)} placeholder="e.g., File streams, imports..." />
                                                    </div>
                                                    <div>
                                                        <label className={labelStyle}>Suffix Code Wrapper (`after`)</label>
                                                        <textarea className={`${inputStyle} h-36 font-mono resize-none`} {...register(`driverCode.${i}.after`)} placeholder="e.g., Assertions outputs, profiling..." />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => appendDriver({ lang: "javascript", before: "", after: "" })} className="text-xs text-blue-400 font-bold hover:underline hover:text-blue-300 transition-colors">+ Add Driver Core Interface</button>
                                        {errors.driverCode && <p className="text-xs text-red-400 font-medium mt-1">{errors.driverCode.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </m.div>
            </div>
        </LazyMotion>
    );
}