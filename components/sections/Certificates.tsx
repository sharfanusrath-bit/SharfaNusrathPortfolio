'use client';

import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Award,
  Plus,
  Linkedin,
  ShieldCheck,
  X,
  Calendar,
  Building2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import {
  linkedInCertificates,
  LINKEDIN_CERTIFICATIONS_URL,
  categoryStyles,
  type Certificate,
} from '@/lib/certificates-data';

const Certificates = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchCerts() {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setCerts(
          data.map((cert) => ({
            id: cert.id,
            title: cert.title,
            issuer: cert.issuer,
            date: cert.date || '',
            category: 'Professional' as const,
            credential_link: cert.credential_link,
            image_url: cert.image_url,
          }))
        );
      } else {
        setCerts(linkedInCertificates);
      }
    }
    fetchCerts();
  }, []);

  const featuredCert = certs.find((c) => c.featured) || certs[0];
  const otherCerts = certs.filter((c) => c.id !== featuredCert?.id);
  const uniqueIssuers = new Set(certs.map((c) => c.issuer)).size;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const getCategoryStyle = (category: Certificate['category']) =>
    categoryStyles[category] || categoryStyles.Professional;

  return (
    <section
      id="certificates"
      ref={ref}
      className="py-32 px-4 sm:px-6 lg:px-8 relative bg-transparent overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-[#ed6094]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-16"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-sm font-bold tracking-[0.3em] text-[#ed6094] uppercase">
                Recognition
              </h2>
              <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#282828] tracking-tight">
                Verified Expertise
              </h3>
              <div className="h-1 w-24 bg-[#ed6094] mx-auto lg:mx-0" />
              <p className="text-[#282828]/60 max-w-xl text-lg font-medium leading-relaxed">
                Professional certifications from LinkedIn, industry partners, and learning platforms —
                validating skills in AI, full-stack development, and modern engineering.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {isAdmin && (
                <button
                  className="flex items-center gap-2 px-8 py-4 bg-[#ed6094] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-[#ed6094]/30 hover:scale-105 transition-all"
                  onClick={() => {
                    const trigger = document.getElementById('admin-cert-trigger');
                    if (trigger) trigger.click();
                    else
                      alert(
                        'Please use the Control Center in the left sidebar to add certificates.'
                      );
                  }}
                >
                  <Plus size={18} /> New Certificate
                </button>
              )}
              <a
                href={LINKEDIN_CERTIFICATIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-[#282828] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
              >
                <Linkedin size={18} />
                View on LinkedIn
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Certifications', value: certs.length, icon: Award },
              { label: 'Issuing Orgs', value: uniqueIssuers, icon: Building2 },
              { label: 'Verified', value: '100%', icon: ShieldCheck },
              { label: 'Latest', value: featuredCert?.date || '—', icon: Calendar },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-[#e2e2df] rounded-2xl p-6 flex items-center gap-4 hover:border-[#ed6094]/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#f5f3ee] rounded-xl flex items-center justify-center text-[#ed6094]">
                  <stat.icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold text-[#282828]">{stat.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#282828]/50">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {certs.length === 0 ? (
            <p className="text-center py-20 text-[#282828]/40 italic font-serif">
              Certifications are loading...
            </p>
          ) : (
            <>
              {/* Featured certificate */}
              {featuredCert && (
                <motion.div variants={itemVariants}>
                  <button
                    type="button"
                    onClick={() => setSelectedCert(featuredCert)}
                    className="w-full text-left group"
                  >
                    <div className="relative bg-white border border-[#e2e2df] rounded-[2.5rem] overflow-hidden hover:border-[#ed6094]/40 hover:shadow-2xl transition-all duration-500">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${getCategoryStyle(featuredCert.category).gradient} opacity-60`}
                      />
                      <div className="relative grid md:grid-cols-2 gap-0">
                        <div className="p-10 md:p-14 flex flex-col justify-center">
                          <span className="inline-flex items-center gap-2 w-fit px-4 py-1.5 bg-[#ed6094] text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                            <Award size={12} /> Featured Credential
                          </span>
                          <h4 className="text-3xl md:text-4xl font-serif font-bold text-[#282828] mb-3 group-hover:text-[#ed6094] transition-colors">
                            {featuredCert.title}
                          </h4>
                          <p className="text-[#ed6094] font-bold uppercase tracking-widest text-xs mb-4">
                            {featuredCert.issuer}
                          </p>
                          <p className="text-[#282828]/70 leading-relaxed mb-6 max-w-md">
                            {featuredCert.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getCategoryStyle(featuredCert.category).badge}`}
                            >
                              {featuredCert.category}
                            </span>
                            <span className="text-[#282828]/50 text-sm font-bold">
                              {featuredCert.date}
                            </span>
                          </div>
                        </div>
                        <div className="relative min-h-[280px] md:min-h-0 flex items-center justify-center p-10">
                          <div className="relative w-full max-w-sm aspect-[4/3] bg-gradient-to-br from-[#282828] to-[#3d3d3d] rounded-3xl shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                              <div className="w-20 h-20 bg-[#ed6094]/20 rounded-2xl flex items-center justify-center mb-6 text-4xl">
                                {getCategoryStyle(featuredCert.category).icon}
                              </div>
                              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                                Certificate of Completion
                              </p>
                              <p className="text-white font-serif font-bold text-lg leading-tight">
                                {featuredCert.title}
                              </p>
                              <p className="text-[#ed6094] text-xs font-bold mt-3 uppercase tracking-widest">
                                {featuredCert.issuer}
                              </p>
                            </div>
                            <div className="absolute top-4 right-4 w-16 h-16 border border-white/10 rounded-full" />
                            <div className="absolute bottom-4 left-4 w-10 h-10 border border-white/10 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              )}

              {/* Certificate grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherCerts.map((cert) => {
                  const style = getCategoryStyle(cert.category);
                  return (
                    <motion.button
                      key={cert.id}
                      type="button"
                      variants={itemVariants}
                      onClick={() => setSelectedCert(cert)}
                      className="text-left group"
                    >
                      <div className="h-full bg-white border border-[#e2e2df] rounded-[2rem] overflow-hidden hover:border-[#ed6094]/30 hover:shadow-2xl transition-all duration-500 flex flex-col">
                        <div
                          className={`relative h-36 bg-gradient-to-br ${style.gradient} flex items-center justify-center`}
                        >
                          <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                            {style.icon}
                          </div>
                          <span
                            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${style.badge}`}
                          >
                            {cert.category}
                          </span>
                        </div>

                        <div className="p-8 flex flex-col flex-1">
                          <h4 className="text-xl font-serif font-bold text-[#282828] mb-2 group-hover:text-[#ed6094] transition-colors line-clamp-2">
                            {cert.title}
                          </h4>
                          <p className="text-[#ed6094] font-bold uppercase tracking-widest text-[10px] mb-4">
                            {cert.issuer}
                          </p>
                          <p className="text-[#282828]/60 text-sm leading-relaxed line-clamp-2 flex-1 mb-6">
                            {cert.description}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-[#e2e2df]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#282828]/40">
                              {cert.date}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#282828] group-hover:text-[#ed6094] transition-colors">
                              View <ExternalLink size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* LinkedIn banner */}
              <motion.div variants={itemVariants}>
                <a
                  href={LINKEDIN_CERTIFICATIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="relative bg-[#282828] rounded-[2rem] p-10 md:p-14 overflow-hidden hover:shadow-2xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ed6094]/20 via-transparent to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-6 text-center md:text-left">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                          <Linkedin size={32} className="text-white" />
                        </div>
                        <div>
                          <p className="text-white font-serif font-bold text-2xl mb-1">
                            All credentials on LinkedIn
                          </p>
                          <p className="text-white/60 text-sm">
                            View and verify every certification directly on my LinkedIn profile
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 px-8 py-4 bg-white text-[#282828] rounded-full text-xs font-black uppercase tracking-widest group-hover:bg-[#ed6094] group-hover:text-white transition-all">
                        Open Profile <ExternalLink size={16} />
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      {/* Certificate detail modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={() => setSelectedCert(null)}
          >
            <div className="absolute inset-0 bg-[#282828]/60 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div
                className={`h-32 bg-gradient-to-br ${getCategoryStyle(selectedCert.category).gradient} relative flex items-center justify-center`}
              >
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-xl">
                  {getCategoryStyle(selectedCert.category).icon}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                >
                  <X size={20} className="text-[#282828]" />
                </button>
              </div>
              <div className="p-10">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${getCategoryStyle(selectedCert.category).badge}`}
                >
                  {selectedCert.category}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#282828] mb-2">
                  {selectedCert.title}
                </h3>
                <p className="text-[#ed6094] font-bold uppercase tracking-widest text-xs mb-4">
                  {selectedCert.issuer} · {selectedCert.date}
                </p>
                {selectedCert.description && (
                  <p className="text-[#282828]/70 leading-relaxed mb-8">
                    {selectedCert.description}
                  </p>
                )}
                {selectedCert.credential_link && (
                  <a
                    href={selectedCert.credential_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-[#282828] text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#ed6094] transition-colors"
                  >
                    Verify on LinkedIn <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
