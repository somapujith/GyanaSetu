import { motion } from 'motion/react';
import { BookOpen, Users, ShieldCheck, FileText } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Smart Resource Library',
    description: 'AI-powered categorization and instant search across thousands of notes, assignments, and study materials.',
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
    description: 'College ID authentication ensures a trusted environment. Your data is protected with enterprise-grade security.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: FileText,
    title: 'Intelligent Search',
    description: 'Natural language processing helps you find exactly what you need in seconds, not hours.',
    gradient: 'from-violet-500 to-purple-500',
  },
];

export function Features() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.1),transparent_50%)]" />

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
            Built for the Future of Learning
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Combining cutting-edge AI with collaborative features to revolutionize how students share knowledge
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

              {/* Card */}
              <div className="relative h-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300">
                {/* Icon with gradient background */}
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 mb-6">Ready to experience the future of academic collaboration?</p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20">
            Start Learning Together
          </button>
        </motion.div>
      </div>
    </section>
  );
}