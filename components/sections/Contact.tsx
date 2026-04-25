'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Mail, ArrowRight, MapPin, MessageSquare } from 'lucide-react';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const FORMSPREE_ID = "xpqynqeg";

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        alert("Oops! There was a problem sending your message. ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to the mail server. Please try again! ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-32 px-4 sm:px-6 lg:px-8 relative bg-transparent"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-24"
        >
          {/* Section Header */}
          <div className="space-y-6 text-center">
            <h2 className="text-sm font-bold tracking-[0.3em] text-[#ed6094] uppercase">Let's Connect</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#282828] tracking-tight">
              Get In Touch
            </h3>
            <div className="h-1 w-24 bg-[#ed6094] mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-8">
              <p className="text-xl text-[#282828] font-sans leading-relaxed font-medium">
                Have a project in mind or want to collaborate? I'd love to hear from you! Drop me a message and I'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'Email', value: 'sharfanusrath@gmail.com', icon: Mail, color: '#ed6094' },
                  { title: 'Location', value: 'Hyderabad, India', icon: MapPin, color: '#ed6094' },
                  { title: 'Availability', value: 'Available for projects', icon: MessageSquare, color: '#ed6094' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white border border-[#e2e2df] rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center gap-6 group"
                    whileHover={{ x: 10 }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#f5f3ee] flex items-center justify-center text-[#ed6094] group-hover:bg-[#ed6094] group-hover:text-white transition-colors">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#282828]/60 mb-1">{item.title}</h4>
                      <p className="text-lg font-serif font-bold text-[#282828]">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="bg-white border border-[#e2e2df] rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ed6094]/5 rounded-bl-full" />

              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 bg-green-50 text-green-700 border border-green-200 rounded-2xl text-sm font-black uppercase tracking-widest text-center"
                >
                  ✓ Message sent successfully!
                </motion.div>
              )}

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#282828]/40 mb-4">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f5f3ee]/50 border-b-2 border-[#e2e2df] px-0 py-4 text-[#282828] placeholder-[#282828]/20 focus:outline-none focus:border-[#ed6094] transition-all font-serif text-xl"
                    placeholder="Enter your name..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#282828]/40 mb-4">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#f5f3ee]/50 border-b-2 border-[#e2e2df] px-0 py-4 text-[#282828] placeholder-[#282828]/20 focus:outline-none focus:border-[#ed6094] transition-all font-serif text-xl"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#282828]/40 mb-4">How can I help?</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-[#f5f3ee]/50 border-b-2 border-[#e2e2df] px-0 py-4 text-[#282828] placeholder-[#282828]/20 focus:outline-none focus:border-[#ed6094] transition-all font-serif text-xl resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02, backgroundColor: '#282828' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-6 bg-[#ed6094] text-white font-black uppercase tracking-[0.3em] text-xs rounded-full shadow-2xl shadow-[#ed6094]/30 transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <ArrowRight size={18} strokeWidth={3} />
                </motion.button>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;

