import { useEffect, useRef, useState } from 'react';
import {useForm} from 'react-hook-form';
import { FiSend } from "react-icons/fi";
import { minLength } from 'zod';
import axiosClient from '../utils/axiosClient';

function ChatAi(){
    const {register, handleSubmit, reset, formState: {errors}}= useForm();
    const [message, setMessage]= useState([
        { role: 'model' , parts: [{text: 'I will answer dsa related questions....'}]},
        { role: 'user' , parts: [{text:'okk'}]}
    ])
    const messageEndRef= useRef(null);


    const onSubmit=async (data) =>{
        setMessage(prev => [...prev, {role: 'user', parts: [{text: data.message}]}])
        reset()
        try{
            const response= await axiosClient.post('/ai/chat', {
                message: message,
                
            })
            setMessage(prev => [...prev, {
                role: 'model',
                parts: [{text: response.data.message}]
            }]);
        }catch(err){
            console.log('Error: ',err);
            setMessage(prev => [...prev,{
                role: 'model',
                parts: [{text: 'Error from AI chatbot'}]
            }]);
        }
    }

    useEffect(() =>{
        messageEndRef.current?.scrollIntoView({behaviour: 'smooth'})
    }, [message]);
    return (
        <div className='flex flex-col border border-base-300 h-screen max-h-[85vh] min-h-[500px] p-3 '>
            <div>
                {message.map((msg,index) =>(
                    <div key={index}
                        className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}>
                        <div >
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef}/>
            </div>
            

            <form onSubmit={handleSubmit(onSubmit)} className='sticky bottom-0 p-4 bg-base-100 border-t'>
                <div className='flex items-center'>
                    <input type='text' placeholder='Ask me anything--->' className='border p-2 w-[90%] rounded-xl'
                        {...register('message', {required: true, minLength: 2})}
                    ></input>
                    <button type='submit' className='btn btn-primary ml-2' disabled={errors.message}>
                        <FiSend size={23}/>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChatAi;