'use client';

import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

const Certificates = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [certs, setCerts] = useState<any[]>([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchCerts() {
      const { data, error } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
      if (!error) setCerts(data || []);
    }
    fetchCerts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="certificates" ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 relative bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-16"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-sm font-bold tracking-[0.3em] text-[#ed6094] uppercase">Recognition</h2>
              <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#282828] tracking-tight">
                Verified Expertise
              </h3>
              <div className="h-1 w-24 bg-[#ed6094] mx-auto md:mx-0" />
            </div>
            {isAdmin && (
              <button 
                className="flex items-center gap-2 px-8 py-4 bg-[#ed6094] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-[#ed6094]/30 hover:scale-105 transition-all"
                onClick={() => {
                  const trigger = document.getElementById('admin-cert-trigger');
                  if (trigger) trigger.click();
                  else alert('Please use the Control Center in the left sidebar to add certificates.');
                }}
              >
                <Plus size={18} /> New Certificate
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certs.length === 0 ? (
              <p className="col-span-full text-center py-20 text-[#282828]/40 italic font-serif">Certifications are loading...</p>
            ) : (
              certs.map((cert) => (
                <motion.div
                  key={cert.id}
                  variants={itemVariants}
                  className="bg-white border border-[#e2e2df] rounded-[2rem] p-8 hover:border-[#ed6094]/30 hover:shadow-2xl transition-all duration-500 group relative"
                >
                  <div className="w-14 h-14 bg-[#f5f3ee] rounded-2xl flex items-center justify-center text-[#ed6094] mb-8 group-hover:bg-[#ed6094] group-hover:text-white transition-colors">
                    <Award size={28} />
                  </div>

                  <h4 className="text-xl font-serif font-bold text-[#282828] mb-2 group-hover:text-[#ed6094] transition-colors line-clamp-1">
                    {cert.title}
                  </h4>
                  <p className="text-[#ed6094] font-bold uppercase tracking-widest text-[10px] mb-6">
                    {cert.issuer} • {cert.date}
                  </p>

                  <div className="aspect-video w-full bg-[#f5f3ee] rounded-2xl mb-8 overflow-hidden">
                    <img 
                      src={cert.image_url || '/placeholder-cert.png'} 
                      alt={cert.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                    />
                  </div>

                  {cert.credential_link && (
                    <a
                      href={cert.credential_link}
                      target="_blank"
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#282828] hover:text-[#ed6094] transition-colors"
                    >
                      Verify Credential <ExternalLink size={14} />
                    </a>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Certificates;
