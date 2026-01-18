import { Button } from "@/components/ui/button";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { useEffect, useState } from "react";
import { Link } from 'react-router'

export default function HeroSection() {
  const [displayedCode, setDisplayedCode] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // The code that will be typed out with syntax highlighting
  const codeSnippet = [
    { text: 'function', color: 'text-purple-400' },
    { text: ' ', color: 'text-gray-300' },
    { text: 'solveTwoSum', color: 'text-yellow-300' },
    { text: '(', color: 'text-gray-300' },
    { text: 'nums', color: 'text-orange-300' },
    { text: ', ', color: 'text-gray-300' },
    { text: 'target', color: 'text-orange-300' },
    { text: ') {\n  ', color: 'text-gray-300' },
    { text: 'const', color: 'text-purple-400' },
    { text: ' map = ', color: 'text-gray-300' },
    { text: 'new', color: 'text-purple-400' },
    { text: ' ', color: 'text-gray-300' },
    { text: 'Map', color: 'text-blue-300' },
    { text: '();\n  \n  ', color: 'text-gray-300' },
    { text: 'for', color: 'text-purple-400' },
    { text: ' (', color: 'text-gray-300' },
    { text: 'let', color: 'text-purple-400' },
    { text: ' i = ', color: 'text-gray-300' },
    { text: '0', color: 'text-green-400' },
    { text: '; i < nums.', color: 'text-gray-300' },
    { text: 'length', color: 'text-blue-300' },
    { text: '; i++) {\n    ', color: 'text-gray-300' },
    { text: 'const', color: 'text-purple-400' },
    { text: ' complement = target - nums[i];\n    \n    ', color: 'text-gray-300' },
    { text: 'if', color: 'text-purple-400' },
    { text: ' (map.', color: 'text-gray-300' },
    { text: 'has', color: 'text-yellow-300' },
    { text: '(complement)) {\n      ', color: 'text-gray-300' },
    { text: 'return', color: 'text-purple-400' },
    { text: ' [map.', color: 'text-gray-300' },
    { text: 'get', color: 'text-yellow-300' },
    { text: '(complement), i];\n    }\n    \n    map.', color: 'text-gray-300' },
    { text: 'set', color: 'text-yellow-300' },
    { text: '(nums[i], i);\n  }\n  \n  ', color: 'text-gray-300' },
    { text: 'return', color: 'text-purple-400' },
    { text: ' [];\n}', color: 'text-gray-300' },
  ];

  // Auto-typing effect with colored syntax
  useEffect(() => {
    if (currentIndex < codeSnippet.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode((prev) => [...prev, codeSnippet[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, 30); // Speed of typing (30ms per token)

      return () => clearTimeout(timeout);
    } else {
      // Reset after completion
      const resetTimeout = setTimeout(() => {
        setDisplayedCode([]);
        setCurrentIndex(0);
      }, 3000); // Wait 3 seconds before restarting

      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex, codeSnippet]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0A0A] via-[#120505] to-[#000000] flex items-center justify-center px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Side - Text Content */}
        <div className="text-white space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Code Faster. Compete Harder. Win Bigger.
            {/* <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              One Problem at a Time */}
            {/* </span> */}
          </h1>

          <p className="text-xl text-gray-300">
            Practice, compete, and level up. Use our built-in AI assistant to debug your logic while you climb the ranks against global talent.
          </p>

          <div className="flex gap-4 pt-4">
            <Link to='/login'>
              <Button size="lg" className="bg-blue-600 hover:bg-purple-700 text-white">
                Get Started
              </Button>
            </Link>
            {/* <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400/10">
              View Problems
            </Button> */}
          </div>

          <div className="flex gap-8 pt-6 text-gray-400">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm">Problems</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">50K+</p>
              <p className="text-sm">Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">95%</p>
              <p className="text-sm">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Right Side - 3D Card with Code */}
        <CardContainer className="inter-var">
          <CardBody className="bg-[#1E293B] backdrop-blur-xl relative group/card border-purple-500/20 w-full h-[500px] rounded-xl p-6 border shadow-2xl">

            {/* Card Header */}
            <CardItem
              translateZ="10"
              className="flex items-center gap-2 mb-4"
            >
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm ml-4">solution.js</span>
            </CardItem>

            {/* Code Display */}
            <CardItem
              translateZ="30"
              className="w-full h-[400px] overflow-auto"
            >
              <pre className="text-sm font-mono leading-relaxed">
                <code>
                  {displayedCode.map((token, index) => (
                    <span key={index} className={token.color}>
                      {token.text}
                    </span>
                  ))}
                  <span className="animate-pulse text-purple-400">|</span>
                </code>
              </pre>
            </CardItem>

            {/* Bottom Badge */}
            <CardItem
              translateZ="20"
              className="absolute bottom-6 right-6"
            >
              <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                ✓ Optimal Solution
              </div>
            </CardItem>

          </CardBody>
        </CardContainer>

      </div>
    </div>
  );
}