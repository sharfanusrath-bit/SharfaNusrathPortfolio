'use client';

import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

interface ModalProps {
  type: 'blog' | 'experience' | 'gallery' | 'project' | 'certificate' | null;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any; // Added for edit functionality
}

export default function AdminModals({ type, onClose, onSuccess, initialData }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(initialData || {});
  const [content, setContent] = useState(initialData?.content || '');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setContent(initialData.content || '');
    } else {
      setFormData({});
      setContent('');
    }
  }, [initialData, type]);

  const mdeOptions = useMemo(() => {
    return {
      spellChecker: false,
      placeholder: 'Write your content here (Markdown supported)...',
      autofocus: true,
    };
  }, []);

  const handleFileUpload = async (bucket: string) => {
    if (!file) return initialData?.image_url || null; // Keep old image if no new file
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
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

    const isEdit = !!initialData?.id;
    const table = type === 'blog' ? 'blogs' : type === 'experience' ? 'experiences' : type === 'project' ? 'projects' : type === 'certificate' ? 'certificates' : 'gallery';
    const { data: { user } } = await supabase.auth.getUser();
    
    // Clean payload: remove internal DB fields when inserting/updating
    const payload = { ...formData };
    delete payload.id;
    delete payload.created_at;

    // Handle image upload if applicable
    if (['gallery', 'project', 'certificate'].includes(type as string)) {
      const bucket = type === 'gallery' ? 'gallery' : type === 'project' ? 'projects' : 'certificates';
      const uploadedUrl = await handleFileUpload(bucket);
      if (uploadedUrl) {
        payload.image_url = uploadedUrl;
      } else if (!payload.image_url && type === 'gallery') {
        alert('Please select an image to upload');
        setLoading(false);
        return;
      }
    }

    if (type === 'blog') {
      payload.content = content;
      if (user && !isEdit) payload.author_id = user.id;
    }

    if (type === 'project' && typeof payload.technologies === 'string') {
      payload.technologies = payload.technologies.split(',').map((t: string) => t.trim());
    }

    let error;
    if (isEdit) {
      const { error: updateError } = await supabase.from(table).update(payload).eq('id', initialData.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from(table).insert([payload]);
      error = insertError;
    }

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
                {initialData ? `Edit ${type}` : `New ${type}`}
              </h2>
              <p className="text-[10px] font-bold text-[#282828] uppercase tracking-widest mt-1">Admin Action</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-[#282828] transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 space-y-6 custom-scrollbar text-[#282828]">
            {type === 'blog' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Title</label>
                  <input
                    required
                    value={formData.title || ''}
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-black font-serif text-lg"
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
                    value={formData.title || ''}
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-black"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Company</label>
                  <input
                    required
                    value={formData.company || ''}
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-black"
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Duration</label>
                  <input
                    required
                    value={formData.duration || ''}
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-black"
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description || ''}
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-black"
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
                    value={formData.title || ''}
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-black"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description || ''}
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-black"
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Technologies (comma separated)</label>
                  <input
                    value={formData.technologies?.join(', ') || ''}
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-black"
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">GitHub Link</label>
                  <input
                    value={formData.github_link || ''}
                    className="w-full p-4 bg-[#f5f3ee] border border-[#e2e2df] rounded-2xl focus:outline-none focus:border-black"
                    onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-[#282828]/60 uppercase tracking-widest">Change Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full p-4 bg-[#f5f3ee] border-2 border-dashed border-[#e2e2df] rounded-2xl"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-5 bg-[#282828] text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              {loading ? <Loader2 className="animate-spin" /> : initialData ? 'Update Collection' : 'Publish to Portfolio'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
