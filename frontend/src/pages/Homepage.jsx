import { useEffect, useState } from 'react';
import { NavLink,useNavigate } from 'react-router'; // Fixed import
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../store/authSlice';

function Homepage() {
  const navigate= useNavigate();
  const dispatch= useDispatch();
  const {user} = useSelector((state) => state.slice1)
  const handleLogout= () =>{
    dispatch(logoutUser());
  }
  
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });
  const switchToAdminPanel =() => {
      navigate('/admin')
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
              {user?.role==='admin' ? 
              (<li><button onClick={switchToAdminPanel}>Access Admin</button></li>) : 
              (<></>)  
              }
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

      <div className="grid gap-4">
          {filteredProblems.map(problem => (
            <div key={problem._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h2 className="card-title">
                    <NavLink to={`/problem/${problem._id}`} className="hover:text-primary">
                      {problem.title}
                    </NavLink>
                  </h2>
                  {solvedProblems.some(sp => sp._id === problem._id) && (
                    <div className="badge badge-success gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>
                            
                <div className="flex gap-2">
                  <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </div>
                  <div className="badge badge-info">
                    {problem.tags}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};
export default Homepage;