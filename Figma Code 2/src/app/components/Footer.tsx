import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                GyanaSetu
              </span>
            </div>
            <p className="text-gray-500 mb-6 leading-relaxed">
              The AI-powered platform connecting students across Hyderabad for seamless academic collaboration and resource sharing.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Browse Resources</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Upload Notes</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Requests</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Dashboard</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} GyanaSetu. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Built with ❤️ for students in Hyderabad
          </p>
        </div>
      </div>
    </footer>
  );
}