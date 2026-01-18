import React from 'react';
import { 
  Brain, Code2, Sword, Trophy, Users, Zap, Target, Globe, 
  MessageSquare, BarChart3, Shield, Layers 
} from "lucide-react";

export default function FeatureGrid() {
  const features = [
    {
      title: "AI Debugger",
      description: "Intelligent debugging that understands your code context and suggests fixes before you even ask.",
      icon: Brain,
      size: "medium",
      stats: "99.2% accuracy",
      gradient: "from-[#EF4444]/20 to-[#DC2626]/10"
    },
    // {
    //   title: "1v1 Battle Arena",
    //   description: "Compete head-to-head with developers worldwide. Real-time coding battles with live leaderboards.",
    //   icon: Sword,
    //   size: "large",
    //   stats: "10K+ daily battles",
    //   gradient: "from-[#F87171]/20 to-[#EF4444]/10"
    // },
    {
      title: "AI Code Review",
      description: "Get instant feedback on code quality, performance, and best practices.",
      icon: MessageSquare,
      size: "medium",
      gradient: "from-[#EF4444]/10 to-transparent"
    },
    // {
    //   title: "Global Leaderboard",
    //   description: "Track your ranking against millions of developers.",
    //   icon: Trophy,
    //   size: "medium",
    //   gradient: "from-[#DC2626]/10 to-transparent"
    // },
    // {
    //   title: "Team Collaboration",
    //   description: "Code together in real-time with your team or study group.",
    //   icon: Users,
    //   size: "medium",
    //   gradient: "from-[#F87171]/10 to-transparent"
    // },
    {
      title: "3+ Languages",
      description: "JavaScript, C++, Java ",
      icon: Code2,
      size: "medium"
    },
    // {
    //   title: "Live Sessions",
    //   description: "Join live coding sessions with industry experts.",
    //   icon: Globe,
    //   size: "small"
    // },
    // {
    //   title: "Performance Analytics",
    //   description: "Deep insights into your coding patterns and progress.",
    //   icon: BarChart3,
    //   size: "small"
    // },
    {
      title: "Interview Prep",
      description: "Company-specific question sets from FAANG+.",
      icon: Target,
      size: "medium"
    },
    {
      title: "Smart Hints",
      description: "Progressive hints that don't spoil the solution.",
      icon: Zap,
      size: "medium"
    },
    // {
    //   title: "Secure IDE",
    //   description: "Enterprise-grade security for your code.",
    //   icon: Shield,
    //   size: "small"
    // },
    {
      title: "Custom Tracks",
      description: "Personalized learning paths based on your goals.",
      icon: Layers,
      size: "medium"
    }
  ];

  const largeFeatures = features.filter(f => f.size === "large");
  const mediumFeatures = features.filter(f => f.size === "medium");
  const smallFeatures = features.filter(f => f.size === "small");

  return (
    <section className="min-h-screen bg-linear-to-br from-[#1A0A0A] via-[#120505] to-[#000000] px-4 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#261212] border border-[#EF4444]/20 px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-[#F87171]" />
            <span className="text-[#F87171] text-sm font-semibold">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#EF4444] to-[#F87171]">
              Master Coding
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A complete ecosystem designed to transform you from a beginner to an interview-ready developer.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-4 auto-rows-fr">
          
          {/* Large Feature 1 */}
          {largeFeatures[0] && (
            <div className="col-span-12 md:col-span-6 md:row-span-2 bg-[#261212] border border-[#EF4444]/20 rounded-2xl p-8 hover:border-[#EF4444]/40 transition-all duration-300 group relative overflow-hidden">
              <div className={`absolute inset-0 bg-linear-to-br ${largeFeatures[0].gradient} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
              
              <div className="relative z-10">
                <div className="bg-[#EF4444]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {/* FIX: Use a capitalized variable for the icon component */}
                  {React.createElement(largeFeatures[0].icon, { className: "w-8 h-8 text-[#F87171]" })}
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-3">{largeFeatures[0].title}</h3>
                <p className="text-gray-400 mb-6 text-lg">{largeFeatures[0].description}</p>
                
                <div className="inline-flex items-center gap-2 bg-[#1A0A0A]/50 border border-[#EF4444]/30 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">{largeFeatures[0].stats}</span>
                </div>

                <div className="mt-8 p-4 bg-[#1A0A0A]/30 rounded-lg border border-[#EF4444]/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                    <span className="text-xs text-gray-500">Error detected on line 42</span>
                  </div>
                  <code className="text-xs text-gray-400">
                    <span className="text-[#EF4444]">- if (arr[i] = target)</span><br/>
                    <span className="text-emerald-400">+ if (arr[i] === target)</span>
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Large Feature 2 */}
          {largeFeatures[1] && (
            <div className="col-span-12 md:col-span-6 md:row-span-2 bg-[#261212] border border-[#EF4444]/20 rounded-2xl p-8 hover:border-[#EF4444]/40 transition-all duration-300 group relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${largeFeatures[1].gradient} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
              
              <div className="relative z-10">
                <div className="bg-[#EF4444]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {/* FIX: Use a capitalized variable for the icon component */}
                  {React.createElement(largeFeatures[1].icon, { className: "w-8 h-8 text-[#F87171]" })}
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-3">{largeFeatures[1].title}</h3>
                <p className="text-gray-400 mb-6 text-lg">{largeFeatures[1].description}</p>
                
                <div className="inline-flex items-center gap-2 bg-[#1A0A0A]/50 border border-[#EF4444]/30 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">{largeFeatures[1].stats}</span>
                </div>

                <div className="mt-8 space-y-2">
                  {[
                    { name: "You", score: 1247, rank: 1, active: true },
                    { name: "Player2", score: 1198, rank: 2 },
                    { name: "Player3", score: 1156, rank: 3 }
                  ].map((player, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${player.active ? 'bg-[#EF4444]/10 border border-[#EF4444]/30' : 'bg-[#1A0A0A]/30'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${player.active ? 'text-[#F87171]' : 'text-gray-500'}`}>#{player.rank}</span>
                        <span className={`text-sm ${player.active ? 'text-white' : 'text-gray-400'}`}>{player.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">{player.score} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Medium Features */}
          {mediumFeatures.map((feature, idx) => {
            const Icon = feature.icon; // FIX: Map to capitalized variable
            return (
              <div key={idx} className="col-span-12 md:col-span-4 bg-[#261212] border border-[#EF4444]/20 rounded-2xl p-6 hover:border-[#EF4444]/40 transition-all duration-300 group relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50 group-hover:opacity-70 transition-opacity`}></div>
                <div className="relative z-10">
                  <div className="bg-[#EF4444]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#F87171]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            );
          })}

          {/* Small Features */}
          {smallFeatures.map((feature, idx) => {
            const Icon = feature.icon; // FIX: Map to capitalized variable
            return (
              <div key={idx} className="col-span-6 md:col-span-3 bg-[#261212] border border-[#EF4444]/20 rounded-xl p-5 hover:border-[#EF4444]/40 transition-all duration-300 group">
                <div className="bg-[#EF4444]/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-[#F87171]" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">{feature.title}</h3>
                <p className="text-gray-400 text-xs">{feature.description}</p>
              </div>
            );
          })}

        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <button className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-lg shadow-[#EF4444]/20">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
}