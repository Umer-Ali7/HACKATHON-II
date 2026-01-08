'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Zap,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';

const features = [
  {
    icon: CheckSquare,
    title: 'Task Management',
    description:
      'Create, organize, and track your tasks with an intuitive interface designed for productivity.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Built with modern technologies for instant response times and smooth interactions.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Your data is encrypted and protected. Only you have access to your tasks.',
  },
  {
    icon: Users,
    title: 'Multi-User Ready',
    description:
      'Perfect for individuals and teams. Each user gets their own private workspace.',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400" />

        {/* Animated Background Patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <Container size="xl" padding="lg">
          <div className="relative py-20 md:py-32 lg:py-40">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center"
            >
              {/* Badge */}
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8"
              >
                <Sparkles className="w-4 h-4" />
                <span>Modern Task Management</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Organize Your Life,
                <br />
                <span className="text-cyan-200">One Task at a Time</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10"
              >
                A beautiful, intuitive task management app that helps you stay
                focused and accomplish more every day.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Illustration - Abstract Task Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-16 md:mt-24 relative"
            >
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Sample Task Cards */}
                    <div className="bg-white rounded-xl p-4 shadow-lg transform hover:-translate-y-1 transition-transform">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-5 h-5 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center">
                          <CheckSquare className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium text-gray-400 line-through">
                          Complete project proposal
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Due yesterday
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg transform hover:-translate-y-1 transition-transform">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-5 h-5 rounded-full border-2 border-purple-500" />
                        <span className="font-medium text-gray-800">
                          Review team updates
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Due today
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg transform hover:-translate-y-1 transition-transform">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-5 h-5 rounded-full border-2 border-purple-500" />
                        <span className="font-medium text-gray-800">
                          Prepare presentation
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Due tomorrow
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-gray-50">
        <Container size="xl" padding="lg">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            {/* Section Header */}
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Stay Organized
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Powerful features wrapped in a simple, beautiful interface that
                helps you focus on what matters most.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <Container size="lg" padding="lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 p-8 md:p-16 text-center"
          >
            {/* Background Patterns */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Things Done?
              </h2>
              <p className="text-lg text-white/90 max-w-xl mx-auto mb-8">
                Join thousands of productive people who use TaskFlow to manage
                their daily tasks and achieve their goals.
              </p>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Start for Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
