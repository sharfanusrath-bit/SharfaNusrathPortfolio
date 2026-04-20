'use client';
import { motion } from 'framer-motion';
import { ExternalLink, Award, ShieldCheck, GraduationCap } from 'lucide-react';

const certificates = [
  {
    title: 'Professional Certifications',
    issuer: 'LinkedIn / Various',
    link: 'https://www.linkedin.com/in/sharfa-nusrath-026600378/details/certifications/',
    icon: ShieldCheck,
    color: '#ed6094',
  },
];

const Certificates = () => {
  return (
    <section id="certificates" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#f6e1d6]/30">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-bold tracking-[0.2em] text-[#ed6094] uppercase mb-4">Recognition</h2>
          <h3 className="text-4xl md:text-5xl font-serif text-[#282828]">My Certificates</h3>
          <div className="w-20 h-1 bg-[#ed6094] mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificates.map((cert, index) => (
            <motion.a
              key={index}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group block p-8 bg-white border border-[#e2e2df] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ed6094]/5 rounded-bl-full group-hover:bg-[#ed6094]/10 transition-colors" />

              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#f5f3ee] text-[#ed6094] rounded-xl group-hover:bg-[#ed6094] group-hover:text-white transition-colors duration-300">
                  <cert.icon size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-serif text-[#282828] mb-2">{cert.title}</h4>
                  <p className="text-[#282828] font-bold mb-4 opacity-70">{cert.issuer}</p>
                  <div className="flex items-center gap-2 text-[#ed6094] font-bold group-hover:gap-4 transition-all">
                    <span>View on LinkedIn</span>
                    <ExternalLink size={18} />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-8 bg-[#282828] text-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-4">
            <GraduationCap size={40} className="text-[#ed6094]" />
            <div>
              <h4 className="text-xl font-serif">Verified Expertise</h4>
              <p className="text-[#f5f3ee] opacity-80 uppercase text-[10px] font-bold tracking-widest">Explore technical endorsements and verified skills.</p>
            </div>
          </div>
          <a
            href="https://www.linkedin.com/in/sharfa-nusrath-026600378/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#ed6094] hover:bg-[#d5467c] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#ed6094]/20"
          >
            Connect on LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Certificates;
