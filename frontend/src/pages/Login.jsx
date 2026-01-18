import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod' 
import z from "zod"
import { NavLink } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { loginUser } from '../store/authSlice'
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiLock, FiMail, FiShield } from 'react-icons/fi';

const loginSchema = z.object({
    emailId: z.email("Invalid email address"),
    password: z.string().min(3, "Password must be at least 3 characters")
});

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const passwordSet = () => setShowPassword(!showPassword);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const { isAuthenticated, loading, error } = useSelector((state) => state.slice1);

    const submitHandler = (data) => {
        dispatch(loginUser(data));
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

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
                    <h1 className="text-3xl text-white mt-2 font-bold">Login to ThinkCode</h1>
                </div>

                <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
                    
                    <div className='form-control w-full'>
                        <label className="label py-1">
                            <span className="text-xs font-mono uppercase tracking-widest text-[#F87171]">Email Address</span>
                        </label>
                        <div className="relative group">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#EF4444] transition-colors" />
                            <input 
                                type='email' 
                                autoComplete="username"
                                placeholder='developer@thinkcode.io' 
                                {...register('emailId')} 
                                className={`w-full bg-[#1A0A0A]/60 border ${errors.emailId ? 'border-error' : 'border-white/10'} rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#EF4444]/50 transition-all`}
                            />
                        </div>
                        {errors.emailId && <span className='text-error text-xs mt-1 ml-1'>{errors.emailId.message}</span>}
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

                    {/* {error && <div className="text-error text-center text-sm bg-error/10 py-2 rounded-lg">{error}</div>} */}

                    <div className='pt-2'>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full btn border-none bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-[#EF4444]/20 ${loading ? 'loading' : ''}`}
                        >
                            {loading ? 'Authenticating...' : 'Login'}
                        </button>
                    </div>

                    {/* Footer Links */}
                    <div className="text-center mt-6">
                        <span className="text-gray-500 text-sm">
                            Don't have an account?{' '}
                            <NavLink to="/signup" className="text-[#F87171] font-bold hover:underline underline-offset-4">
                                Sign Up
                            </NavLink>
                        </span>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default Login;