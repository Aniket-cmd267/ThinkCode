import { Code2, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const footerLinks = {
    Product: ["Problems", "Contests", "Leaderboard", "Discuss", "Pricing"],
    Resources: ["Documentation", "Blog", "Tutorials", "Community", "Support"],
    Company: ["About Us", "Careers", "Press", "Partners", "Contact"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"]
  };

  return (
    <footer className="bg-gradient-to-br from-[#1A0A0A] via-[#120505] to-[#000000] border-t border-[#EF4444]/20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Top Section */}
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xl font-bold">ThinkCode</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Simple path to innovative software features.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-[#261212] border border-[#EF4444]/20 rounded-lg flex items-center justify-center hover:border-[#EF4444]/40 transition-all">
                <Github className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-[#261212] border border-[#EF4444]/20 rounded-lg flex items-center justify-center hover:border-[#EF4444]/40 transition-all">
                <Twitter className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-[#261212] border border-[#EF4444]/20 rounded-lg flex items-center justify-center hover:border-[#EF4444]/40 transition-all">
                <Linkedin className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="w-9 h-9 bg-[#261212] border border-[#EF4444]/20 rounded-lg flex items-center justify-center hover:border-[#EF4444]/40 transition-all">
                <Mail className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-bold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-[#F87171] text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-[#EF4444]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 ThinkCode. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built with ❤️ for developers worldwide
          </p>
        </div>

      </div>
    </footer>
  );
}