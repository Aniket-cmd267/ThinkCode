// import { Outlet } from "react-router"
// import { NavLink, Link } from "react-router"
// import { useSelector } from "react-redux"
// import { logoutUser } from '../store/authSlice';
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router";

// export default function ProfileNavigation(){
//     const navigate= useNavigate();
//     const dispatch= useDispatch();
//     const {user} = useSelector((state) => state.slice1)
//     const handleLogout= () =>{
//         dispatch(logoutUser());
//     }
//     const switchToAdminPanel =() => {
//         navigate('/admin')
//     }   
//     return (
//         <>
//             <nav className="navbar bg-base-100 shadow-lg px-4 flex justify-between">
//                 <div className="flex">
//                     <NavLink to="/" className="btn btn-ghost text-xl">ThinkCode</NavLink>
//                 </div>
//                 <div className="flex gap-6">
//                     <NavLink to='/problem'>
//                         <button>Problem</button>
//                     </NavLink>
//                     <NavLink to='/contest'>
//                         <button>Contest</button>
//                     </NavLink>
//                 </div>
//                 <div className="flex-none gap-4">
//                     <div className="dropdown dropdown-end">
//                         <div tabIndex={0} className="btn btn-ghost">
//                             {user?.firstName}
//                         </div>
//                         <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
//                             <NavLink to='/profile'>
//                                 <li><button>Profile</button></li>
//                             </NavLink>
//                             {user?.role === 'admin' ?
//                                 (<li><button onClick={switchToAdminPanel}>Access Admin</button></li>) :
//                                 (<></>)
//                             }
//                             <li><button onClick={handleLogout}>Logout</button></li>
//                         </ul>
//                     </div>
//                 </div>
//             </nav>
//             <Outlet />
//         </>
//     )
// }

import { Outlet } from "react-router"
import { NavLink, Link } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from '../store/authSlice';
import { useNavigate } from "react-router";
import { User, Shield, LogOut, Terminal, LayoutGrid, Trophy } from "lucide-react"; // Icons for a pro look

export default function ProfileNavigation() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.slice1)

    const handleLogout = () => {
        dispatch(logoutUser());
    }

    const switchToAdminPanel = () => {
        navigate('/admin')
    }

    return (
        <>
            <nav className="sticky top-0 z-50 w-full bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#EF4444]/20 px-6 py-2 shadow-2xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    
                    {/* LEFT: BRAND */}
                    <div className="flex items-center">
                        <NavLink to="/" className="flex items-center gap-2 group">
                            <div className="bg-[#EF4444] p-1.5 rounded-lg transition-transform group-hover:scale-110">
                                <Terminal size={20} className="text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white">
                                THINK<span className="text-[#EF4444]">CODE</span>
                            </span>
                        </NavLink>
                    </div>

                    {/* CENTER: NAVIGATION LINKS */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink 
                            to='/problem' 
                            className={({ isActive }) => 
                                `flex items-center gap-2 text-sm font-bold tracking-widest uppercase transition-all hover:text-[#EF4444] ${isActive ? 'text-[#EF4444]' : 'text-slate-400'}`
                            }
                        >
                            <LayoutGrid size={16} />
                            Problems
                        </NavLink>
                        <NavLink 
                            to='/contest' 
                            className={({ isActive }) => 
                                `flex items-center gap-2 text-sm font-bold tracking-widest uppercase transition-all hover:text-[#EF4444] ${isActive ? 'text-[#EF4444]' : 'text-slate-400'}`
                            }
                        >
                            <Trophy size={16} />
                            Contests
                        </NavLink>
                    </div>

                    {/* RIGHT: USER DROPDOWN */}
                    <div className="flex items-center gap-4">
                        <div className="dropdown dropdown-end">
                            <div 
                                tabIndex={0} 
                                className="btn btn-ghost hover:bg-[#EF4444]/10 border border-transparent hover:border-[#EF4444]/30 rounded-xl px-4 flex items-center gap-2 transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#EF4444] to-[#F87171] flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-[#EF4444]/20">
                                    {user?.firstName?.charAt(0)}
                                </div>
                                <span className="text-slate-200 font-mono text-sm hidden sm:inline">
                                    {user?.firstName}
                                </span>
                            </div>
                            
                            <ul 
                                tabIndex={0} 
                                className="mt-4 p-2 shadow-2xl menu menu-sm dropdown-content bg-[#120505] border border-[#EF4444]/20 rounded-2xl w-56 backdrop-blur-xl z-[100]"
                            >
                                <div className="px-4 py-3 border-b border-white/5 mb-2">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#F87171] font-bold">User Account</p>
                                    <p className="text-white font-medium truncate">{user?.firstName} {user?.lastName}</p>
                                </div>

                                <li>
                                    <NavLink to='/profile' className="flex items-center gap-3 py-3 hover:bg-[#EF4444]/10 text-slate-300 hover:text-white transition-colors">
                                        <User size={16} className="text-[#EF4444]" />
                                        Profile
                                    </NavLink>
                                </li>

                                {user?.role === 'admin' && (
                                    <li>
                                        <button 
                                            onClick={switchToAdminPanel} 
                                            className="flex items-center gap-3 py-3 hover:bg-[#EF4444]/10 text-slate-300 hover:text-white transition-colors"
                                        >
                                            <Shield size={16} className="text-[#EF4444]" />
                                            Access Admin
                                        </button>
                                    </li>
                                )}

                                <li className="mt-2 border-t border-white/5 pt-2">
                                    <button 
                                        onClick={handleLogout} 
                                        className="flex items-center gap-3 py-3 text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all font-bold"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="min-h-screen">
                <Outlet />
            </main>
        </>
    )
}