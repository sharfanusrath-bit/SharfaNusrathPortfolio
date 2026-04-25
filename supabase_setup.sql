-- Run these commands in your Supabase SQL Editor

-- 1. Create buckets for storage
-- NOTE: Go to Storage in Supabase and manually create these buckets or use the SQL below if extensions are enabled
-- BUCKETS: 'gallery', 'projects'

-- 2. Create users table to track admins
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public users are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 3. Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users DEFAULT auth.uid()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blogs are viewable by everyone" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Admins can manage blogs" ON public.blogs 
  FOR ALL USING (
    (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
  );

-- 4. Create experiences table
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT NOT NULL
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Experiences are viewable by everyone" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Admins can manage experiences" ON public.experiences 
  FOR ALL USING (
    (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
  );

-- 5. Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery items are viewable by everyone" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON public.gallery 
  FOR ALL USING (
    (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
  );

-- 6. Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  image_url TEXT,
  github_link TEXT,
  live_link TEXT,
  accent_color TEXT DEFAULT 'border-indigo-500/50'
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON public.projects 
  FOR ALL USING (
    (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
  );

-- 7. Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT,
  image_url TEXT,
  credential_link TEXT
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Certificates are viewable by everyone" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Admins can manage certificates" ON public.certificates 
  FOR ALL USING (
    (SELECT is_admin FROM public.users WHERE id = auth.uid()) = true
  );

-- Function to handle new user signups and set metadata sync
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, is_admin)
  VALUES (new.id, COALESCE((new.raw_user_meta_data->>'is_admin')::boolean, false));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for sync
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
