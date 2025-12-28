import { motion } from 'motion/react';
import { BookOpen, Users, ShieldCheck, FileText } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Extensive Library',
    description: 'Access thousands of notes, assignments, and study materials across all departments and semesters.',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Users,
    title: 'Collaborative Learning',
    description: 'Connect with students from multiple colleges, share knowledge, and grow together as a community.',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Authentication',
    description: 'College ID-based verification ensures a trusted and safe environment for academic resource sharing.',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: FileText,
    title: 'Smart Organization',
    description: 'Find what you need instantly with our intelligent categorization and powerful search features.',
    gradient: 'from-pink-500 to-rose-600',
  },
];

export function Features() {
  return (
    <section className="relative py-32 bg-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.05),transparent_50%)]" />

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
            Why Choose <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">GyanaSetu</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Empowering students with the tools and resources they need to excel academically
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
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl blur-xl transition-opacity duration-500`} />

              {/* Card */}
              <div className="relative h-full bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300">
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
