import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  FileText,
  Github,
  Linkedin,
  Mail,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Twitter,
  Upload,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('skip-loader');
    return () => document.body.classList.remove('skip-loader');
  }, []);



  const requireAuthAndNavigate = (path) => {
    if (user) {
      navigate(path);
      return;
    }

    navigate(ROUTES.STUDENT_LOGIN);
  };

  const navItems = useMemo(
    () => [
      { name: 'Browse', icon: Search, action: () => requireAuthAndNavigate(ROUTES.BROWSE_RESOURCES) },
      { name: 'Requests', icon: BookOpen, action: () => requireAuthAndNavigate(ROUTES.MY_REQUESTS) },
      { name: 'Upload', icon: Upload, action: () => requireAuthAndNavigate(ROUTES.POST_RESOURCE) },
    ],
    [user]
  );

  const featureCards = useMemo(
    () => [
      {
        icon: BookOpen,
        title: 'Smart Resource Library',
        description:
          'AI-powered categorization and instant search across thousands of notes, assignments, and study materials.',
        gradient: 'from-purple-500 to-pink-500',
      },
      {
        icon: Users,
        title: 'Connected Community',
        description: 'Join a thriving network of students from multiple colleges, share knowledge and grow together.',
        gradient: 'from-cyan-500 to-blue-500',
      },
      {
        icon: ShieldCheck,
        title: 'Verified & Secure',
        description:
          'College ID authentication ensures a trusted environment. Your data is protected with enterprise-grade security.',
        gradient: 'from-pink-500 to-rose-500',
      },
      {
        icon: FileText,
        title: 'Intelligent Search',
        description: 'Natural language processing helps you find exactly what you need in seconds, not hours.',
        gradient: 'from-violet-500 to-purple-500',
      },
    ],
    []
  );

  const steps = useMemo(
    () => [
      {
        icon: UserCheck,
        title: 'Verify & Join',
        description: 'Sign up with your college ID and get instant verified access to the platform',
        number: '01',
        color: 'from-purple-500 to-pink-500',
      },
      {
        icon: Search,
        title: 'Discover Resources',
        description: 'Use AI-powered search to find notes, materials, or submit resource requests',
        number: '02',
        color: 'from-cyan-500 to-blue-500',
      },
      {
        icon: Upload,
        title: 'Share Knowledge',
        description: 'Upload your notes and help fellow students succeed in their academic journey',
        number: '03',
        color: 'from-pink-500 to-rose-500',
      },
      {
        icon: TrendingUp,
        title: 'Grow Together',
        description: 'Build your reputation, earn badges, and contribute to a thriving learning community',
        number: '04',
        color: 'from-violet-500 to-purple-500',
      },
    ],
    []
  );

  const handleGetStarted = () => {
    requireAuthAndNavigate(ROUTES.BROWSE_RESOURCES);
  };


  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <div className="relative w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                GyanaSetu
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={item.action}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            {/* Right side actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate(ROUTES.STUDENT_LOGIN)}
                className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.STUDENT_SIGNUP)}
                className="px-5 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
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
                  type="button"
                  onClick={() => {
                    item.action();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-gray-400 hover:text-white transition-colors py-2"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    navigate(ROUTES.STUDENT_LOGIN);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-sm text-gray-400 hover:text-white transition-colors py-2 text-left"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate(ROUTES.STUDENT_SIGNUP);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-5 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black">
        {/* Animated background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.15),transparent_50%)]" />
        </div>

        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        {/* Floating orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-600/30 rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">AI-Powered Resource Discovery</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="text-white">Gyana</span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Setu</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-6">
              The intelligent platform connecting college students across Hyderabad for seamless academic resource sharing
            </p>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">Verified. Collaborative. Powered by AI.</p>
          </motion.div>

          {/* CTA (Get Started) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <button
              type="button"
              onClick={handleGetStarted}
              className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-white text-black hover:bg-gray-100 border-0 px-8 py-6 shadow-lg shadow-white/10"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Stats cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              { value: '10+', label: 'Colleges', desc: 'Institutions Connected' },
              { value: '1K+', label: 'Resources', desc: 'Study Materials' },
              { value: '5K+', label: 'Students', desc: 'Active Community' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-32 bg-gradient-to-b from-black via-zinc-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.1),transparent_50%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Built for the Future of Learning</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Combining cutting-edge AI with collaborative features to revolutionize how students share knowledge
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featureCards.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                />
                <div className="relative h-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-16"
          >
            <p className="text-gray-500 mb-6">Ready to experience the future of academic collaboration?</p>
            <button
              type="button"
              onClick={handleGetStarted}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              Start Learning Together
            </button>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-32 bg-gradient-to-b from-black via-zinc-900 to-black overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Get Started in Minutes</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Four simple steps to join the revolution in academic collaboration
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative group"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-white/20 to-white/5 z-0" />
                )}
                <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 group-hover:transform group-hover:-translate-y-2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`text-5xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">Join 5,000+ verified students already learning together</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
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
                <a
                  href="#"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    onClick={() => requireAuthAndNavigate(ROUTES.BROWSE_RESOURCES)}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    Browse Resources
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => requireAuthAndNavigate(ROUTES.POST_RESOURCE)}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    Upload Notes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => requireAuthAndNavigate(ROUTES.MY_REQUESTS)}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    Requests
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => requireAuthAndNavigate(ROUTES.BROWSE_RESOURCES)}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    Dashboard
                  </button>
                </li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-3">
              <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© {currentYear} GyanaSetu. All rights reserved.</p>
            <p className="text-sm text-gray-500">Built with ❤️ for students in Hyderabad</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
