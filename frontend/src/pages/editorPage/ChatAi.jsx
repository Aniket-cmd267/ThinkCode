import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMsg, addUserMsg, getChatHistoryFromDatabase } from '../../store/editorSlice'
import { Bot, Send, User } from "lucide-react";
import { FencedText } from "./CodeBlock";

function ChatAi({ problem, problemId }) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messageEndRef = useRef(null);
    const dispatch = useDispatch();
    const { chatHistory } = useSelector(state => state.slice2)
    const [isSending, setIsSending] = useState(false);
    const onSubmit = (data) => {
        console.log(data)
        const newUserMessage = { role: 'user', parts: [{ text: data.message }] }
        reset()
        const updatedMessage = [...chatHistory, newUserMessage]
        dispatch(addUserMsg(newUserMessage))
        setIsSending(true);
        Promise.resolve(dispatch(sendChatMsg({ updatedMessage, problem, newUserMessage, problemId })))
            .finally(() => setIsSending(false));
    }
    useEffect(() => {
        dispatch(getChatHistoryFromDatabase(problemId))
    }, [problemId])
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatHistory]);
    return (
        <div className="flex flex-col min-h-0 rounded-2xl border border-white/[0.06] bg-[#141414]/40 overflow-hidden">

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                {chatHistory.length > 0 ? (
                    chatHistory.map((msg, index) => {
                        const isUser = msg.role === 'user';
                        const text = msg.parts?.[0]?.text ?? "";
                        return (
                            <div
                                key={index}
                                className={["flex items-start gap-3", isUser ? "justify-end" : "justify-start"].join(" ")}
                            >
                                {!isUser && (
                                    <div className="h-8 w-8 rounded-xl bg-[#EF4444]/10 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                                        <Bot size={16} className="text-[#F87171]" />
                                    </div>
                                )}

                                <div
                                    className={[
                                        "max-w-[90%] md:max-w-[78%] rounded-2xl px-4 py-3 border",
                                        isUser
                                            ? "bg-[#EF4444]/15 border-[#EF4444]/25 text-white"
                                            : "bg-[#1A1A1A] border-white/[0.06] text-slate-100"
                                    ].join(" ")}
                                >
                                    <div className="text-sm">
                                        <FencedText text={text} defaultCodeLabel="Snippet" />
                                    </div>
                                </div>

                                {isUser && (
                                    <div className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <User size={16} className="text-slate-300" />
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center max-w-md">
                            <p className="text-white font-bold text-lg mb-1">Stuck?</p>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Ask for a hint, complexity guidance, edge cases, or a walkthrough of your current approach.
                            </p>
                            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-left">
                                <p className="text-[10px] uppercase tracking-[0.28em] text-[#F87171]/75 font-semibold mb-2">
                                    Suggestions
                                </p>
                                <ul className="text-sm text-slate-300 space-y-1">
                                    <li> “What's the key insight for this problem?”</li>
                                    <li> “Can you propose 3 test cases that break naive solutions?”</li>
                                    <li> “Explain the optimal approach without giving full code.”</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messageEndRef} />
            </div>

            {/* Composer */}
            <form onSubmit={handleSubmit(onSubmit)} className="border-t border-white/[0.06] bg-[#111111]/70 p-3">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <label className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold">
                            Message
                        </label>
                        <div className="mt-1 flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-[#1A1A1A] px-3 py-2 focus-within:border-[#EF4444]/60">
                            <input
                                placeholder="Ask me anything..."
                                className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-600 text-sm"
                                {...register('message', { required: true, minLength: 2 })}
                            />
                        </div>
                        {errors.message ? (
                            <p className="mt-1 text-xs text-[#F87171]">Write at least 2 characters.</p>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        disabled={!!errors.message || isSending}
                        className="h-11 px-4 rounded-2xl bg-[#EF4444] text-white font-semibold hover:bg-[#DC2626] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                        <Send size={18} />
                        {isSending ? "Sending" : "Send"}
                    </button>
                </div>
            </form>
        </div>
    )
}
export default ChatAi;