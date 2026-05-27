
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  tint TEXT NOT NULL DEFAULT 'cyan',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Only admin can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'happyprince38699@gmail.com');
CREATE POLICY "Only admin can update projects" ON public.projects FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') = 'happyprince38699@gmail.com');
CREATE POLICY "Only admin can delete projects" ON public.projects FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') = 'happyprince38699@gmail.com');

CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Only admin can insert content" ON public.site_content FOR INSERT TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'happyprince38699@gmail.com');
CREATE POLICY "Only admin can update content" ON public.site_content FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') = 'happyprince38699@gmail.com');
CREATE POLICY "Only admin can delete content" ON public.site_content FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') = 'happyprince38699@gmail.com');
