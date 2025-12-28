import { motion } from 'motion/react';
import { UserCheck, Search, Upload, TrendingUp } from 'lucide-react';

const steps = [
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
];

export function HowItWorks() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-zinc-900 to-black overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Get Started in Minutes
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Four simple steps to join the revolution in academic collaboration
          </p>
        </motion.div>

        {/* Steps */}
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
              {/* Connecting line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-white/20 to-white/5 z-0" />
              )}

              {/* Card */}
              <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 group-hover:transform group-hover:-translate-y-2">
                {/* Step number with gradient */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-5xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
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
  );
}