import { Outlet } from "react-router"
import { NavLink } from "react-router"
import { useSelector } from "react-redux"
import { logoutUser } from '../store/authSlice';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
export default function Profile() {
    const navigate= useNavigate();
    const dispatch= useDispatch();
    const {user} = useSelector((state) => state.slice1)
    const handleLogout= () =>{
        dispatch(logoutUser());
    }
    const switchToAdminPanel =() => {
        navigate('/admin')
    }   
    return (
        <>
            <nav className="navbar bg-base-100 shadow-lg px-4">
                <div className="flex-1">
                    <NavLink to="/" className="btn btn-ghost text-xl">LeetCode</NavLink>
                </div>
                <div className="flex-none gap-4">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="btn btn-ghost">
                            {user?.firstName}
                        </div>
                        <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            {user?.role === 'admin' ?
                                (<li><button onClick={switchToAdminPanel}>Access Admin</button></li>) :
                                (<></>)
                            }
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    )
}