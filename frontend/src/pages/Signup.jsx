import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod';

// schema Validation for signup form
const signupSchema= z.object({
    firstName: z.string().min(3, "Name must contain atleast contain 3 characters"),
    email: z.email("Invalid Email"),
    password: z.string().min(8,"Password must contain atleast 8 characters")
})

//  errors= {
//     firstName : {
            // type: min,
            // message: ""
    // }
// }
function Signup(){
    const {
                register,
                handleSubmit,
                formState: { errors },
    } = useForm({resolver: zodResolver(signupSchema)});
    
    const submitHandler = (data) => {
        console.log(data);
    }
    return (
        <div className='flex justify-center items-center min-h-screen p-4'>
            <div className='card w-96 shadow-xl bg-base-100'>
                <div className='card-body'>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <div className='form-control mt-4'>
                            <label className="label mb-1">
                                <span className="label-text">First Name</span>
                            </label>
                            <input {...register('firstName')} placeholder='Enter your firstName' className='input input-bordered input-md'/>
                            {errors.firstName && (<span className='text-error'>{errors.firstName.message}</span>)}
                        </div>
                        <div className='form-control mt-4'>
                            <label className='label mb-1'>
                                <span className='label-text'>Email</span>
                            </label>
                            <input {...register('email')} placeholder= 'Enter your Email' className='input input-md'/>
                            {errors.email && (<span className='text-error'>{errors.email.message}</span>)}
                        </div>
                        <div className='form-control mt-4'>
                            <label className='label mb-1'>
                                <span className='label-text'>Password</span>
                            </label>
                            <input {...register('password')} placeholder= 'Enter your password' type="password" className='input input-md'/>
                            {errors.password && (<span className='text-error'>{errors.password.message}</span>)}
                        </div>
                        <div className='flex justify-center mt-4'>
                            <button type="submit" className='btn btn-primary py-1 px-5'>Sign Up</button>
                        </div>
                    </form>
                </div>
                    
            </div>
            
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