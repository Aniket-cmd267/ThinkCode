import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod' 
import z from "zod"
import { NavLink } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { loginUser } from '../store/authSlice'
import { FiEyeOff,FiEye  } from "react-icons/fi";

const loginSchema= z.object({
    emailId: z.email(),
    password: z.string().min(3,"Password must be atleast 3 characters")
})

function Login(){

    const [showPassword, setShowPassword]= useState(false);

    const passwordSet= () =>{
        if(!showPassword){
            setShowPassword(true);
        }
        else{
            setShowPassword(false);
        }
    }
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const { register, handleSubmit, formState: {errors}}= useForm({resolver: zodResolver(loginSchema)});
    const submitHandler= (data)=>{
        dispatch(loginUser(data))
    }

    const {isAuthenticated, loading, error} = useSelector((state) => state.slice1)
    useEffect(() =>{
        if(isAuthenticated){
            navigate('/');
        }
    },[isAuthenticated]);
    return (
        <div className='flex justify-center items-center p-4 min-h-screen'>
            <div className='card w-96 shadow-xl bg-base-100'>
                <div className='card-body'>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div className='form-control mt-4'>
                            <label className="label mb-1">
                                <span className="label-text">Email</span>
                            </label>
                            <input type='email' placeholder='Enter email' {...register('emailId')} className='input input-bordered input-md'/>
                            {errors.emailid && (<span className='text-error'>{errors.emailId.message}</span>)}
                        </div>

                        <div className='form-control mt-4'>
                            <label className="label mb-1">
                                <span className="label-text">Password</span>
                            </label>
                            <div className='flex justify-between items-center gap-2'>
                                <input type={showPassword ? 'text' :'password'} placeholder='Enter password' {...register('password')} className='input input-bordered input-md'/>
                                {errors.password && (<span className='text-error'>{errors.password.message}</span>)}
                                {
                                    showPassword ? <FiEye className='text-xl' onClick={passwordSet}/> : <FiEyeOff className='text-xl' onClick={passwordSet}/>
                                }
                            </div>
                        </div>

                        <div className='flex justify-center mt-4'>
                            <button type="submit" className='btn btn-primary py-1 px-5'>Login</button>
                        </div>   
                        <div className="text-center mt-6">
                            <span className="text-sm">
                            Don't have an account?{' '} {/* Adjusted text slightly */}
                            <NavLink to="/signup" className="link link-primary">
                                Sign Up
                            </NavLink>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;