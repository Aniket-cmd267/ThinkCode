import { Trophy, Flame, Users, Clock, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function CompetitionArena() {
  const [liveUsers, setLiveUsers] = useState([
    { name: "Kevin", avatar: "K", score: 1340, rank: 1, status: "solving", trend: "up" },
    { name: "Raven", avatar: "R", score: 1298, rank: 2, status: "solving", trend: "up" },
    { name: "Sophia", avatar: "S", score: 1267, rank: 3, status: "idle", trend: "same" },
    { name: "Miguel", avatar: "M", score: 1245, rank: 4, status: "solving", trend: "down" },
    { name: "Olivia", avatar: "O", score: 1201, rank: 5, status: "idle", trend: "up" },
  ]);

  const [selectedUser, setSelectedUser] = useState(3); // Sophia selected by default

  // Generate activity heatmap data (like GitHub contributions)
  const generateHeatmap = () => {
    const weeks = 12;
    const days = 7;
    const heatmapData = [];
    
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < days; day++) {
        const intensity = Math.floor(Math.random() * 5); // 0-4 intensity levels
        heatmapData.push({
          week,
          day,
          intensity,
          count: intensity * 3 // Rough count of problems solved
        });
      }
    }
    return heatmapData;
  };

  const heatmapData = generateHeatmap();

  // Get color based on intensity
  const getHeatmapColor = (intensity) => {
    const colors = [
      'bg-[#1A0A0A]', // No activity
      'bg-[#EF4444]/20', // Low
      'bg-[#EF4444]/40', // Medium
      'bg-[#EF4444]/60', // High
      'bg-[#EF4444]', // Very high
    ];
    return colors[intensity];
  };

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => prev.map(user => ({
        ...user,
        status: Math.random() > 0.3 ? "solving" : "idle"
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#1A0A0A] via-[#120505] to-[#000000] px-4 py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#261212] border border-[#EF4444]/20 px-4 py-2 rounded-full mb-6">
            <Trophy className="w-4 h-4 text-[#F87171]" />
            <span className="text-[#F87171] text-sm font-semibold">Live Competition</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Competition Arena
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Live leaderboard and real-time tracking activity. Compete with developers worldwide.
          </p>
        </div>

        {/* Main Arena Container */}
        <div className="bg-[#261212] border border-[#EF4444]/20 rounded-2xl p-8 shadow-2xl">
          
          {/* Arena Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#EF4444]/10">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Live Leaderboard</h3>
              <p className="text-gray-400 text-sm">Updated every 30 seconds</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#1A0A0A] px-4 py-2 rounded-lg border border-[#EF4444]/20">
                <Users className="w-4 h-4 text-[#F87171]" />
                <span className="text-white font-semibold">2,847</span>
                <span className="text-gray-400 text-sm">online</span>
              </div>
              
              <div className="flex items-center gap-2 bg-[#1A0A0A] px-4 py-2 rounded-lg border border-[#EF4444]/20">
                <Flame className="w-4 h-4 text-[#F87171]" />
                <span className="text-white font-semibold">Live</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left: Leaderboard */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4 px-4">
                <span>Rank</span>
                <span className="flex-1 ml-16">Developer</span>
                <span>Score</span>
                <span className="w-16 text-center">Status</span>
              </div>

              {liveUsers.map((user, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedUser(index)}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedUser === index 
                      ? 'bg-[#EF4444]/10 border border-[#EF4444]/30' 
                      : 'bg-[#1A0A0A]/50 border border-[#EF4444]/10 hover:border-[#EF4444]/20'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center gap-4 w-24">
                    <span className={`text-lg font-bold ${
                      user.rank === 1 ? 'text-yellow-500' :
                      user.rank === 2 ? 'text-gray-400' :
                      user.rank === 3 ? 'text-orange-600' :
                      'text-gray-500'
                    }`}>
                      #{user.rank}
                    </span>
                    
                    {/* Trend indicator */}
                    <div className="w-4">
                      {user.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                      {user.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
                    </div>
                  </div>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center text-white font-bold">
                      {user.avatar}
                    </div>
                    <span className="text-white font-semibold">{user.name}</span>
                  </div>

                  {/* Score */}
                  <div className="text-[#F87171] font-bold text-lg mr-8">
                    {user.score}
                  </div>

                  {/* Status Badge */}
                  <div className="w-20">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'solving' 
                        ? 'bg-[#EF4444] text-white animate-pulse' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {user.status === 'solving' ? 'Solving' : 'Idle'}
                    </span>
                  </div>
                </div>
              ))}

              {/* View More */}
              <button className="w-full py-3 bg-[#1A0A0A]/50 border border-[#EF4444]/20 rounded-xl text-gray-400 hover:text-white hover:border-[#EF4444]/40 transition-all duration-300">
                View Full Leaderboard
              </button>
            </div>

            {/* Right: Activity Heatmap */}
            <div className="bg-[#1A0A0A]/30 rounded-xl p-6 border border-[#EF4444]/10">
              <div className="mb-6">
                <h4 className="text-white font-bold mb-1">Activity Heatmap</h4>
                <p className="text-gray-400 text-xs">
                  {liveUsers[selectedUser]?.name}'s practice intensity
                </p>
              </div>

              {/* Heatmap Grid */}
              <div className="mb-6">
                <div className="grid grid-cols-12 gap-1">
                  {heatmapData.map((cell, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-sm ${getHeatmapColor(cell.intensity)} border border-[#EF4444]/10 hover:border-[#EF4444]/50 transition-all cursor-pointer group relative`}
                      title={`${cell.count} problems`}
                    >
                      {/* Tooltip on hover */}
                      <div className="hidden group-hover:block absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black px-2 py-1 rounded text-xs text-white whitespace-nowrap z-10">
                        {cell.count} solved
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`w-3 h-3 rounded-sm ${getHeatmapColor(level)}`}
                      ></div>
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#261212] rounded-lg border border-[#EF4444]/10">
                  <span className="text-gray-400 text-sm">Current Streak</span>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-white font-bold">47 days</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#261212] rounded-lg border border-[#EF4444]/10">
                  <span className="text-gray-400 text-sm">This Week</span>
                  <span className="text-white font-bold">23 problems</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#261212] rounded-lg border border-[#EF4444]/10">
                  <span className="text-gray-400 text-sm">Total Solved</span>
                  <span className="text-[#F87171] font-bold">342</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Action */}
          <div className="mt-8 pt-6 border-t border-[#EF4444]/10 text-center">
            <button className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-[#EF4444]/20 inline-flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Join Weekly Contest
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}