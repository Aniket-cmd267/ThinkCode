import { Bot, Send, Sparkles, User } from "lucide-react";
import { useState } from "react";

export default function AIMentorship() {
  const [messages] = useState([
    {
      type: "user",
      name: "User",
      avatar: "U",
      message: "Help, comparison with pointers!!! code (34561)",
      time: "2m ago",
      badge: null
    },
    {
      type: "ai",
      name: "AI",
      avatar: "AI",
      message: "Hi, here, fix because of one solution time complexity O(n²), one can trim strict array!",
      time: "2m ago",
      badge: "Optimized",
      codeSnippet: `// Instead of nested loops:
for (let i = 0; i < arr.length; i++) {
  for (let j = i + 1; j < arr.length; j++) {
    if (arr[i] === arr[j]) return true;
  }
}

// Use a Set for O(n):
const seen = new Set();
for (let num of arr) {
  if (seen.has(num)) return true;
  seen.add(num);
}`
    },
    {
      type: "user",
      name: "Marcus",
      avatar: "M",
      message: "Thanks",
      time: "1m ago",
      badge: null
    },
    {
      type: "user",
      name: "Ahmed",
      avatar: "A",
      message: "AI is conventional today! nice case study!",
      time: "Just now",
      badge: null
    },
    {
      type: "ai",
      name: "AI",
      avatar: "AI",
      message: "There are third-order need test the getting this child want set on seconds!",
      time: "Just now",
      badge: null
    },
    {
      type: "user",
      name: "Olivia",
      avatar: "O",
      message: "Thanks",
      time: "Just now",
      badge: null
    },
    {
      type: "user",
      name: "Vi-Fi",
      avatar: "V",
      message: "AI is same code!",
      time: "Just now",
      badge: null
    },
    {
      type: "user",
      name: "Jessica",
      avatar: "J",
      message: "Thanks",
      time: "Just now",
      badge: null
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#1A0A0A] via-[#120505] to-[#000000] px-4 py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#261212] border border-[#EF4444]/20 px-4 py-2 rounded-full mb-6">
            <Bot className="w-4 h-4 text-[#F87171]" />
            <span className="text-[#F87171] text-sm font-semibold">AI-Powered Support</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Mentorship
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Chat with mentors/AI. All message sentiment-based CONTEXT!
          </p>
        </div>

        {/* Chat Interface */}
        <div className="max-w-5xl mx-auto bg-[#261212] border border-[#EF4444]/20 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Chat Header */}
          <div className="bg-[#1A0A0A] border-b border-[#EF4444]/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">AI Mentor</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-400 text-sm">Always available</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#261212] px-4 py-2 rounded-lg border border-[#EF4444]/20">
                <Sparkles className="w-4 h-4 text-[#F87171]" />
                <span className="text-gray-300 text-sm">Smart Context</span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.type === 'ai' ? 'items-start' : 'items-start'}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                  msg.type === 'ai' 
                    ? 'bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white' 
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {msg.avatar}
                </div>

                {/* Message Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-sm">{msg.name}</span>
                    {msg.badge && (
                      <span className="bg-[#EF4444] text-white px-2 py-0.5 rounded text-xs font-semibold">
                        {msg.badge}
                      </span>
                    )}
                    <span className="text-gray-500 text-xs">{msg.time}</span>
                  </div>

                  {/* Message Bubble */}
                  <div className={`rounded-lg p-4 ${
                    msg.type === 'ai' 
                      ? 'bg-[#EF4444]/10 border border-[#EF4444]/20' 
                      : 'bg-[#1A0A0A]'
                  }`}>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {msg.message}
                    </p>

                    {/* Code Snippet if present */}
                    {msg.codeSnippet && (
                      <div className="mt-4 bg-[#000000] rounded-lg p-4 border border-[#EF4444]/20">
                        <pre className="text-xs text-gray-300 font-mono leading-relaxed overflow-x-auto">
                          <code>{msg.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* Chat Input */}
          <div className="bg-[#1A0A0A] border-t border-[#EF4444]/20 p-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 bg-[#261212] border border-[#EF4444]/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#EF4444]/40 transition-colors"
              />
              <button className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#EF4444]/20">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
          <div className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[#EF4444]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Bot className="w-6 h-6 text-[#F87171]" />
            </div>
            <h4 className="text-white font-bold mb-2">Instant Response</h4>
            <p className="text-gray-400 text-sm">Get answers in seconds, anytime</p>
          </div>

          <div className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[#EF4444]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-[#F87171]" />
            </div>
            <h4 className="text-white font-bold mb-2">Smart Context</h4>
            <p className="text-gray-400 text-sm">AI understands your code context</p>
          </div>

          <div className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-[#EF4444]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-[#F87171]" />
            </div>
            <h4 className="text-white font-bold mb-2">Community Help</h4>
            <p className="text-gray-400 text-sm">Learn from other developers</p>
          </div>
        </div>

      </div>
    </section>
  );
}