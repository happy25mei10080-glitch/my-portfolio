import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteContentMap = Record<string, string>;

export const DEFAULT_CONTENT: SiteContentMap = {
  hero_badge: "Open to Learning & Collaboration",
  hero_name: "HappyChahal",
  hero_role: "Engineering Student &",
  hero_description:
    "Building scalable web solutions while mastering algorithmic logic. Engineering student at Vellore Institute of Technology dedicated to software development.",
  contact_email: "happyprince38699@gmail.com",
  github_url: "https://github.com/happychahal",
  linkedin_url: "https://linkedin.com/in/happychahal",
  youtube_url: "https://youtube.com/@happychahal",
  footer_tagline: "Crafted with care.",
  education_title: "Vellore Institute of Technology",
  education_description: "Bachelor of Technology (BTech) in Computer Science & Engineering.",
};

export function useSiteContent() {
  const { data } = useQuery({
    queryKey: ["site_content"],
    queryFn: async (): Promise<SiteContentMap> => {
      const { data, error } = await supabase.from("site_content").select("key,value");
      if (error) throw error;
      const map: SiteContentMap = {};
      for (const row of data ?? []) map[row.key as string] = row.value as string;
      return map;
    },
    staleTime: 30_000,
  });
  return { ...DEFAULT_CONTENT, ...(data ?? {}) };
}

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  tint: string;
  sort_order: number;
};

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Project[];
    },
    staleTime: 10_000,
  });
}

export const ADMIN_EMAIL = "happyprince38699@gmail.com";
