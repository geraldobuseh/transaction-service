import { motion } from 'framer-motion';
import { Boxes, BrainCircuit, Database, ShieldCheck } from 'lucide-react';

const capabilities = [
  {
    label: 'Drools Decisioning',
    detail: 'Rule engine classification',
    icon: BrainCircuit
  },
  {
    label: 'Microsoft SQL Server',
    detail: 'Persistent transaction store',
    icon: Database
  },
  {
    label: 'Container Runtime',
    detail: 'Docker Compose orchestration',
    icon: Boxes
  }
];

export default function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-16 lg:pt-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hero-copy max-w-3xl"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white shadow-glow backdrop-blur-xl">
          <ShieldCheck className="h-4 w-4" />
          Enterprise transaction operations
        </div>

        <h1 className="font-display text-5xl font-semibold text-white sm:text-6xl lg:text-7xl">
          Transact App
        </h1>
        <p className="mt-5 text-2xl font-medium text-white sm:text-3xl">
          Rule-Driven Transaction Intelligence
        </p>
        <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
          An enterprise-style transaction intelligence platform powered by Spring
          Boot, Apache Kafka, Drools, Microsoft SQL Server, and containerized infrastructure.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {['Spring Boot', 'Apache Kafka', 'Drools', 'Microsoft SQL Server', 'Docker Compose'].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/82 backdrop-blur-xl"
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/20 via-neutral-300/10 to-white/20 blur-3xl" />
        <div className="glass-panel relative p-4 sm:p-5">
          <div className="rounded-2xl border border-white/10 bg-[#050505]/60 p-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-white/55">Risk analysis stream</p>
                <p className="mt-1 text-xl font-semibold text-white">Rule evaluation</p>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                Active
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {capabilities.map(({ label, detail, icon: Icon }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.08, duration: 0.45 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.055] p-4 transition-colors hover:bg-white/[0.08]"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{label}</p>
                    <p className="text-sm text-white/55">{detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
