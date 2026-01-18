// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import z from "zod";
// import axiosClient from "../utils/axiosClient";
// import { useNavigate } from "react-router";

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

// export default function AdminCreate(){
//     const { register, control, handleSubmit, reset, formState: {errors} } = useForm({
//             resolver: zodResolver(problemSchema),
//             defaultValues: {
//                 title: "",
//                 description: "",
//                 difficulty: "easy",
//                 tags: "array",
//                 visibleTestCases: [{ input: "", output: "", explanation: "" }],
//                 hiddenTestCases: [{ input: "", output: "" }],
//                 startCode: [{ language: "javascript", initialCode: "" }],
//                 referenceSolution: [{ language: "javascript", completeCode: "" }],
//                 problemCreator: "",
//             },
//         });
    
//         const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
//             control,
//             name: "visibleTestCases",
//         });
    
//         const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({
//             control,
//             name: "hiddenTestCases",
//         });
    
//         const { fields: startFields, append: appendStart, remove: removeStart } = useFieldArray({
//             control,
//             name: "startCode",
//         });
    
//         const { fields: refFields, append: appendRef, remove: removeRef } = useFieldArray({
//             control,
//             name: "referenceSolution",
//         });
    
//         const navigate= useNavigate();
//         async function onSubmit(data){
//             try{
//                 console.log(data);
//                 await axiosClient.post('/problem/create', data);
//                 navigate('/')
//                 alert('Problem added successfully');
//             }
//             catch(error){
//                 alert(`Error: ${error?.response?.data?.message || error.message}`)
//             }
//         }
//         return (
//             <div className="p-6 bg-neutral-900 min-h-screen">
//             <div className="max-w-4xl mx-auto">
//                 <div className="card bg-base-100 shadow-xl">
//                     <div className="card-body bg-neutral-950">
//                         <h2 className="card-title">Create DSA Problem</h2>
//                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                             <div>
//                                 <label className="label">
//                                     <span className="label-text">Title</span>
//                                 </label>
//                                 <input
//                                     className="input input-bordered w-full"
//                                     {...register("title")}
//                                     placeholder="Two Sum"
//                                 />
//                                 {errors.title && <p className="text-sm text-error mt-1">{errors.title.message}</p>}
//                             </div>

//                             <div>
//                                 <label className="label">
//                                     <span className="label-text">Description</span>
//                                 </label>
//                                 <textarea
//                                     className="textarea textarea-bordered w-full h-40"
//                                     {...register("description")}
//                                     placeholder="Problem description here..."
//                                 />
//                                 {errors.description && <p className="text-sm text-error mt-1">{errors.description.message}</p>}
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
//                                 <div>
//                                     <label className="label">
//                                         <span className="label-text">Difficulty</span>
//                                     </label>
//                                     <select className="select select-bordered w-full" {...register("difficulty")}>
//                                         <option value="easy">easy</option>
//                                         <option value="medium">medium</option>
//                                         <option value="hard">hard</option>
//                                     </select>
//                                     {errors.difficulty && <p className="text-sm text-error mt-1">{errors.difficulty.message}</p>}
//                                 </div>

//                                 <div>
//                                     <label className="label">
//                                             <span className="label-text">Tags</span>
//                                         </label>
//                                         <select className="select select-bordered w-full" {...register("tags")}>
//                                             <option value="array">array</option>
//                                             <option value="linkedList">linkedList</option>
//                                             <option value="graph">graph</option>
//                                             <option value="dp">dp</option>
//                                         </select>
//                                         {errors.tags && <p className="text-sm text-error mt-1">{errors.tags.message}</p>}
//                                 </div>
//                             </div>

//                             <section className="divider">Visible Test Cases</section>
//                             {visibleFields.map((field, i) => (
//                                 <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
//                                     <div>
//                                         <label className="label"><span className="label-text">Input</span></label>
//                                         <input className="input input-bordered w-full" {...register(`visibleTestCases.${i}.input`)} defaultValue={field.input} />
//                                     </div>
//                                     <div>
//                                         <label className="label"><span className="label-text">Output</span></label>
//                                         <input className="input input-bordered w-full" {...register(`visibleTestCases.${i}.output`)} defaultValue={field.output} />
//                                     </div>
//                                     <div>
//                                         <label className="label"><span className="label-text">Explanation</span></label>
//                                         <input className="input input-bordered w-full" {...register(`visibleTestCases.${i}.explanation`)} defaultValue={field.explanation} />
//                                         <div className="mt-2 flex gap-2">
//                                             <button type="button" className="btn btn-xs btn-ghost" onClick={() => removeVisible(i)}>Remove</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                             {errors.visibleTestCases && <p className="text-sm text-error">{errors.visibleTestCases.message}</p>}
//                             <div>
//                                 <button type="button" className="btn btn-sm" onClick={() => appendVisible({ input: "", output: "", explanation: "" })}>Add visible test case</button>
//                             </div>

//                             <section className="divider">Hidden Test Cases</section>
//                             {hiddenFields.map((field, i) => (
//                                 <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
//                                     <div>
//                                         <label className="label"><span className="label-text">Input</span></label>
//                                         <input className="input input-bordered w-full" {...register(`hiddenTestCases.${i}.input`)} defaultValue={field.input} />
//                                     </div>
//                                     <div>
//                                         <label className="label"><span className="label-text">Output</span></label>
//                                         <input className="input input-bordered w-full" {...register(`hiddenTestCases.${i}.output`)} defaultValue={field.output} />
//                                         <div className="mt-2">
//                                             <button type="button" className="btn btn-xs btn-ghost" onClick={() => removeHidden(i)}>Remove</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                             <div>
//                                 <button type="button" className="btn btn-sm" onClick={() => appendHidden({ input: "", output: "" })}>Add hidden test case</button>
//                             </div>

//                             <section className="divider">Start Code</section>
//                             {startFields.map((field, i) => (
//                                 <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                                     <div>
//                                         <label className="label"><span className="label-text">Language</span></label>
//                                         <input className="input input-bordered w-full" {...register(`startCode.${i}.language`)} defaultValue={field.language} />
//                                     </div>
//                                     <div className="md:col-span-2">
//                                         <label className="label"><span className="label-text">Initial Code</span></label>
//                                         <textarea className="textarea textarea-bordered w-full h-28" {...register(`startCode.${i}.initialCode`)} defaultValue={field.initialCode} />
//                                         <div className="mt-2">
//                                             <button type="button" className="btn btn-xs btn-ghost" onClick={() => removeStart(i)}>Remove</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                             {errors.startCode && <p className="text-sm text-error">{errors.startCode.message}</p>}
//                             <div>
//                                 <button type="button" className="btn btn-sm" onClick={() => appendStart({ language: "javascript", initialCode: "" })}>Add start code</button>
//                             </div>

//                             <section className="divider">Reference Solution</section>
//                             {refFields.map((field, i) => (
//                                 <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                                     <div>
//                                         <label className="label"><span className="label-text">Language</span></label>
//                                         <input className="input input-bordered w-full" {...register(`referenceSolution.${i}.language`)} defaultValue={field.language} />
//                                     </div>
//                                     <div className="md:col-span-2">
//                                         <label className="label"><span className="label-text">Complete Code</span></label>
//                                         <textarea className="textarea textarea-bordered w-full h-28" {...register(`referenceSolution.${i}.completeCode`)} defaultValue={field.completeCode} />
//                                         <div className="mt-2">
//                                             <button type="button" className="btn btn-xs btn-ghost" onClick={() => removeRef(i)}>Remove</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                             {errors.referenceSolution && <p className="text-sm text-error">{errors.referenceSolution.message}</p>}
//                             <div>
//                                 <button type="button" className="btn btn-sm" onClick={() => appendRef({ language: "javascript", completeCode: "" })}>Add reference solution</button>
//                             </div>

//                             <div>
//                                 <label className="label"><span className="label-text">Problem Creator (user id)</span></label>
//                                 <input className="input input-bordered w-full" {...register("problemCreator")} placeholder="ObjectId or username" />
//                             </div>

//                             <div className="flex gap-2 justify-end">
//                                 <button type="submit" className="btn btn-primary">Create</button>
//                                 <button type="button" className="btn btn-ghost" onClick={() => reset()}>Reset</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         )
// }

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { Plus, Trash2, Terminal, Code, Database, Eye, EyeOff, Save, RotateCcw } from "lucide-react";

// Schema stays exactly as yours
const problemSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    tags: z.enum(["array", "linkedList", "graph", "dp"]),
    visibleTestCases: z.array(
        z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().min(1, "Explanation is required"),
        })
    ).min(1, "At least one visible test case is required"),
    hiddenTestCases: z.array(
        z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
        })
    ).optional(),
    startCode: z.array(
        z.object({
            language: z.string().min(1, "Language is required"),
            initialCode: z.string().min(1, "Initial code is required"),
        })
    ).min(1, "At least one start code entry is required"),
    referenceSolution: z.array(
        z.object({
            language: z.string().min(1, "Language is required"),
            completeCode: z.string().min(1, "Complete code is required"),
        })
    ).min(1, "At least one reference solution is required"),
    problemCreator: z.string().optional(),
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
            referenceSolution: [{ language: "javascript", completeCode: "" }],
            problemCreator: "",
        },
    });

    // Field Arrays
    const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: "visibleTestCases" });
    const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: "hiddenTestCases" });
    const { fields: startFields, append: appendStart, remove: removeStart } = useFieldArray({ control, name: "startCode" });
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

    // Reuseable Input Styles
    const inputStyle = "w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#EF4444]/50 transition-all placeholder:text-slate-700";
    const labelStyle = "text-xs font-mono uppercase tracking-[0.2em] text-[#F87171] font-bold mb-2 block";
    const sectionCard = "bg-[#050505] border border-white/5 rounded-3xl p-8 shadow-2xl mb-8 relative overflow-hidden";

    return (
        <LazyMotion features={domAnimation}>
            <div className="p-8 bg-[#0A0A0A] min-h-screen text-slate-200 selection:bg-[#EF4444]/30">
                <m.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto"
                >
                    {/* STICKY FORM HEADER */}
                    <div className="sticky top-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-md py-4 mb-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#EF4444]/10 rounded-2xl border border-[#EF4444]/20">
                                <Terminal className="text-[#EF4444]" />
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Construct <span className="text-[#EF4444]">Problem</span></h1>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => reset()} className="btn btn-ghost border-white/5 text-slate-400 hover:text-white flex items-center gap-2">
                                <RotateCcw size={16} /> Reset
                            </button>
                            <button onClick={handleSubmit(onSubmit)} className="bg-[#dd0d0d] hover:bg-[#DC2626] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#EF4444]/20 transition-all active:scale-95">
                                <Save size={18} /> Deploy Problem
                            </button>
                        </div>
                    </div>

                    <form className="pb-20">
                        {/* SECTION 1: CORE DETAILS */}
                        <div className={sectionCard}>
                            <div className="absolute top-0 right-0 p-4 opacity-5"><Database size={80} /></div>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 underline underline-offset-8 decoration-[#EF4444]/30">
                                <span className="text-[#EF4444]">01.</span> Core Metadata
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className={labelStyle}>Problem Title</label>
                                    <input className={inputStyle} {...register("title")} placeholder="e.g., Two Sum Matrix" />
                                    {errors.title && <p className="text-xs text-[#EF4444] mt-2">{errors.title.message}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>Technical Description</label>
                                    <textarea className={`${inputStyle} h-48 resize-none`} {...register("description")} placeholder="Describe the constraints, inputs, and algorithmic requirements..." />
                                    {errors.description && <p className="text-xs text-[#EF4444] mt-2">{errors.description.message}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelStyle}>Difficulty Level</label>
                                        <select className={inputStyle} {...register("difficulty")}>
                                            <option value="easy">Easy (Lvl 1)</option>
                                            <option value="medium">Medium (Lvl 2)</option>
                                            <option value="hard">Hard (Lvl 3)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelStyle}>Primary Tag</label>
                                        <select className={inputStyle} {...register("tags")}>
                                            <option value="array">Array</option>
                                            <option value="linkedList">Linked List</option>
                                            <option value="graph">Graph</option>
                                            <option value="dp">Dynamic Programming</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: TEST CASES (VISIBLE) */}
                        <div className={sectionCard}>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 underline underline-offset-8 decoration-[#EF4444]/30">
                                <span className="text-[#EF4444]">02.</span> Public Test Cases
                            </h3>
                            <div className="space-y-4">
                                {visibleFields.map((field, i) => (
                                    <m.div layout key={field.id} className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4 relative group">
                                        <button type="button" onClick={() => removeVisible(i)} className="absolute top-4 right-4 text-slate-600 hover:text-[#EF4444] transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelStyle}>Input</label>
                                                <input className={inputStyle} {...register(`visibleTestCases.${i}.input`)} />
                                            </div>
                                            <div>
                                                <label className={labelStyle}>Output</label>
                                                <input className={inputStyle} {...register(`visibleTestCases.${i}.output`)} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelStyle}>Explanation</label>
                                            <input className={inputStyle} {...register(`visibleTestCases.${i}.explanation`)} placeholder="Why is this the output?" />
                                        </div>
                                    </m.div>
                                ))}
                                <button type="button" onClick={() => appendVisible({ input: "", output: "", explanation: "" })} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 hover:text-[#EF4444] hover:border-[#EF4444]/30 transition-all flex items-center justify-center gap-2 font-mono text-xs uppercase">
                                    <Plus size={16} /> Add Public Test Case
                                </button>
                            </div>
                        </div>

                        {/* SECTION 3: CODE TEMPLATES */}
                        <div className={sectionCard}>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 underline underline-offset-8 decoration-[#EF4444]/30">
                                <span className="text-[#e73939]">03.</span> Runtime Configurations
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Start Code */}
                                <div className="space-y-4">
                                    <p className="text-sm font-bold text-white flex items-center gap-2"><Code size={16} className="text-[#EF4444]" /> Start Code Template</p>
                                    {startFields.map((field, i) => (
                                        <div key={field.id} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                                            <input className={inputStyle} placeholder="Language (e.g. javascript)" {...register(`startCode.${i}.language`)} />
                                            <textarea className={`${inputStyle} h-32 font-mono text-sm`} placeholder="Initial code function..." {...register(`startCode.${i}.initialCode`)} />
                                            <button type="button" onClick={() => removeStart(i)} className="text-[10px] font-bold uppercase text-slate-600 hover:text-[#EF4444]">Remove Entry</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => appendStart({ language: "javascript", initialCode: "" })} className="text-xs text-[#EF4444] font-bold hover:underline">+ Add Language Support</button>
                                </div>

                                {/* Reference Solution */}
                                <div className="space-y-4">
                                    <p className="text-sm font-bold text-white flex items-center gap-2"><Eye size={16} className="text-emerald-500" /> Reference Solution</p>
                                    {refFields.map((field, i) => (
                                        <div key={field.id} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                                            <input className={inputStyle} placeholder="Language" {...register(`referenceSolution.${i}.language`)} />
                                            <textarea className={`${inputStyle} h-32 font-mono text-sm border-emerald-500/10 focus:border-emerald-500/50`} placeholder="Correct solution code..." {...register(`referenceSolution.${i}.completeCode`)} />
                                            <button type="button" onClick={() => removeRef(i)} className="text-[10px] font-bold uppercase text-slate-600 hover:text-emerald-500">Remove Entry</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => appendRef({ language: "javascript", completeCode: "" })} className="text-xs text-emerald-500 font-bold hover:underline">+ Add Solution Template</button>
                                </div>
                            </div>
                        </div>

                        {/* FINAL CREDITS */}
                        <div className="bg-[#050505] p-6 rounded-3xl border border-white/5 flex items-center gap-6">
                            <div className="grow">
                                <label className={labelStyle}>Problem Originator (ID)</label>
                                <input className={inputStyle} {...register("problemCreator")} placeholder="User UUID or Handle" />
                            </div>
                        </div>
                    </form>
                </m.div>
            </div>
        </LazyMotion>
    );
}