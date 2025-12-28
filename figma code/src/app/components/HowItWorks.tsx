import { motion } from 'motion/react';
import { UserPlus, Search, Upload, GraduationCap } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Register with your college ID for verified access',
    step: '01',
  },
  {
    icon: Search,
    title: 'Browse & Request',
    description: 'Explore resources or request specific materials',
    step: '02',
  },
  {
    icon: Upload,
    title: 'Share Knowledge',
    description: 'Upload notes and resources to help others',
    step: '03',
  },
  {
    icon: GraduationCap,
    title: 'Excel Together',
    description: 'Grow as a community and achieve academic success',
    step: '04',
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get started in minutes and join a thriving community of learners
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
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-purple-500/50" />
              )}

              {/* Card */}
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-cyan-500/50 transition-all duration-300 group-hover:transform group-hover:-translate-y-2">
                {/* Step number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <span className="text-white font-bold">{step.step}</span>
                </div>

                {/* Icon */}
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-cyan-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
