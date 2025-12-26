import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import axiosClient from '../utils/axiosClient';
import UpdateProblem from './UpdateProblem';



export default function AdminUpdate() {
  const [problems, setProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    }
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;

    return difficultyMatch && tagMatch;
  });

  const handleUpdate= (problem) =>{
    console.log(problem)
    
  }
  return (
    <div className='min-h-screen p-6 bg-neutral-900'>
      <h1 className='text-center font-bold text-accent text-shadow-accent mb-10'>UPDATE PROBLEM</h1>
        <div>
          <div className="grid gap-4">
            {filteredProblems.map(problem => (
              <div key={problem._id} className="card bg-base-100 shadow-xl rounded-4xl">
                <div className="card-body ">
                  <div className="flex items-center justify-between">
                    <h2 className="card-title">{problem.title}</h2>
                  </div>
                  <div className="flex gap-2">
                    <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </div>
                    <div className="badge badge-info">
                      {problem.tags}
                    </div>
                  </div>
                  <NavLink to={`/admin/update/${problem._id}`}>
                    <button className='btn btn-warning w-20 rounded-xl' onClick={()=>handleUpdate(problem)}>Update</button>
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};