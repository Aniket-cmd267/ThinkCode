
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";

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
function AdminPanel() {
    const { register, control, handleSubmit, reset, formState: {errors} } = useForm({
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

    const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
        control,
        name: "visibleTestCases",
    });

    const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({
        control,
        name: "hiddenTestCases",
    });

    const { fields: startFields, append: appendStart, remove: removeStart } = useFieldArray({
        control,
        name: "startCode",
    });

    const { fields: refFields, append: appendRef, remove: removeRef } = useFieldArray({
        control,
        name: "referenceSolution",
    });

    const navigate= useNavigate();
    async function onSubmit(data){
        try{
            axiosClient.post('/problem/create', data);
            navigate('/')
            alert('Problem added successfully');
        }
        catch(error){
            alert(`Error: ${error?.response?.data?.message || error.message}`)
        }
    }

    function onSubmit(data) {
        const payload = { ...data };
        // Log payload (static demo)
        // eslint-disable-next-line no-console
        console.log("Problem payload:", payload);
        alert("Problem object logged to console (static demo).");
    }

    return (
        <div className="p-6 bg-base-200 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Create DSA Problem</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input
                                    className="input input-bordered w-full"
                                    {...register("title")}
                                    placeholder="Two Sum"
                                />
                                {errors.title && <p className="text-sm text-error mt-1">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full h-40"
                                    {...register("description")}
                                    placeholder="Problem description here..."
                                />
                                {errors.description && <p className="text-sm text-error mt-1">{errors.description.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div>
                                    <label className="label">
                                        <span className="label-text">Difficulty</span>
                                    </label>
                                    <select className="select select-bordered w-full" {...register("difficulty")}>
                                        <option value="easy">easy</option>
                                        <option value="medium">medium</option>
                                        <option value="hard">hard</option>
                                    </select>
                                    {errors.difficulty && <p className="text-sm text-error mt-1">{errors.difficulty.message}</p>}
                                </div>

                                <div>
                                    <label className="label">
                                            <span className="label-text">Tags</span>
                                        </label>
                                        <select className="select select-bordered w-full" {...register("tags")}>
                                            <option value="array">Array</option>
                                            <option value="linkedList">LinkedList</option>
                                            <option value="graph">Graph</option>
                                            <option value="dp">DP</option>
                                        </select>
                                        {errors.tags && <p className="text-sm text-error mt-1">{errors.tags.message}</p>}
                                </div>
                            </div>

                            <section className="divider">Visible Test Cases</section>
                            {visibleFields.map((field, i) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                    <div>
                                        <label className="label"><span className="label-text">Input</span></label>
                                        <input className="input input-bordered w-full" {...register(`visibleTestCases.${i}.input`)} defaultValue={field.input} />
                                    </div>
                                    <div>
                                        <label className="label"><span className="label-text">Output</span></label>
                                        <input className="input input-bordered w-full" {...register(`visibleTestCases.${i}.output`)} defaultValue={field.output} />
                                    </div>
                                    <div>
                                        <label className="label"><span className="label-text">Explanation</span></label>
                                        <input className="input input-bordered w-full" {...register(`visibleTestCases.${i}.explanation`)} defaultValue={field.explanation} />
                                        <div className="mt-2 flex gap-2">
                                            <button type="button" className="btn btn-xs btn-ghost" onClick={() => removeVisible(i)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {errors.visibleTestCases && <p className="text-sm text-error">{errors.visibleTestCases.message}</p>}
                            <div>
                                <button type="button" className="btn btn-sm" onClick={() => appendVisible({ input: "", output: "", explanation: "" })}>Add visible test case</button>
                            </div>

                            <section className="divider">Hidden Test Cases</section>
                            {hiddenFields.map((field, i) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                                    <div>
                                        <label className="label"><span className="label-text">Input</span></label>
                                        <input className="input input-bordered w-full" {...register(`hiddenTestCases.${i}.input`)} defaultValue={field.input} />
                                    </div>
                                    <div>
                                        <label className="label"><span className="label-text">Output</span></label>
                                        <input className="input input-bordered w-full" {...register(`hiddenTestCases.${i}.output`)} defaultValue={field.output} />
                                        <div className="mt-2">
                                            <button type="button" className="btn btn-xs btn-ghost" onClick={() => removeHidden(i)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <button type="button" className="btn btn-sm" onClick={() => appendHidden({ input: "", output: "" })}>Add hidden test case</button>
                            </div>

                            <section className="divider">Start Code</section>
                            {startFields.map((field, i) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="label"><span className="label-text">Language</span></label>
                                        <input className="input input-bordered w-full" {...register(`startCode.${i}.language`)} defaultValue={field.language} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="label"><span className="label-text">Initial Code</span></label>
                                        <textarea className="textarea textarea-bordered w-full h-28" {...register(`startCode.${i}.initialCode`)} defaultValue={field.initialCode} />
                                        <div className="mt-2">
                                            <button type="button" className="btn btn-xs btn-ghost" onClick={() => removeStart(i)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {errors.startCode && <p className="text-sm text-error">{errors.startCode.message}</p>}
                            <div>
                                <button type="button" className="btn btn-sm" onClick={() => appendStart({ language: "javascript", initialCode: "" })}>Add start code</button>
                            </div>

                            <section className="divider">Reference Solution</section>
                            {refFields.map((field, i) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="label"><span className="label-text">Language</span></label>
                                        <input className="input input-bordered w-full" {...register(`referenceSolution.${i}.language`)} defaultValue={field.language} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="label"><span className="label-text">Complete Code</span></label>
                                        <textarea className="textarea textarea-bordered w-full h-28" {...register(`referenceSolution.${i}.completeCode`)} defaultValue={field.completeCode} />
                                        <div className="mt-2">
                                            <button type="button" className="btn btn-xs btn-ghost" onClick={() => removeRef(i)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {errors.referenceSolution && <p className="text-sm text-error">{errors.referenceSolution.message}</p>}
                            <div>
                                <button type="button" className="btn btn-sm" onClick={() => appendRef({ language: "javascript", completeCode: "" })}>Add reference solution</button>
                            </div>

                            <div>
                                <label className="label"><span className="label-text">Problem Creator (user id)</span></label>
                                <input className="input input-bordered w-full" {...register("problemCreator")} placeholder="ObjectId or username" />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button type="button" className="btn btn-ghost" onClick={() => reset()}>Reset</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );  
}

export default AdminPanel;