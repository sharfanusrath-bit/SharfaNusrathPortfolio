'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
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
    console.log("🔥 BUTTON CLICKED");
    try {
      const res = await fetch("http://localhost:8000/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("Sending data:", formData);
      if (res.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', message: '' });

        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        alert("Failed to send message ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server ❌");
    }

    setIsSubmitting(false);
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
      className="py-20 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-12"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="h-1 w-16 bg-gradient-primary rounded-full" />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">Get In Touch</h2>
          </motion.div>

          {/* Intro Text */}
          <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you! Drop me a message and I'll get back to you as soon
            as possible.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="glass-effect rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Email</h3>
                    <p className="text-slate-600 dark:text-slate-400">sharfanusrath@gmail.com</p>
                  </div>
                </motion.div>
              </div>

              <div className="glass-effect rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                    📍
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Location</h3>
                    <p className="text-slate-600 dark:text-slate-400">Hyderabad, India</p>
                  </div>
                </motion.div>
              </div>

              <div className="glass-effect rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <motion.div
                  className="flex items-start gap-4"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                    💬
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Availability</h3>
                    <p className="text-slate-600 dark:text-slate-400">Available for projects</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="glass-effect rounded-2xl p-8 hover:shadow-xl transition-shadow"
            >
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-700 dark:text-green-400 text-sm font-semibold"
                >
                  ✓ Message sent successfully! I'll get back to you soon.
                </motion.div>
              )}

              <div className="space-y-5">
                {/* Name Input */}
                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full bg-white/10 dark:bg-slate-800/20 border border-white/20 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </motion.div>

                {/* Email Input */}
                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-white/10 dark:bg-slate-800/20 border border-white/20 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </motion.div>

                {/* Message Input */}
                <motion.div whileHover={{ scale: 1.01 }}>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Your message..."
                    className="w-full bg-white/10 dark:bg-slate-800/20 border border-white/20 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <ArrowRight size={18} />
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
