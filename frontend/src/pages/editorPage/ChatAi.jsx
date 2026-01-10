import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiSend } from "react-icons/fi";
import axiosClient from '../../utils/axiosClient';

function ChatAi({ problem }) {
    // console.log(problem)
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [messages, setMessage] = useState([])
    const messageEndRef = useRef(null);

    const onSubmit = async (data) => {
        console.log(data)
        const newUserMessage= { role: 'user', parts: [{ text: data.message }] }
        setMessage(prev => [...prev, newUserMessage])
        reset()
        try {
            console.log('msg: ',messages)
            const updatedMessage= [...messages, newUserMessage]
            const response = await axiosClient.post('/ai/chat', {
                message: updatedMessage,
                problem: problem
            })
            console.log(response.data.message) 

            setMessage(prev => [...prev, {
                role: 'model',
                parts: [{ text: response.data.message }]
            }]);

            // console.log(messages)
        } catch (err) {
            console.log('Error: ', err);
            setMessage(prev => [...prev, {
                role: 'model',
                parts: [{ text: 'Error from AI chatbot' }]
            }]);
        }
    }
    // useEffect(() => {
    //     const sendData = async () => {
    //         try {
    //             console.log(messages.length)
    //             if (messages[messages.length - 1].role == 'user') {
    //                 const response = await axiosClient.post('/ai/chat', {
    //                     message: messages,
    //                     problem: problem
    //                 })
    //                 // console.log(response) 
    //                 setMessage(prev => [...prev, {
    //                     role: 'model',
    //                     parts: [{ text: response.data.message }]
    //                 }]);
    //             }
    //             // console.log(messages)
    //         } catch (err) {
    //             console.log('Error: ', err);
    //             setMessage(prev => [...prev, {
    //                 role: 'model',
    //                 parts: [{ text: 'Error from AI chatbot' }]
    //             }]);
    //         }
    //     }
    //     sendData();
    // },[])
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behaviour: 'smooth' })
    }, [messages]);
    return (
        <div className='flex flex-col border border-base-300 h-screen max-h-[85vh] min-h-[500px] p-3 '>
            <div className='flex-1 overflow-y-auto p-2'>
                {messages.map((msg, index) => (
                    <div key={index}
                        className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}>
                        <div className="chat-bubble bg-base-200 text-base-content">
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}
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