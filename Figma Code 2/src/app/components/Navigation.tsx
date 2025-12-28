import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Upload, Search, Menu, X, Zap } from 'lucide-react';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Browse', icon: Search },
    { name: 'Requests', icon: BookOpen },
    { name: 'Upload', icon: Upload },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              GyanaSetu
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
              Login
            </button>
            <button className="px-5 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20">
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-white/10"
        >
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                className="flex items-center gap-3 w-full text-gray-400 hover:text-white transition-colors py-2"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <button className="w-full text-sm text-gray-400 hover:text-white transition-colors py-2 text-left">
                Login
              </button>
              <button className="w-full px-5 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm rounded-lg hover:opacity-90 transition-opacity">
                Sign Up
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}