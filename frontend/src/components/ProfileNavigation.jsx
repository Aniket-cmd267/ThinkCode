import { Outlet } from "react-router";
import { NavLink, Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { useNavigate } from "react-router";
import {
  Terminal,
  Search, 
  Bell,
  MoonStar,
  User,
  Shield,
  LogOut,
  LayoutGrid,
  Trophy,
  BarChart2,
  MessageCircle
} from "lucide-react";

export default function ProfileNavigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.slice1);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const switchToAdminPanel = () => {
    navigate("/admin");
  };

  const isAuthenticated = !!user;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#261212]/80 backdrop-blur-md border-b border-[#F87171]/20 shadow-[0_18px_55px_rgba(0,0,0,0.85)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* LEFT: BRAND */}
          <div className="flex items-center gap-2">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="bg-[#EF4444] p-2 rounded-xl shadow-[0_0_25px_rgba(248,113,113,0.7)] transform transition-transform group-hover:scale-110">
                <Terminal size={20} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-wide text-white font-sans">
                Think<span className="text-[#EF4444]">Code</span>
              </span>
            </NavLink>
          </div>

          {/* CENTER: MAIN NAV LINKS */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {[
              { to: "/problem", label: "Problems", icon: LayoutGrid },
              { to: "/contest", label: "Contests", icon: Trophy },
              { to: "/interview", label: "Interview", icon: BarChart2 },
              { to: "/discuss", label: "Discuss", icon: MessageCircle }
            ].map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "relative flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase transition-all",
                    "hover:text-[#EF4444] text-slate-300",
                    isActive ? "text-[#EF4444]" : "text-slate-400"
                  ].join(" ")
                }
              >
                <Icon size={16} className="text-[#F87171]/80" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* RIGHT: TOOLS + AUTH / PROFILE */}
          <div className="flex items-center gap-3">
            {/* ICON TOOLS */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                className="h-9 w-9 rounded-full border border-[#F87171]/25 bg-[#120505]/70 flex items-center justify-center text-[#F87171]/80 hover:text-[#EF4444] hover:border-[#EF4444]/60 hover:bg-[#1A0A0A] transition-all shadow-[0_0_12px_rgba(248,113,113,0.35)]"
              >
                <Search size={16} />
              </button>
              <button
                type="button"
                className="h-9 w-9 rounded-full border border-[#F87171]/25 bg-[#120505]/70 flex items-center justify-center text-[#F87171]/80 hover:text-[#EF4444] hover:border-[#EF4444]/60 hover:bg-[#1A0A0A] transition-all shadow-[0_0_12px_rgba(248,113,113,0.35)]"
              >
                <Bell size={16} />
              </button>
              <button
                type="button"
                className="h-9 w-9 rounded-full border border-[#F87171]/25 bg-[#120505]/70 flex items-center justify-center text-[#F87171]/80 hover:text-[#EF4444] hover:border-[#EF4444]/60 hover:bg-[#1A0A0A] transition-all shadow-[0_0_16px_rgba(248,113,113,0.45)]"
              >
                <MoonStar size={16} />
              </button>
            </div>

            {/* AUTH / PROFILE AREA */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 border border-white/10 bg-[#120505]/70 hover:border-[#F87171]/40 hover:text-white transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-[0.24em] bg-[#EF4444] text-white shadow-[0_0_28px_rgba(248,113,113,0.8)] hover:bg-[#f05252] active:scale-95 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  className="btn btn-ghost h-10 min-h-0 px-2 sm:px-4 rounded-2xl border border-transparent hover:border-[#EF4444]/40 hover:bg-[#120505]/80 flex items-center gap-2 transition-all shadow-[0_0_18px_rgba(248,113,113,0.35)]"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#EF4444] to-[#F87171] flex items-center justify-center text-white font-semibold text-xs shadow-[0_0_22px_rgba(248,113,113,0.8)]">
                    {user?.firstName?.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-slate-100 text-sm font-medium">
                    {user?.firstName}
                  </span>
                </div>

                <ul
                  tabIndex={0}
                  className="mt-4 p-2 shadow-2xl menu menu-sm dropdown-content bg-[#120505]/95 border border-[#F87171]/25 rounded-2xl w-60 backdrop-blur-xl z-[100]"
                >
                  <div className="px-4 py-3 border-b border-white/5 mb-2">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#F87171] font-semibold">
                      User Account
                    </p>
                    <p className="text-white font-medium truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>

                  <li>
                    <NavLink
                      to="/profile"
                      className="flex items-center gap-3 py-2.5 text-slate-200 hover:bg-[#EF4444]/10 hover:text-white transition-colors"
                    >
                      <User size={16} className="text-[#F87171]" />
                      Profile
                    </NavLink>
                  </li>

                  {user?.role === "admin" && (
                    <li>
                      <button
                        onClick={switchToAdminPanel}
                        className="flex items-center gap-3 py-2.5 text-slate-200 hover:bg-[#EF4444]/10 hover:text-white transition-colors"
                      >
                        <Shield size={16} className="text-[#F87171]" />
                        Access Admin
                      </button>
                    </li>
                  )}

                  <li className="mt-2 border-t border-white/5 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 py-2.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all font-semibold"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-[#000000]">
        <Outlet />
      </main>
    </>
  );
}