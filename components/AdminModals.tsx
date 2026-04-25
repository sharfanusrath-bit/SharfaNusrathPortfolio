'use client';

import { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

interface ModalProps {
  type: 'blog' | 'experience' | 'gallery' | 'project' | 'certificate' | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminModals({ type, onClose, onSuccess }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [content, setContent] = useState('');

  const [file, setFile] = useState<File | null>(null);

  const mdeOptions = useMemo(() => {
    return {
      spellChecker: false,
      placeholder: 'Write your blog content here (Markdown supported)...',
      autofocus: true,
    };
  }, []);

  const handleFileUpload = async (bucket: string) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const table = type === 'blog' ? 'blogs' : type === 'experience' ? 'experiences' : type === 'project' ? 'projects' : type === 'certificate' ? 'certificates' : 'gallery';
    const { data: { user } } = await supabase.auth.getUser();
    const payload = { ...formData };

    // Handle image upload if applicable
    if (type === 'gallery' || type === 'project' || type === 'certificate') {
      const bucket = type === 'gallery' ? 'gallery' : type === 'project' ? 'projects' : 'certificates';
      const uploadedUrl = await handleFileUpload(bucket);
      if (uploadedUrl) {
        payload.image_url = uploadedUrl;
      } else if (!formData.image_url && type === 'gallery') {
        alert('Please select an image to upload');
        setLoading(false);
        return;
      }
    }

    if (type === 'blog') {
      payload.content = content;
      if (user) payload.author_id = user.id;
    }

    // Convert technologies string to array for projects
    if (type === 'project' && typeof payload.technologies === 'string') {
      payload.technologies = payload.technologies.split(',').map((t: string) => t.trim());
    }

    const { error } = await supabase.from(table).insert([payload]);

    if (error) {
      alert(error.message);
    } else {
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  if (!type) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#282828]/40 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-8 border-b border-[#e2e2df] flex justify-between items-center bg-[#f5f3ee]">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#282828] capitalize">
                {type === 'blog' ? '✍️ New Blog Post' : 
                 type === 'experience' ? '💼 Add Experience' : 
                 type === 'project' ? '🚀 New Project' : 
                 type === 'certificate' ? '🏆 New Certificate' :
                 '🖼️ Add Gallery Item'}
              </h2>
              <p className="text-[10px] font-bold text-[#ed6094] uppercase tracking-widest mt-1">Admin Action</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-[#282828] transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
            {type === 'blog' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Title</label>
                  <input
                    required
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-[#ed6094] font-serif text-lg"
                    placeholder="Enter blog title..."
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Content (Markdown)</label>
                  <div className="prose-sm">
                    <SimpleMDE value={content} onChange={setContent} options={mdeOptions} />
                  </div>
                </div>
              </>
            )}

            {type === 'experience' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Job Title</label>
                  <input
                    required
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-[#ed6094]"
                    placeholder="e.g. Senior Developer"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Company</label>
                  <input
                    required
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-[#ed6094]"
                    placeholder="e.g. Google"
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Duration</label>
                  <input
                    required
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-[#ed6094]"
                    placeholder="e.g. 2024 - Present"
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Description</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-[#ed6094]"
                    placeholder="Describe your role and achievements..."
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            )}

            {type === 'project' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Project Title</label>
                  <input
                    required
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-[#ed6094]"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Description</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-[#ed6094]"
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Technologies (comma separated)</label>
                  <input
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-[#ed6094]"
                    placeholder="React, Tailwind, Supabase"
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">GitHub Link</label>
                  <input
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-[#ed6094]"
                    onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Project Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full p-4 bg-[#f5f3ee] border-2 border-dashed border-[#e2e2df] rounded-2xl"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            )}

            {type === 'certificate' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Certificate Title</label>
                  <input
                    required
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-[#ed6094]"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Issuer</label>
                  <input
                    required
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-[#ed6094]"
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Date</label>
                  <input
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-[#ed6094]"
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Certificate Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full p-4 bg-[#f5f3ee] border-2 border-dashed border-[#e2e2df] rounded-2xl"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            )}

            {type === 'gallery' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Gallery Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    className="w-full p-4 bg-[#f5f3ee] border-2 border-dashed border-[#e2e2df] rounded-2xl"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Caption</label>
                  <input
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-[#ed6094]"
                    placeholder="Short description of the image..."
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-5 bg-[#282828] text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-[#ed6094] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#282828]/10"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Publish to Portfolio'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
