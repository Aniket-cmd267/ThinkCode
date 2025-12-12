
function Homepage(){
    return (
        <div className="min-h-screen bg-base-300 text-base-content font-sans selection:bg-primary selection:text-primary-content bg-[#000000]">
      
      {/* Navbar */}
      <div className="navbar bg-base-100/50 backdrop-blur-lg sticky top-0 z-50 border-b border-white/5">
        <div className="flex-1 px-4">
          <a className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary cursor-pointer">
            CODEPULSE
          </a>
        </div>
        <div className="flex-none gap-4">
          <ul className="menu menu-horizontal px-1 font-medium hidden md:flex">
            <li><a>Problems</a></li>
            <li><a>Leaderboard</a></li>
            <li><a>Contests</a></li>
          </ul>
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-circle avatar border border-white/10">
              <div className="w-10 rounded-full">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="profile" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero py-20 bg-base-300 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <div className="badge badge-outline badge-secondary mb-4 p-4 gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              New Weekly Challenge Live
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              Master the <span className="italic underline decoration-primary underline-offset-8">Algorithm.</span>
            </h1>
            <p className="text-lg opacity-70 mb-10 leading-relaxed">
              Ditch the generic clones. Experience a streamlined environment built for high-performance engineers to sharpen their logical edge.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="btn btn-primary btn-wide shadow-lg shadow-primary/20">Start Solving</button>
              <button className="btn btn-outline btn-wide border-white/10 hover:bg-white/5">Explore Track</button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Dashboard Snippet */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recommended For You</h2>
              <div className="tabs tabs-boxed bg-base-100 border border-white/5">
                <a className="tab tab-active">Daily</a>
                <a className="tab">Hard</a>
                <a className="tab">Arrays</a>
              </div>
            </div>

            {/* Problem Cards */}
            {[
              { title: "Invert Binary Tree", diff: "Easy", color: "text-success", solve: "85%" },
              { title: "LRU Cache Architecture", diff: "Hard", color: "text-error", solve: "12%" },
              { title: "Rotate Image Matrix", diff: "Medium", color: "text-warning", solve: "44%" }
            ].map((prob, i) => (
              <div key={i} className="group card card-side bg-base-100 border border-white/5 hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-sm">
                <div className="card-body p-6 flex-row items-center justify-between">
                  <div>
                    <h3 className="card-title text-lg group-hover:text-primary transition-colors">{prob.title}</h3>
                    <div className="flex gap-3 mt-1 text-sm opacity-60 font-medium">
                      <span className={prob.color}>{prob.diff}</span>
                      <span>•</span>
                      <span>Success Rate: {prob.solve}</span>
                    </div>
                  </div>
                  <button className="btn btn-square btn-ghost group-hover:bg-primary group-hover:text-primary-content">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="card bg-gradient-to-br from-neutral to-base-200 border border-white/5 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-sm uppercase tracking-widest opacity-50">Your Activity</h2>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="stats shadow bg-base-300">
                    <div className="stat">
                      <div className="stat-title">Problems Solved</div>
                      <div className="stat-value text-primary">124</div>
                      <div className="stat-desc text-secondary font-bold">Top 5% this month</div>
                    </div>
                  </div>
                  <div className="radial-progress text-primary mx-auto" style={{"--value":70, "--size": "10rem"}} role="progressbar">
                    70% Goal
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 border border-white/5">
              <div className="card-body">
                <h2 className="card-title">Recent Contests</h2>
                <div className="alert bg-base-300 border-none mt-2">
                  <div>
                    <h3 className="font-bold text-sm">Global Round #42</h3>
                    <div className="text-xs opacity-60">Starts in 2h 45m</div>
                  </div>
                  <button className="btn btn-sm btn-secondary">Register</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Homepage;