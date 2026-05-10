import { motion } from 'framer-motion';
import { Code2, Cpu, Landmark, Server } from 'lucide-react';
import profileImage from '../assets/gerald-obuseh-profile.png';

const stack = [
  'Spring Boot',
  'Apache Kafka',
  'Drools',
  'SQL Server',
  'JWT Security',
  'Containerized Services'
];

export default function BuilderIntro() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-12"
    >
      <div className="glass-panel grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
        <div className="rounded-3xl border border-white/10 bg-[#050505]/60 p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-glow">
              <img
                src={profileImage}
                alt="Gerald Obuseh"
                className="h-full w-full object-cover object-[center_28%]"
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Gerald Obuseh</p>
              <p className="text-sm text-white/70">Software Engineer Intern at JP Morgan Chase & Co.</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[Server, Cpu, Landmark].map((Icon, index) => (
              <div
                key={index}
                className="grid h-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.055] text-white"
              >
                <Icon className="h-5 w-5" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm text-white/78">
            <Code2 className="h-4 w-4 text-white" />
            Builder profile
          </div>

          <div className="space-y-4 text-base leading-8 text-white/74">
            <p>
              Transact App is an event-driven transaction intelligence platform
              engineered around modern backend infrastructure patterns.
            </p>
            <p>
              Built with Spring Boot, Apache Kafka, Drools, SQL Server, JWT security,
              and containerized services, the platform models transactional lifecycle
              events across distributed processing flows.
            </p>
            <p>
              The system emphasizes: event streaming, rule-based decisioning, operational observability, audit traceability,
              and asynchronous architecture.
            </p>
            <p>Designed and developed by Gerald Obuseh.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/75"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
