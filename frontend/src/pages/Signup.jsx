import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod';
import {useNavigate, NavLink} from 'react-router'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { registerUser } from '../store/authSlice';
import {motion} from 'framer-motion';
import { FiEye, FiEyeOff, FiLock, FiMail, FiShield, FiUser  } from 'react-icons/fi';
// schema Validation for signup form
const signupSchema= z.object({
    firstName: z.string().min(3, "Name must contain atleast contain 3 characters"),
    emailId: z.email("Invalid Email"),
    password: z.string().min(8,"Password must contain atleast 8 characters").regex(/[!@#$%^&*(),.?":{}|<>]/,"Password must contain atleast one special character")
})

//  errors= {
//     firstName : {
            // type: min,
            // message: ""
    // }, 
    // email : {} ,
// }

function Signup(){
    const navigate= useNavigate();
    const dispatch= useDispatch();
    const [showPassword, setShowPassword]= useState(false);
    
    const passwordSet= () =>{
        if(!showPassword){
            setShowPassword(true);
        }
        else
            setShowPassword(false);
    }
    const {
                register,
                handleSubmit,
                formState: { errors },
    } = useForm({resolver: zodResolver(signupSchema)});
    
    const submitHandler = (data) => {
        dispatch(registerUser(data));
    }

    
    const {loading, isAuthenticated, error}= useSelector((state) => state.slice1)
    useEffect(() =>{
        if(isAuthenticated){
            navigate('/')
        }
    },[isAuthenticated]);
    
    return (
        <div className='min-h-screen flex justify-center items-center p-4 bg-linear-to-br from-[#1A0A0A] via-[#120505] to-[#000000] relative overflow-hidden'>
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#EF4444]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#EF4444]/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='w-full max-w-md bg-[#261212]/40 backdrop-blur-xl border border-[#EF4444]/20 rounded-3xl p-8 shadow-2xl z-10'
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 mb-4">
                        <FiShield className="text-2xl text-[#F87171]" />
                    </div>
                    <h1 className="text-3xl text-white mt-2 font-bold">SignUp to ThinkCode</h1>
                </div>

                <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
                    <div className='form-control w-full'>
                        <label className="label py-1">
                            <span className="text-xs font-mono uppercase tracking-widest text-[#F87171]">First Name</span>
                        </label>
                        <div className="relative group">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EF4444] transition-colors" />
                            <input {...register('firstName')} placeholder='developer' 
                            className={`w-full bg-[#1A0A0A]/60 border ${errors.firstName ? 'border-error' : 'border-white/10'} rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#EF4444]/50 transition-all`}/>
                        {errors.firstName && (<span className='text-error'>{errors.firstName.message}</span>)}
                        </div>
                    </div>
                    <div className='form-control w-full'>
                        <label className="label py-1">
                            <span className="text-xs font-mono uppercase tracking-widest text-[#F87171]">Email Address </span>
                        </label>
                        <div className="relative group">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EF4444] transition-colors" />
                            <input {...register('emailId')} placeholder='developer@thinkcode.io' autoComplete="username"
                            className={`w-full bg-[#1A0A0A]/60 border ${errors.emailId ? 'border-error' : 'border-white/10'} rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#EF4444]/50 transition-all`}/>
                        {errors.emailId && (<span className='text-error'>{errors.emailId.message}</span>)}
                        </div>
                        
                    </div>
                    
                    <div className='form-control w-full'>
                        <label className="label py-1">
                            <span className="text-xs font-mono uppercase tracking-widest text-[#F87171]">Access Key</span>
                        </label>
                        <div className="relative group">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EF4444] transition-colors" />
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder='••••••••' 
                                {...register('password')} 
                                className={`w-full bg-[#1A0A0A]/60 border ${errors.password ? 'border-error' : 'border-white/10'} rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-[#EF4444]/50 transition-all`}
                            />
                            <div 
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-white transition-colors"
                                onClick={passwordSet}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </div>
                        </div>
                        {errors.password && <span className='text-error text-xs mt-1 ml-1'>{errors.password.message}</span>}
                    </div>
                    
                        
                    <div className='pt-2'>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full btn border-none bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-[#EF4444]/20 ${loading ? 'loading' : ''}`}
                        >
                            {loading ? 'Authenticating...' : 'SignUp'}
                        </button>
                    </div>

                    {/* Footer Links */}
                    <div className="text-center mt-6">
                        <span className="text-gray-500 text-sm">
                            Already have an account?{' '}
                            <NavLink to="/login" className="text-[#F87171] font-bold hover:underline underline-offset-4">
                                Log in
                            </NavLink>
                        </span>
                    </div>
                </form>

            </motion.div>
            
            
        </div>
    )
}
export default Signup;

/* const [name, setName] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
     /*    validation (Frontend mein validation krenge taaki server pe baar baar call naa krna padhe aur uspe load naa ho aur slow bhi hogaa)
            toh phir backend mein kyu validate kregaa kyuki postman k through bhi possible h aur validation nhi hogaa toh kuch bhi data transfer ho skta h 
            form ko submit kar denge
            Backend submit  */
    // const submitHandler= (e) =>{ 
    //     e.preventDefault();
    //     console.log(name,email,password);
    // } */



    /*<form onSubmit={submitHandler}>
             <input type='text' placeholder="Enter your name" value={name} onChange={()=> setName(value)}></input>
             <input type='email' placeholder="Enter your email" value={email} onChange={()=> setEmail(value)}></input>
             <input type='password' placeholder="Enter your password" value={password} onChange={()=> setPassword(value)}></input>
        </form>

        { using react hook form}
      Yahha pe 'firstName' property h value nhii */