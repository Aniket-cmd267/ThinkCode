// import { useEffect, useState, useRef } from 'react';
// import { Link, useNavigate } from 'react-router';
// import { useSelector } from 'react-redux';
// import axiosClient from '../utils/axiosClient'
// import { motion, useInView } from 'framer-motion';
const LandingPage = () => {
  // const navigate = useNavigate();
  // const { isAuthenticated, user } = useSelector((state) => state.slice1);
  // const [popularProblems, setPopularProblems] = useState([]);
  
  // // Refs for scroll animations
  // const heroRef = useRef(null);
  // const featuresRef = useRef(null);
  // const previewRef = useRef(null);
  // const problemsRef = useRef(null);
  // const socialProofRef = useRef(null);
  
  // const heroInView = useInView(heroRef, { once: true, margin: '-100px' });
  // const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' });
  // const previewInView = useInView(previewRef, { once: true, margin: '-100px' });
  // const problemsInView = useInView(problemsRef, { once: true, margin: '-100px' });
  // const socialProofInView = useInView(socialProofRef, { once: true, margin: '-100px' });

  // // Fetch top 3 problems
  // useEffect(() => {
  //   const fetchPopularProblems = async () => {
  //     try {
  //       const { data } = await axiosClient.get('/problem/getAllProblem');
  //       // Get top 3 problems (or all if less than 3)
  //       setPopularProblems(data.slice(0, 3));
  //     } catch (error) {
  //       console.error('Error fetching popular problems:', error);
  //     }
  //   };
  //   fetchPopularProblems();
  // }, []);

  // const handleGetStarted = () => {
  //   if (isAuthenticated) {
  //     navigate('/dashboard');
  //   } else {
  //     navigate('/signup');
  //   }
  // };

  // const handleLogin = () => {
  //   navigate('/login');
  // };

  // const features = [
  //   {
  //     title: 'Real-time Coding',
  //     description: 'Write and test your code in a powerful, browser-based IDE with syntax highlighting and auto-completion.',
  //     icon: '💻',
  //   },
  //   {
  //     title: 'Test-case Validation',
  //     description: 'Get instant feedback with comprehensive test case validation to ensure your solution is correct.',
  //     icon: '✅',
  //   },
  //   {
  //     title: 'Progress Tracking',
  //     description: 'Monitor your coding journey with detailed analytics and track your improvement over time.',
  //     icon: '📊',
  //   },
  //   {
  //     title: 'AI-Powered Hints',
  //     description: 'Stuck on a problem? Get intelligent hints and explanations to guide you toward the solution.',
  //     icon: '🤖',
  //   },
  // ];

  // const techLogos = [
  //   { name: 'Google', logo: '🔍' },
  //   { name: 'Microsoft', logo: '🪟' },
  //   { name: 'Amazon', logo: '📦' },
  //   { name: 'Meta', logo: '📘' },
  //   { name: 'Apple', logo: '🍎' },
  // ];

  // const getDifficultyColor = (difficulty) => {
  //   switch (difficulty?.toLowerCase()) {
  //     case 'easy': return '#22c55e';
  //     case 'medium': return '#ffa116';
  //     case 'hard': return '#ef4444';
  //     default: return '#7C3AED';
  //   }
  // };

  return (
    // <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
    //   {/* <Navbar /> */}
      
    //   {/* Hero Section */}
    //   <motion.section
    //     ref={heroRef}
    //     initial={{ opacity: 0, y: 30 }}
    //     animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
    //     transition={{ duration: 0.6, ease: 'easeOut' }}
    //     className="relative px-6 py-20 md:py-32 text-center"
    //   >
    //     <div className="max-w-5xl mx-auto">
    //       <motion.h1
    //         initial={{ opacity: 0, y: 20 }}
    //         animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    //         transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
    //         className="text-5xl md:text-7xl font-bold mb-6"
    //         style={{ 
    //           color: '#ffffff',
    //           fontFamily: 'Inter, Geist Sans, system-ui, sans-serif',
    //           letterSpacing: '-0.03em',
    //           lineHeight: '1.1'
    //         }}
    //       >
    //         Master the Code,
    //         <br />
    //         <span style={{ color: '#ffa116' }}>Ace the Interview</span>
    //       </motion.h1>
          
    //       <motion.p
    //         initial={{ opacity: 0, y: 20 }}
    //         animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    //         transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
    //         className="text-xl md:text-2xl mb-10"
    //         style={{ color: 'rgba(255, 255, 255, 0.7)' }}
    //       >
    //         Level up your coding skills with curated problems, real-time feedback, and AI-powered assistance.
    //       </motion.p>

    //       <motion.div
    //         initial={{ opacity: 0, y: 20 }}
    //         animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    //         transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
    //         className="flex flex-col sm:flex-row gap-4 justify-center items-center"
    //       >
    //         <button
    //           onClick={handleGetStarted}
    //           className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
    //           style={{
    //             backgroundColor: '#ffa116',
    //             color: '#0a0a0a',
    //           }}
    //           onMouseEnter={(e) => {
    //             e.target.style.boxShadow = '0 0 30px rgba(255, 161, 22, 0.5)';
    //           }}
    //           onMouseLeave={(e) => {
    //             e.target.style.boxShadow = 'none';
    //           }}
    //         >
    //           {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
    //         </button>
            
    //         {!isAuthenticated && (
    //           <button
    //             onClick={handleLogin}
    //             className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 border-2 hover:bg-white/5"
    //             style={{
    //               borderColor: 'rgba(255, 255, 255, 0.2)',
    //               color: '#ffffff',
    //             }}
    //           >
    //             Login
    //           </button>
    //         )}
    //       </motion.div>
    //     </div>
    //   </motion.section>

    //   {/* Feature Grid - Bento Layout */}
    //   <motion.section
    //     ref={featuresRef}
    //     initial={{ opacity: 0, y: 50 }}
    //     animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
    //     transition={{ duration: 0.6, ease: 'easeOut' }}
    //     className="px-6 py-20"
    //   >
    //     <div className="max-w-7xl mx-auto">
    //       <motion.h2
    //         initial={{ opacity: 0 }}
    //         animate={featuresInView ? { opacity: 1 } : { opacity: 0 }}
    //         transition={{ duration: 0.6, delay: 0.2 }}
    //         className="text-4xl md:text-5xl font-bold text-center mb-16"
    //         style={{ 
    //           color: '#ffffff',
    //           letterSpacing: '-0.02em'
    //         }}
    //       >
    //         Everything you need to excel
    //       </motion.h2>
          
    //       <div className="bento-grid">
    //         {features.map((feature, index) => (
    //           <motion.div
    //             key={index}
    //             initial={{ opacity: 0, y: 30 }}
    //             animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
    //             transition={{ duration: 0.5, delay: 0.1 * index }}
    //             className="glass-card p-8 hover:scale-105 transition-all duration-300"
    //             onMouseEnter={(e) => {
    //               e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 161, 22, 0.2)';
    //             }}
    //             onMouseLeave={(e) => {
    //               e.currentTarget.style.boxShadow = 'none';
    //             }}
    //           >
    //             <div className="text-4xl mb-4">{feature.icon}</div>
    //             <h3 
    //               className="text-2xl font-semibold mb-3"
    //               style={{ color: '#ffffff', letterSpacing: '-0.02em' }}
    //             >
    //               {feature.title}
    //             </h3>
    //             <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
    //               {feature.description}
    //             </p>
    //           </motion.div>
    //         ))}
    //       </div>
    //     </div>
    //   </motion.section>

    //   {/* Preview Section - Glassmorphism Editor */}
    //   <motion.section
    //     ref={previewRef}
    //     initial={{ opacity: 0, y: 50 }}
    //     animate={previewInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
    //     transition={{ duration: 0.6, ease: 'easeOut' }}
    //     className="px-6 py-20"
    //   >
    //     <div className="max-w-7xl mx-auto">
    //       <motion.h2
    //         initial={{ opacity: 0 }}
    //         animate={previewInView ? { opacity: 1 } : { opacity: 0 }}
    //         transition={{ duration: 0.6, delay: 0.2 }}
    //         className="text-4xl md:text-5xl font-bold text-center mb-16"
    //         style={{ 
    //           color: '#ffffff',
    //           letterSpacing: '-0.02em'
    //         }}
    //       >
    //         Experience the power of ThinkCode
    //       </motion.h2>
          
    //       <motion.div
    //         initial={{ opacity: 0, scale: 0.95 }}
    //         animate={previewInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
    //         transition={{ duration: 0.6, delay: 0.4 }}
    //         className="flex justify-center"
    //       >
    //         {/* <HeroEditor /> */}
    //       </motion.div>
    //     </div>
    //   </motion.section>

    //   {/* Popular Problems Section */}
    //   {popularProblems.length > 0 && (
    //     <motion.section
    //       ref={problemsRef}
    //       initial={{ opacity: 0, y: 50 }}
    //       animate={problemsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
    //       transition={{ duration: 0.6, ease: 'easeOut' }}
    //       className="px-6 py-20"
    //     >
    //       <div className="max-w-7xl mx-auto">
    //         <motion.h2
    //           initial={{ opacity: 0 }}
    //           animate={problemsInView ? { opacity: 1 } : { opacity: 0 }}
    //           transition={{ duration: 0.6, delay: 0.2 }}
    //           className="text-4xl md:text-5xl font-bold text-center mb-16"
    //           style={{ 
    //             color: '#ffffff',
    //             letterSpacing: '-0.02em'
    //           }}
    //         >
    //           Popular Problems
    //         </motion.h2>
            
    //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //           {popularProblems.map((problem, index) => (
    //             <motion.div
    //               key={problem._id}
    //               initial={{ opacity: 0, y: 30 }}
    //               animate={problemsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
    //               transition={{ duration: 0.5, delay: 0.1 * index }}
    //               className="glass-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
    //               onMouseEnter={(e) => {
    //                 e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 161, 22, 0.2)';
    //               }}
    //               onMouseLeave={(e) => {
    //                 e.currentTarget.style.boxShadow = 'none';
    //               }}
    //               onClick={() => {
    //                 if (isAuthenticated) {
    //                   navigate(`/problem/${problem._id}`);
    //                 } else {
    //                   navigate('/signup');
    //                 }
    //               }}
    //             >
    //               <div className="flex items-start justify-between mb-4">
    //                 <h3 
    //                   className="text-xl font-semibold"
    //                   style={{ color: '#ffffff', letterSpacing: '-0.02em' }}
    //                 >
    //                   {problem.title}
    //                 </h3>
    //                 <span
    //                   className="px-3 py-1 rounded text-sm font-semibold"
    //                   style={{
    //                     backgroundColor: `${getDifficultyColor(problem.difficulty)}20`,
    //                     color: getDifficultyColor(problem.difficulty),
    //                     border: `1px solid ${getDifficultyColor(problem.difficulty)}40`,
    //                   }}
    //                 >
    //                   {problem.difficulty}
    //                 </span>
    //               </div>
    //               <div className="flex gap-2">
    //                 <span
    //                   className="px-3 py-1 rounded text-xs"
    //                   style={{
    //                     backgroundColor: 'rgba(255, 161, 22, 0.2)',
    //                     color: '#ffa116',
    //                     border: '1px solid rgba(255, 161, 22, 0.4)',
    //                   }}
    //                 >
    //                   {problem.tags}
    //                 </span>
    //               </div>
    //             </motion.div>
    //           ))}
    //         </div>
    //       </div>
    //     </motion.section>
    //   )}

    //   {/* Social Proof Section */}
    //   <motion.section
    //     ref={socialProofRef}
    //     initial={{ opacity: 0, y: 50 }}
    //     animate={socialProofInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
    //     transition={{ duration: 0.6, ease: 'easeOut' }}
    //     className="px-6 py-20"
    //   >
    //     <div className="max-w-7xl mx-auto">
    //       <motion.p
    //         initial={{ opacity: 0 }}
    //         animate={socialProofInView ? { opacity: 1 } : { opacity: 0 }}
    //         transition={{ duration: 0.6, delay: 0.2 }}
    //         className="text-center mb-12 text-lg"
    //         style={{ color: 'rgba(255, 255, 255, 0.6)' }}
    //       >
    //         Trusted by developers from
    //       </motion.p>
          
    //       <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
    //         {techLogos.map((company, index) => (
    //           <motion.div
    //             key={company.name}
    //             initial={{ opacity: 0, scale: 0.8 }}
    //             animate={socialProofInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
    //             transition={{ duration: 0.5, delay: 0.1 * index }}
    //             className="text-4xl md:text-5xl hover:scale-110 transition-transform duration-300"
    //             title={company.name}
    //           >
    //             {company.logo}
    //           </motion.div>
    //         ))}
    //       </div>
    //     </div>
    //   </motion.section>

    //   {/* Final CTA Section */}
    //   <motion.section
    //     initial={{ opacity: 0, y: 50 }}
    //     whileInView={{ opacity: 1, y: 0 }}
    //     viewport={{ once: true, margin: '-100px' }}
    //     transition={{ duration: 0.6, ease: 'easeOut' }}
    //     className="px-6 py-20 text-center"
    //   >
    //     <div className="max-w-4xl mx-auto">
    //       <h2 
    //         className="text-4xl md:text-5xl font-bold mb-6"
    //         style={{ 
    //           color: '#ffffff',
    //           letterSpacing: '-0.02em'
    //         }}
    //       >
    //         Ready to start coding?
    //       </h2>
    //       <p 
    //         className="text-xl mb-10"
    //         style={{ color: 'rgba(255, 255, 255, 0.7)' }}
    //       >
    //         Join thousands of developers improving their skills on ThinkCode
    //       </p>
    //       <button
    //         onClick={handleGetStarted}
    //         className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
    //         style={{
    //           backgroundColor: '#ffa116',
    //           color: '#0a0a0a',
    //         }}
    //         onMouseEnter={(e) => {
    //           e.target.style.boxShadow = '0 0 30px rgba(255, 161, 22, 0.5)';
    //         }}
    //         onMouseLeave={(e) => {
    //           e.target.style.boxShadow = 'none';
    //         }}
    //       >
    //         {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
    //       </button>
    //     </div>
    //   </motion.section>
    // </div>
    <div>Hello Landing Page</div>
  );
};

export default LandingPage;