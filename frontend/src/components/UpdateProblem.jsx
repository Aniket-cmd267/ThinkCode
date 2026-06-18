import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import axiosClient from "../utils/axiosClient";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { Plus, Trash2, Terminal, Code, Database, Eye, Save, RotateCcw, Layers } from "lucide-react";
import { useNavigate } from "react-router";

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

export default function UpdateProblem({ onUpdateSuccess }) {
    const { id: problemId } = useParams();
    const navigate= useNavigate();
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            title: "",
            description: "",
            difficulty: "easy",
            tags: "array",
            visibleTestCases: [],
            hiddenTestCases: [],
            startCode: [],
            driverCode: [],
            referenceSolution: []
        },
    });

    const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: "visibleTestCases" });
    const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: "hiddenTestCases" });
    const { fields: startFields, append: appendStart, remove: removeStart } = useFieldArray({ control, name: "startCode" });
    const { fields: driverFields, append: appendDriver, remove: removeDriver } = useFieldArray({ control, name: "driverCode" });
    const { fields: refFields, append: appendRef, remove: removeRef } = useFieldArray({ control, name: "referenceSolution" });

    // CRITICAL: Fetch existing data and push it explicitly into React Hook Form
    useEffect(() => {
        if (!problemId) {
            console.error("UpdateProblem: missing problemId route parameter.");
            return;
        }

        async function fetchProblemDetails() {
            try {
                const response = await axiosClient.get(`/problem/problemById/${problemId}`);
                const problem = response.data;
                reset({
                    title: problem.title || "",
                    description: problem.description || "",
                    difficulty: problem.difficulty || "easy",
                    tags: problem.tags || "array",
                    visibleTestCases: problem.visibleTestCases || [],
                    hiddenTestCases: problem.hiddenTestCases || [],
                    startCode: problem.startCode || [],
                    driverCode: problem.driverCode || [],
                    referenceSolution: problem.referenceSolution || []
                });
            } catch (error) {
                console.error("Fetch details error:", error);
                alert("Failed to load existing problem data.");
            }
        }

        fetchProblemDetails();
    }, [problemId, reset]);

    async function onSubmit(data) {
        try {
            await axiosClient.put(`/problem/update/${problemId}`, data);
            alert("Problem configuration updated successfully.");
            navigate('/admin');
            if (onUpdateSuccess) onUpdateSuccess();
        } catch (error) {
            alert(`Update Error: ${error?.response?.data?.message || error.message}`);
        }
    }

    const inputStyle = "w-full bg-slate-950/80 border border-slate-700/60 rounded-3xl py-3 px-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/20 transition-all font-sans text-sm shadow-[inset_0_2px_6px_rgba(255,255,255,0.03)]";
    const labelStyle = "text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 mb-2 block";
    const sectionCard = "bg-slate-900/90 border border-slate-700/40 rounded-[32px] p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)] mb-10 relative overflow-hidden";

    return (
        <LazyMotion features={domAnimation}>
            <div className="p-8 bg-slate-950 min-h-screen text-slate-100 antialiased">
                <m.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
                    
                    <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl py-5 px-7 mb-8 border border-slate-800/70 rounded-[28px] shadow-2xl">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                            <div className="flex items-center gap-4">
                                {/* <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                                    <Terminal className="text-cyan-400 w-6 h-6" />
                                </div> */}
                                <div>
                                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Edit Problem</h1>
                                    <p className="text-sm text-slate-400 font-medium">Verify current schemas and modify execution templates</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    type="submit"
                                    onClick={handleSubmit(onSubmit)} 
                                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_16px_30px_-15px_rgba(14,165,233,0.7)] transition-transform hover:-translate-y-0.5 active:scale-95"
                                >
                                    <Save size={16} /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="pb-20">
                        <div className={sectionCard}>
                            <div className="absolute top-0 right-0 p-6 opacity-5 text-cyan-400"><Database size={80} /></div>
                            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-3 border-b border-slate-700/50 pb-4">
                                <span className="text-cyan-400 font-mono">01</span>
                                <span className="text-slate-300 uppercase tracking-[0.26em] text-[11px]">Core Metadata</span>
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className={labelStyle}>Problem Title</label>
                                    <input className={inputStyle} {...register("title")} placeholder="e.g., Search in Rotated Sorted Array" />
                                    {errors.title && <p className="text-xs text-amber-300 mt-1.5 font-medium">{errors.title.message}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>Technical Description</label>
                                    <textarea className={`${inputStyle} h-44 resize-none`} {...register("description")} placeholder="Provide descriptions, format specifications..." />
                                    {errors.description && <p className="text-xs text-amber-300 mt-1.5 font-medium">{errors.description.message}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={labelStyle}>Difficulty Classification</label>
                                        <select className={`${inputStyle} appearance-none cursor-pointer`} {...register("difficulty")}>
                                            <option value="easy" className="bg-slate-950">Easy</option>
                                            <option value="medium" className="bg-slate-950">Medium</option>
                                            <option value="hard" className="bg-slate-950">Hard</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={labelStyle}>Algorithmic Tag Category</label>
                                        <select className={`${inputStyle} appearance-none cursor-pointer`} {...register("tags")}>
                                            <option value="array" className="bg-slate-950">Array</option>
                                            <option value="string" className="bg-slate-950">String</option>
                                            <option value="tree" className="bg-slate-950">Tree</option>
                                            <option value="linkedList" className="bg-slate-950">Linked List</option>
                                            <option value="graph" className="bg-slate-950">Graph</option>
                                            <option value="dp" className="bg-slate-950">Dynamic Programming</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={sectionCard}>
                            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700/60 pb-3">
                                <span className="text-red-400 font-mono">02.</span> Test Case Suites
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.26em] mb-4">Visible Assertions (User Facing)</p>
                                    <div className="space-y-4">
                                        {visibleFields.map((field, i) => (
                                            <div key={field.id} className="p-5 bg-slate-950/95 rounded-[28px] border border-slate-700/50 shadow-inner shadow-slate-950/20 space-y-4 relative">
                                                <button type="button" onClick={() => removeVisible(i)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-400 transition-colors">
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
                                                    <input className={inputStyle} {...register(`visibleTestCases.${i}.explanation`)} />
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => appendVisible({ input: "", output: "", explanation: "" })} className="w-full rounded-3xl border border-dashed border-slate-700/50 bg-slate-950/80 py-3 text-sm font-semibold text-slate-200 hover:border-cyan-400/70 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-[0.16em]">
                                            <Plus size={14} /> Add Public Case
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-slate-700/40">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.26em] mb-4">Hidden Validation Cases (System Verification)</p>
                                    <div className="space-y-4">
                                        {hiddenFields.map((field, i) => (
                                            <div key={field.id} className="p-5 bg-slate-950/95 rounded-[28px] border border-slate-700/50 relative grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <button type="button" onClick={() => removeHidden(i)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-400 transition-colors">
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
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => appendHidden({ input: "", output: "" })} className="w-full rounded-3xl border border-dashed border-slate-700/50 bg-slate-950/80 py-3 text-sm font-semibold text-slate-200 hover:border-cyan-400/70 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-[0.16em]">
                                            <Plus size={14} /> Add Hidden Case
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={sectionCard}>
                            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700/60 pb-3">
                                <span className="text-red-400 font-mono">03.</span> Runtime Configurations
                            </h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <p className="text-sm font-bold text-white flex items-center gap-2"><Code size={15} className="text-cyan-400" /> User Code Structure</p>
                                        {startFields.map((field, i) => (
                                            <div key={field.id} className="p-5 bg-slate-950/95 rounded-[26px] border border-slate-700/50 space-y-3">
                                                <input className={inputStyle} placeholder="Language ID" {...register(`startCode.${i}.language`)} />
                                                <textarea className={`${inputStyle} h-28 font-mono resize-none`} placeholder="Initial method definitions..." {...register(`startCode.${i}.initialCode`)} />
                                                <button type="button" onClick={() => removeStart(i)} className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">Remove Setup</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => appendStart({ language: "javascript", initialCode: "" })} className="text-xs text-cyan-400 font-bold hover:underline hover:text-cyan-300 transition-colors cursor-pointer">+ Add Language Runtime</button>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-sm font-bold text-white flex items-center gap-2"><Eye size={15} className="text-emerald-400" /> Reference Solution</p>
                                        {refFields.map((field, i) => (
                                            <div key={field.id} className="p-5 bg-slate-950/95 rounded-[26px] border border-slate-700/50 space-y-3">
                                                <input className={inputStyle} placeholder="Language" {...register(`referenceSolution.${i}.language`)} />
                                                <textarea className={`${inputStyle} h-28 font-mono resize-none border-emerald-500/20 focus:border-emerald-500/60`} placeholder="Full working script..." {...register(`referenceSolution.${i}.completeCode`)} />
                                                <button type="button" onClick={() => removeRef(i)} className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Remove Solution</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => appendRef({ language: "javascript", completeCode: "" })} className="text-xs text-emerald-400 font-bold hover:underline hover:text-emerald-300 transition-colors cursor-pointer">+ Add Solution Script</button>
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-slate-700/40 space-y-4">
                                    <p className="text-sm font-bold text-white flex items-center gap-2"><Layers size={15} className="text-sky-400" /> Execution Template Setup (`driverCode`)</p>
                                    <div className="space-y-4">
                                        {driverFields.map((field, i) => (
                                            <div key={field.id} className="p-5 bg-slate-950/95 rounded-[28px] border border-slate-700/50 space-y-4">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <input className={`${inputStyle} max-w-full sm:max-w-xs`} placeholder="Lang Reference" {...register(`driverCode.${i}.lang`)} />
                                                    <button type="button" onClick={() => removeDriver(i)} className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"><Trash2 size={15} /> Remove</button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={labelStyle}>Prefix Code Wrapper (`before`)</label>
                                                        <textarea className={`${inputStyle} h-36 font-mono resize-none`} {...register(`driverCode.${i}.before`)} placeholder="e.g., File streams, imports..." />
                                                    </div>
                                                    <div>
                                                        <label className={labelStyle}>Suffix Code Wrapper (`after`)</label>
                                                        <textarea className={`${inputStyle} h-36 font-mono resize-none`} {...register(`driverCode.${i}.after`)} placeholder="e.g., Assertions outputs..." />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => appendDriver({ lang: "javascript", before: "", after: "" })} className="text-xs text-sky-400 font-bold hover:underline hover:text-sky-300 transition-colors cursor-pointer">+ Add Driver Core Interface</button>
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