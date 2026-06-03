CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  tint TEXT NOT NULL DEFAULT 'cyan',
  icon TEXT NOT NULL DEFAULT 'Code2',
  group_label TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.skills TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Only admin can insert skills" ON public.skills FOR INSERT TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'happyprince38699@gmail.com');
CREATE POLICY "Only admin can update skills" ON public.skills FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') = 'happyprince38699@gmail.com');
CREATE POLICY "Only admin can delete skills" ON public.skills FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') = 'happyprince38699@gmail.com');

-- Seed initial skills from current static data
INSERT INTO public.skills (category, tint, icon, group_label, name, sort_order) VALUES
('Languages & Fundamentals','cyan','Code2','Core Language','C++',10),
('Languages & Fundamentals','cyan','Code2','Core Language','Object-Oriented Programming',20),
('Languages & Fundamentals','cyan','Code2','Core Language','Memory Optimization',30),
('Languages & Fundamentals','cyan','Code2','Core DSA','Linear & Non-Linear Structures',40),
('Languages & Fundamentals','cyan','Code2','Core DSA','Searching',50),
('Languages & Fundamentals','cyan','Code2','Core DSA','Sorting Algorithms',60),
('MERN Stack Development','violet','Database','Frontend','React.js',10),
('MERN Stack Development','violet','Database','Frontend','Next.js',20),
('MERN Stack Development','violet','Database','Frontend','HTML5/CSS3',30),
('MERN Stack Development','violet','Database','Frontend','JavaScript (ES6+)',40),
('MERN Stack Development','violet','Database','Frontend','Tailwind CSS',50),
('MERN Stack Development','violet','Database','Backend','Node.js',60),
('MERN Stack Development','violet','Database','Backend','Express.js',70),
('MERN Stack Development','violet','Database','Database','MongoDB',80),
('Developer Utilities','emerald','Terminal','Version Control','Git',10),
('Developer Utilities','emerald','Terminal','Version Control','GitHub',20),
('Developer Utilities','emerald','Terminal','Environments','VS Code',30),
('Developer Utilities','emerald','Terminal','Environments','Linux Terminal Shell',40);