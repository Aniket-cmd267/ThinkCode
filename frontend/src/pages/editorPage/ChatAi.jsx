import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiSend } from "react-icons/fi";
import axiosClient from '../../utils/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMsg, addUserMsg ,getChatHistoryFromDatabase} from '../../store/editorSlice'

function ChatAi({ problem , problemId}) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const messageEndRef = useRef(null);
    const dispatch = useDispatch();
    const { chatHistory} = useSelector(state => state.slice2)
    const onSubmit =  (data) => {
        console.log(data)
        const newUserMessage = { role: 'user', parts: [{ text: data.message }] }
        reset()
        const updatedMessage = [...chatHistory, newUserMessage]
        dispatch(addUserMsg(newUserMessage))
        dispatch(sendChatMsg({ updatedMessage, problem, newUserMessage , problemId}))
    }
    useEffect(() =>{
        dispatch(getChatHistoryFromDatabase(problemId))
    },[problemId])
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behaviour: 'smooth' })
    }, [chatHistory]);
    return (
        <div className='flex flex-col border border-base-300 h-screen max-h-[85vh] min-h-125 p-3 '>
            <div className='flex-1 overflow-y-auto p-2'>
                {
                    chatHistory.length > 0 ? chatHistory.map((msg, index) => (
                        <div key={index}
                            className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}>
                            <div className="chat-bubble bg-base-200 text-base-content">
                                {msg.parts?.[0]?.text}
                            </div>
                        </div>
                    )): (<div className='flex justify-center items-center h-full'>
                        <h3 className='text-bold text-4xl text-gray-600 shadow shadow-amber-100'>Where u are struggling !!</h3>
                    </div>)
                }
                <div ref={messageEndRef} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='sticky bottom-0 p-4 bg-base-100 border-t'>
                <div className='flex items-center'>
                    <input placeholder='Ask me anything--->' className='border p-2 w-[90%] rounded-xl'
                        {...register('message', { required: true, minLength: 2 })}
                    ></input>
                    <button type='submit' className='btn btn-primary ml-2' disabled={errors.message}>
                        <FiSend size={23} />
                    </button>
                </div>
            </form>
        </div>
    )
}
export default ChatAi;