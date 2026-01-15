import { Star, Quote } from "lucide-react";

export default function SocialProof() {
  const companies = [
    { name: "SAMSUNG", logo: "SAMSUNG" },
    { name: "amazon", logo: "amazon" },
    { name: "Microsoft", logo: "Microsoft" },
    { name: "Intiger", logo: "Intiger" },
    { name: "Meta", logo: "Meta" }
  ];

  const testimonials = [
    {
      text: "Think of an innovative web-app developer getting after learning code through systematic pathway — ThinkCode did it.",
      author: "Developer Name",
      role: "Software Engineer",
      company: "SAMSUNG",
      rating: 5
    },
    {
      text: "Used it as a complete training resource. Got into Amazon after practicing every day-it structures my path.",
      author: "Developer Name",
      role: "Senior Developer",
      company: "Amazon",
      rating: 5
    },
    {
      text: "I went through all the problems one by one. The career transformation was real — started using it at university.",
      author: "Developer Name",
      role: "Full Stack Developer",
      company: "Microsoft",
      rating: 5
    }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#1A0A0A] via-[#120505] to-[#000000] px-4 py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#261212] border border-[#EF4444]/20 px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 text-[#F87171] fill-[#F87171]" />
            <span className="text-[#F87171] text-sm font-semibold">Trusted by Developers</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Social Proof
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands who landed jobs at top companies
          </p>
        </div>

        {/* Company Logos */}
        <div className="mb-20">
          <p className="text-center text-gray-500 text-sm mb-8">Developers at these companies use ThinkCode</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            {companies.map((company, index) => (
              <div
                key={index}
                className="bg-[#261212] border border-[#EF4444]/20 rounded-xl px-8 py-6 hover:border-[#EF4444]/40 transition-all duration-300 w-full flex items-center justify-center group"
              >
                <span className="text-white text-xl font-bold group-hover:text-[#F87171] transition-colors">
                  {company.logo}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-8 hover:border-[#EF4444]/40 transition-all duration-300 flex flex-col"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="w-10 h-10 text-[#EF4444]/30" />
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#F87171] fill-[#F87171]" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 mb-6 flex-1 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-6 border-t border-[#EF4444]/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center text-white font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.author}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  <div className="text-[#F87171] text-xs font-semibold">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-[#261212] border border-[#EF4444]/20 rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Join Our Growing Community</h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EF4444] to-[#F87171] mb-2">
                50K+
              </div>
              <div className="text-gray-400">Active Users</div>
            </div>
            
            <div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EF4444] to-[#F87171] mb-2">
                500+
              </div>
              <div className="text-gray-400">Problems</div>
            </div>
            
            <div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EF4444] to-[#F87171] mb-2">
                95%
              </div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            
            <div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EF4444] to-[#F87171] mb-2">
                4.9
              </div>
              <div className="text-gray-400">Average Rating</div>
            </div>
          </div>

          {/* CTA Button */}
          <button className="mt-10 bg-[#EF4444] hover:bg-[#DC2626] text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg shadow-[#EF4444]/20 hover:scale-105">
            Start Your Journey Today
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h4 className="text-white font-bold mb-2">Secure Platform</h4>
            <p className="text-gray-400 text-sm">Enterprise-grade security for your code</p>
          </div>

          <div className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="text-white font-bold mb-2">Lightning Fast</h4>
            <p className="text-gray-400 text-sm">Optimized for performance and speed</p>
          </div>

          <div className="bg-[#261212] border border-[#EF4444]/20 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h4 className="text-white font-bold mb-2">Interview Ready</h4>
            <p className="text-gray-400 text-sm">FAANG-level problem sets</p>
          </div>
        </div>

      </div>
    </section>
  );
}