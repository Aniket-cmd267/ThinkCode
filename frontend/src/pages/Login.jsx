import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod' 
import z from "zod"
import {Link} from 'react-router'

const loginSchema= z.object({
    email: z.email(),
    password: z.string().min(3,"Password must be atleast 3 characters")
})

function Login(){
    
    const { register, handleSubmit, formState: {errors}}= useForm({resolver: zodResolver(loginSchema)});
    const submitHandler= (data)=>{
        console.log(data)
    }
    return (
        <div className='flex justify-center items-center p-4 min-h-screen'>
            <div className='card w-96 shadow-xl bg-base-100'>
                <div className='card-body'>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div className='form-control mt-4'>
                            <label className="label mb-1">
                                <span className="label-text">Email</span>
                            </label>
                            <input type='email' placeholder='Enter email' {...register('email')} className='input input-bordered input-md'/>
                            {errors.email && (<span className='text-error'>{errors.email.message}</span>)}
                        </div>

                        <div className='form-control mt-4'>
                            <label className="label mb-1">
                                <span className="label-text">Password</span>
                            </label>
                            <input type='password' placeholder='Enter password' {...register('password')} className='input input-bordered input-md'/>
                            {errors.password && (<span className='text-error'>{errors.password.message}</span>)}
                        </div>

                        <div className='flex justify-center mt-4'>
                            <button type="submit" className='btn btn-primary py-1 px-5'>Sign Up</button>
                        </div>   
                        <div>
                            <Link to="/signup">
                                <p>Don't have an account SignUp</p>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;