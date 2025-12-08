import { useState } from "react";
import { useForm } from 'react-hook-form';
function Signup(){
    // const [name, setName] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
     /*    validation (Frontend mein validation krenge taaki server pe baar baar call naa krna padhe aur uspe load naa ho aur slow bhi hogaa)
            toh phir backend mein kyu validate kregaa kyuki postman k through bhi possible h aur validation nhi hogaa toh kuch bhi data transfer ho skta h 
            form ko submit kar denge
            Backend submit  */
    // const submitHandler= (e) =>{ 
    //     e.preventDefault();
    //     console.log(name,email,password);
    // }

    const {
                register,
                handleSubmit,
                formState: { errors },
    } = useForm();

    const submitHandler = (data) => {
        console.log(data);
    }
    return (
       
        // <form onSubmit={submitHandler}>
        //     <input type='text' placeholder="Enter your name" value={name} onChange={()=> setName(value)}></input>
        //     <input type='email' placeholder="Enter your email" value={email} onChange={()=> setEmail(value)}></input>
        //     <input type='password' placeholder="Enter your password" value={password} onChange={()=> setPassword(value)}></input>
        // </form>

        // { using react hook form}
        //  Yahha pe 'firstName' property h value nhii 
        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col justify-center align-items">
            <input {...register('firstName')} placeholder='Enter your firstName'/>
            <input {...register('email')} placeholder= 'Enter your Email'/>
            <input {...register('password')} placeholder= 'Enter your password'/>
            <button type="submit">Submit</button>
        </form>
    )
}
export default Signup;