import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../store/authSlice';
function Homepage() {
  const dispatch= useDispatch();
  const {user} = useSelector((state) => state.slice1)
  const handleLogout= () =>{
    dispatch(logoutUser());
  }
  return (
    <div className="min-h-screen bg-base-200">
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
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="form-control">
            <label className="label hidden">Problem set</label>
            <select className="select select-bordered w-48">
              <option>All Problems</option>
              <option>Solved Problems</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label hidden">Difficulty</label>
            <select className="select select-bordered w-40">
              <option>All Difficulties</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label hidden">Tags</label>
            <select className="select select-bordered w-56">
              <option>All tags</option>
              <option>Array</option>
              <option>LinkedList</option>
              <option>String</option>
              <option>Trees</option>
              <option>Graph</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label hidden">Search</label>
            <input type="text" placeholder="Search problems..." className="input input-bordered w-64" />
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-primary">Apply</button>
            <button className="btn btn-ghost">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Homepage;