import { Navigate } from "react-router"

export default function RouteNotExist(){

    return (
        <div className="flex justify-center items-center min-h-screen font=bold bg-neutral-950 text-5xl">
            <h1>404 Error Not Found</h1>
            <Navigate to='/login'></Navigate>        
        </div>
    )
}