-- Run this in Supabase → SQL Editor to fix admin permissions and RLS

-- 1. Grant yourself admin (replace email if needed)
INSERT INTO public.users (id, is_admin)
SELECT id, true
FROM auth.users
WHERE email = 'sharfanusrath@gmail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = true;

-- 2. Fix RLS policies — INSERT requires WITH CHECK (not just USING)

-- Experiences
DROP POLICY IF EXISTS "Admins can manage experiences" ON public.experiences;
CREATE POLICY "Admins can manage experiences" ON public.experiences
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- Blogs
DROP POLICY IF EXISTS "Admins can manage blogs" ON public.blogs;
CREATE POLICY "Admins can manage blogs" ON public.blogs
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- Gallery
DROP POLICY IF EXISTS "Admins can manage gallery" ON public.gallery;
CREATE POLICY "Admins can manage gallery" ON public.gallery
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- Projects
DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;
CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- Certificates
DROP POLICY IF EXISTS "Admins can manage certificates" ON public.certificates;
CREATE POLICY "Admins can manage certificates" ON public.certificates
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- Storage (re-create with WITH CHECK)
DROP POLICY IF EXISTS "Admin Insert Objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Objects" ON storage.objects;

CREATE POLICY "Admin Insert Objects" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('gallery', 'projects', 'certificates')
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admin Update Objects" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('gallery', 'projects', 'certificates')
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    bucket_id IN ('gallery', 'projects', 'certificates')
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admin Delete Objects" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('gallery', 'projects', 'certificates')
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );
