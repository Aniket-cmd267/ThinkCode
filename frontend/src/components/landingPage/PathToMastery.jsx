import { Check, Code, Sword, Target, Trophy, Zap } from "lucide-react";

export default function PathToMastery() {
  const steps = [
    {
      number: 1,
      title: "AI Problems",
      subtitle: "Choose a Track",
      description: "Follow a personalized track created based on learning intuitive pattern",
      icon: Zap,
      color: "from-[#EF4444] to-[#DC2626]",
      status: "active",
      badge: "Current"
    },
    {
      number: 2,
      title: "Arenas",
      subtitle: "Solve AI-Assisted Problems",
      description: "Combine internalized prioritized learning toward real-time contest",
      icon: Code,
      color: "from-[#F87171] to-[#EF4444]",
      status: "upcoming",
      badge: null
    },
    {
      number: 3,
      title: "Interview",
      subtitle: "Compete in Weekly Arenas",
      description: "Simulation interview environments across major companies",
      icon: Sword,
      color: "from-[#EF4444]/70 to-[#DC2626]/70",
      status: "upcoming",
      badge: null
    },
    {
      number: 4,
      title: "Ace the Interview",
      subtitle: "Land Your Dream Job",
      description: "Use your skills and ThinkCode certificate to ace interviews",
      icon: Trophy,
      color: "from-[#EF4444]/50 to-[#DC2626]/50",
      status: "locked",
      badge: null
    }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#1A0A0A] via-[#120505] to-[#000000] px-4 py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#261212] border border-[#EF4444]/20 px-4 py-2 rounded-full mb-6">
            <Target className="w-4 h-4 text-[#F87171]" />
            <span className="text-[#F87171] text-sm font-semibold">Your Journey</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Path to Mastery
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Create a comprehensive track toward learning intuitive software
          </p>
        </div>

        {/* Track Label */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between bg-[#261212] border border-[#EF4444]/20 rounded-xl p-4">
            <span className="text-gray-400 text-sm">Your Current Track</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></div>
              <span className="text-white font-bold">Data Structures & Algorithms</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto relative">
          
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#EF4444] via-[#EF4444]/50 to-[#EF4444]/20"></div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex gap-6">
                
                {/* Icon Circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg ${
                    step.status === 'active' ? 'ring-4 ring-[#EF4444]/30 animate-pulse' : ''
                  }`}>
                    {step.status === 'locked' ? (
                      <div className="text-white text-2xl">🔒</div>
                    ) : step.status === 'completed' ? (
                      <Check className="w-8 h-8 text-white" />
                    ) : (
                      <step.icon className="w-8 h-8 text-white" />
                    )}
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#1A0A0A] border-2 border-[#EF4444] rounded-full flex items-center justify-center">
                    <span className="text-[#F87171] text-xs font-bold">{step.number}</span>
                  </div>
                </div>

                {/* Content Card */}
                <div className={`flex-1 bg-[#261212] border rounded-xl p-6 transition-all duration-300 ${
                  step.status === 'active' 
                    ? 'border-[#EF4444]/40 shadow-xl shadow-[#EF4444]/10' 
                    : 'border-[#EF4444]/20 hover:border-[#EF4444]/30'
                } ${step.status === 'locked' ? 'opacity-60' : ''}`}>
                  
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                        {step.badge && (
                          <span className="bg-[#EF4444] text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                            {step.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[#F87171] font-semibold mb-2">{step.subtitle}</p>
                    </div>

                    {/* Progress Indicator */}
                    {step.status === 'active' && (
                      <div className="text-right">
                        <div className="text-white text-2xl font-bold">67%</div>
                        <div className="text-gray-400 text-xs">Complete</div>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-400 mb-4">{step.description}</p>

                  {/* Progress Bar for Active Step */}
                  {step.status === 'active' && (
                    <div className="mb-4">
                      <div className="w-full bg-[#1A0A0A] rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#EF4444] to-[#F87171] h-full rounded-full" style={{ width: '67%' }}></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>23 of 34 problems solved</span>
                        <span>11 remaining</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    step.status === 'active'
                      ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-lg shadow-[#EF4444]/20'
                      : step.status === 'locked'
                      ? 'bg-[#1A0A0A] text-gray-600 cursor-not-allowed'
                      : 'bg-[#1A0A0A] hover:bg-[#EF4444]/10 text-gray-300 border border-[#EF4444]/20'
                  }`} disabled={step.status === 'locked'}>
                    {step.status === 'active' ? 'Continue Learning' : 
                     step.status === 'locked' ? 'Locked' : 'Start Soon'}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Bottom Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
          <div className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">156</div>
            <div className="text-gray-400 text-sm">Problems Solved</div>
          </div>
          
          <div className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-[#F87171] mb-1">67%</div>
            <div className="text-gray-400 text-sm">Track Progress</div>
          </div>
          
          <div className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">12</div>
            <div className="text-gray-400 text-sm">Days Streak</div>
          </div>
          
          <div className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">4.8</div>
            <div className="text-gray-400 text-sm">Avg. Rating</div>
          </div>
        </div>

      </div>
    </section>
  );
}