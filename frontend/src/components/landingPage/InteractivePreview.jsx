import { useState, useEffect } from "react";
import { Sparkles, Zap } from "lucide-react";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

export default function InteractivePreview() {
  const [displayedCode, setDisplayedCode] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Initial inefficient code
  const codeSnippet = [
    { text: 'function', color: 'text-red-400' },
    { text: ' ', color: 'text-gray-300' },
    { text: 'findDuplicate', color: 'text-yellow-300' },
    { text: '(', color: 'text-gray-300' },
    { text: 'nums', color: 'text-orange-300' },
    { text: ') {\n  ', color: 'text-gray-300' },
    { text: '// O(n²) - Inefficient!', color: 'text-gray-500' },
    { text: '\n  ', color: 'text-gray-300' },
    { text: 'for', color: 'text-red-400' },
    { text: ' (', color: 'text-gray-300' },
    { text: 'let', color: 'text-red-400' },
    { text: ' i = ', color: 'text-gray-300' },
    { text: '0', color: 'text-emerald-400' },
    { text: '; i < nums.', color: 'text-gray-300' },
    { text: 'length', color: 'text-blue-300' },
    { text: '; i++) {\n    ', color: 'text-gray-300' },
    { text: 'for', color: 'text-red-400' },
    { text: ' (', color: 'text-gray-300' },
    { text: 'let', color: 'text-red-400' },
    { text: ' j = i + ', color: 'text-gray-300' },
    { text: '1', color: 'text-emerald-400' },
    { text: '; j < nums.', color: 'text-gray-300' },
    { text: 'length', color: 'text-blue-300' },
    { text: '; j++) {\n      ', color: 'text-gray-300' },
    { text: 'if', color: 'text-red-400' },
    { text: ' (nums[i] === nums[j]) {\n        ', color: 'text-gray-300' },
    { text: 'return', color: 'text-red-400' },
    { text: ' nums[i];\n      }\n    }\n  }\n}', color: 'text-gray-300' },
  ];

  // Auto-typing effect
  useEffect(() => {
    if (currentIndex < codeSnippet.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode((prev) => [...prev, codeSnippet[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, 40);

      return () => clearTimeout(timeout);
    } else if (currentIndex === codeSnippet.length && !showHint) {
      // Show AI hint after code is complete
      const hintTimeout = setTimeout(() => {
        setShowHint(true);
      }, 800);

      return () => clearTimeout(hintTimeout);
    } else if (showHint) {
      // Reset after showing hint for a while
      const resetTimeout = setTimeout(() => {
        setDisplayedCode([]);
        setCurrentIndex(0);
        setShowHint(false);
      }, 5000);

      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex, showHint, codeSnippet]);

  return (
    <section className="min-h-screen bg-linear-to-br from-[#000000] via-[#120505] to-[#000000] flex items-center justify-center px-4 py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#261212] border border-[#EF4444]/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#F87171]" />
            <span className="text-[#F87171] text-sm font-semibold">AI-Powered Intelligence</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Code Smarter, Not Harder
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Watch as our AI analyzes your code in real-time and suggests optimizations 
            that transform your algorithms from inefficient to blazing fast.
          </p>
        </div>

        {/* Code Editor Preview */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left: Code Editor Card */}
          <CardContainer className="w-full">
            <CardBody className="bg-[#261212]/80 backdrop-blur-xl relative border-[#EF4444]/20 w-full h-125 rounded-xl p-6 border shadow-2xl">
              
              {/* Editor Header */}
              <CardItem translateZ="10" className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm ml-4">solution.js</span>
                </div>
                
                <div className="text-xs text-gray-500 bg-[#1A0A0A] px-3 py-1 rounded">
                  Line {Math.min(currentIndex, 20)} of 20
                </div>
              </CardItem>

              {/* Code Display */}
              <CardItem translateZ="30" className="w-full h-[380px] overflow-auto relative">
                <pre className="text-sm font-mono leading-relaxed">
                  <code>
                    {displayedCode.map((token, index) => (
                      <span key={index} className={token.color}>
                        {token.text}
                      </span>
                    ))}
                    <span className="animate-pulse text-[#EF4444]">|</span>
                  </code>
                </pre>

                {/* AI Hint Popup */}
                {showHint && (
                  <div className="absolute top-24 right-4 w-80 bg-gradient-to-br from-emerald-950 to-emerald-900 border border-emerald-500/30 rounded-lg p-4 shadow-2xl animate-in slide-in-from-right">
                    <div className="flex items-start gap-3">
                      <div className="bg-emerald-500/20 p-2 rounded-lg">
                        <Zap className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-emerald-400 font-semibold text-sm">AI Suggestion</span>
                          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Optimize</span>
                        </div>
                        <p className="text-gray-300 text-xs mb-3">
                          This O(n²) solution is inefficient. Use a <span className="text-emerald-400 font-semibold">Set</span> to achieve O(n) time complexity.
                        </p>
                        <pre className="bg-black/40 p-2 rounded text-xs text-emerald-300 border border-emerald-500/20">
{`const seen = new Set();
for (let num of nums) {
  if (seen.has(num)) return num;
  seen.add(num);
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </CardItem>

              {/* Performance Indicator */}
              <CardItem translateZ="20" className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${showHint ? 'bg-emerald-500 animate-pulse' : 'bg-[#EF4444] animate-pulse'}`}></div>
                  <span className="text-xs text-gray-400">
                    {showHint ? 'AI Analysis Complete' : 'Analyzing...'}
                  </span>
                </div>
                {!showHint && (
                  <div className="bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#F87171] px-3 py-1 rounded-full text-xs font-semibold">
                    ⚠ O(n²) Complexity
                  </div>
                )}
              </CardItem>

            </CardBody>
          </CardContainer>

          {/* Right: Benefits List */}
          <div className="space-y-6">
            <div className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-6 hover:border-[#EF4444]/40 transition-all">
              <div className="bg-[#EF4444]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-[#F87171]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-Time Analysis</h3>
              <p className="text-gray-400">
                Our AI reviews your code as you type, identifying bottlenecks and suggesting optimizations instantly.
              </p>
            </div>

            <div className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-6 hover:border-[#EF4444]/40 transition-all">
              <div className="bg-[#EF4444]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#F87171]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Learn Best Practices</h3>
              <p className="text-gray-400">
                Every suggestion comes with explanations, helping you understand why one approach is better than another.
              </p>
            </div>

            <div className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-6 hover:border-[#EF4444]/40 transition-all">
              <div className="bg-[#EF4444]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <div className="text-2xl">🎯</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Interview-Ready Code</h3>
              <p className="text-gray-400">
                Write code that impresses interviewers with optimal time and space complexity from day one.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}