import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL, DEFAULT_CONTENT, PROJECT_IMAGES_BUCKET, type Project, type Skill } from "@/lib/content";
import { toast } from "sonner";
import { LogOut, Plus, Save, Trash2, Pencil, X, Eye, ShieldCheck, Upload } from "lucide-react";


export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<null | boolean>(null);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email === ADMIN_EMAIL) {
        setAuthed(true);
      } else {
        setAuthed(false);
        navigate({ to: "/admin/login" });
      }
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user.email !== ADMIN_EMAIL) {
        navigate({ to: "/admin/login" });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/admin/login" });
  };

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground/60">
        Checking access…
      </div>
    );
  }
  if (!authed) return null;

  return (
    <div className="relative min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet/15 border border-violet/30 text-violet">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-xs text-foreground/55 font-mono">{ADMIN_EMAIL}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-foreground/85 hover:border-cyan/40 hover:text-cyan transition-colors"
            >
              <Eye size={14} /> View site
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-foreground/85 hover:border-destructive/40 hover:text-destructive transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </header>

        <SiteContentEditor />
        <ProjectsManager />
      </div>
    </div>
  );
}

/* --------------------------- Site content editor --------------------------- */
function SiteContentEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["site_content_admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("key,value");
      if (error) throw error;
      const map: Record<string, string> = { ...DEFAULT_CONTENT };
      for (const row of data ?? []) map[row.key as string] = row.value as string;
      return map;
    },
  });

  const [draft, setDraft] = useState<Record<string, string>>({});
  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  const fields: Array<{ key: keyof typeof DEFAULT_CONTENT; label: string; multiline?: boolean }> = [
    { key: "hero_badge", label: "Hero badge" },
    { key: "hero_name", label: "Hero name (after #)" },
    { key: "hero_role", label: "Hero role line" },
    { key: "hero_description", label: "Hero description", multiline: true },
    { key: "education_title", label: "Education title" },
    { key: "education_description", label: "Education description", multiline: true },
    { key: "contact_email", label: "Contact email" },
    { key: "github_url", label: "GitHub URL" },
    { key: "linkedin_url", label: "LinkedIn URL" },
    { key: "youtube_url", label: "YouTube URL" },
    { key: "footer_tagline", label: "Footer tagline" },
  ];

  const save = async (key: string) => {
    const value = (draft[key] ?? "").trim();
    if (!value) return toast.error("Value cannot be empty");
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) return toast.error(error.message);
    toast.success(`Saved “${key}”`);
    qc.invalidateQueries({ queryKey: ["site_content"] });
    qc.invalidateQueries({ queryKey: ["site_content_admin"] });
  };

  return (
    <section className="glass rounded-2xl p-6 mb-10">
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan mb-1">
        01 — Edit text
      </div>
      <h2 className="text-xl font-bold tracking-tight mb-6">Site content</h2>
      {isLoading ? (
        <p className="text-sm text-foreground/55">Loading…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className="flex flex-col">
              <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 mb-2">
                {f.label}
              </label>
              {f.multiline ? (
                <textarea
                  rows={3}
                  value={draft[f.key] ?? ""}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground/90 outline-none focus:border-violet/60 resize-none"
                />
              ) : (
                <input
                  value={draft[f.key] ?? ""}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground/90 outline-none focus:border-violet/60"
                />
              )}
              <button
                onClick={() => save(f.key)}
                className="mt-2 self-start inline-flex items-center gap-1.5 rounded-lg bg-violet/15 border border-violet/30 px-3 py-1.5 text-xs text-violet hover:bg-violet/25 transition-colors"
              >
                <Save size={12} /> Save
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* --------------------------- Projects manager --------------------------- */
type Draft = Omit<Project, "id"> & { id?: string };

const blankDraft = (): Draft => ({
  title: "",
  description: "",
  tech: [],
  github_url: "",
  live_url: "",
  image_url: "",
  tint: "cyan",
  sort_order: 0,
});

function ProjectsManager() {
  const qc = useQueryClient();
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects_admin"],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Project[];
    },
  });

  const [editing, setEditing] = useState<Draft | null>(null);
  const [techInput, setTechInput] = useState("");

  const startNew = () => {
    setEditing(blankDraft());
    setTechInput("");
  };
  const startEdit = (p: Project) => {
    setEditing({ ...p });
    setTechInput(p.tech.join(", "));
  };
  const cancel = () => {
    setEditing(null);
    setTechInput("");
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.description.trim()) {
      return toast.error("Title and description are required");
    }
    const payload = {
      title: editing.title.trim(),
      description: editing.description.trim(),
      tech: techInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      github_url: editing.github_url?.trim() || null,
      live_url: editing.live_url?.trim() || null,
      image_url: editing.image_url?.trim() || null,
      tint: editing.tint,
      sort_order: editing.sort_order,
      updated_at: new Date().toISOString(),
    };
    const { error } = editing.id
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Project updated" : "Project created");
    cancel();
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["projects_admin"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Project deleted");
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["projects_admin"] });
  };

  return (
    <section className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan mb-1">
            02 — Manage
          </div>
          <h2 className="text-xl font-bold tracking-tight">Projects</h2>
        </div>
        {!editing && (
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-xl bg-violet px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.45)] hover:bg-violet/90 transition-colors"
          >
            <Plus size={14} /> New project
          </button>
        )}
      </div>

      {editing && (
        <div className="mb-6 rounded-xl border border-violet/30 bg-violet/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">
              {editing.id ? "Edit project" : "New project"}
            </h3>
            <button
              onClick={cancel}
              className="rounded-lg p-1.5 text-foreground/60 hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title">
              <input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Tint (cyan / violet / emerald)">
              <select
                value={editing.tint}
                onChange={(e) => setEditing({ ...editing, tint: e.target.value })}
                className="input"
              >
                <option value="cyan">cyan</option>
                <option value="violet">violet</option>
                <option value="emerald">emerald</option>
              </select>
            </Field>
            <Field label="Description" full>
              <textarea
                rows={3}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="input resize-none"
              />
            </Field>
            <Field label="Tech stack (comma-separated)" full>
              <input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="React.js, Tailwind CSS, Framer Motion"
                className="input"
              />
            </Field>
            <Field label="GitHub URL">
              <input
                value={editing.github_url ?? ""}
                onChange={(e) => setEditing({ ...editing, github_url: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Live URL">
              <input
                value={editing.live_url ?? ""}
                onChange={(e) => setEditing({ ...editing, live_url: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Image URL (optional)">
              <input
                value={editing.image_url ?? ""}
                onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                value={editing.sort_order}
                onChange={(e) =>
                  setEditing({ ...editing, sort_order: Number(e.target.value) || 0 })
                }
                className="input"
              />
            </Field>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              onClick={save}
              className="inline-flex items-center gap-2 rounded-xl bg-violet px-4 py-2 text-sm font-semibold text-white hover:bg-violet/90"
            >
              <Save size={14} /> {editing.id ? "Save changes" : "Create project"}
            </button>
            <button
              onClick={cancel}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-foreground/80 hover:border-white/20"
            >
              Cancel
            </button>
          </div>
          <style>{`.input{width:100%;border-radius:0.5rem;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);padding:0.5rem 0.75rem;font-size:0.875rem;color:rgb(245 245 245 / 0.9);outline:none}.input:focus{border-color:rgba(139,92,246,0.6)}`}</style>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-foreground/55">Loading…</p>
      ) : !projects?.length ? (
        <p className="text-sm text-foreground/55">No projects yet — add your first one.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`rounded-md border border-${p.tint}/30 bg-${p.tint}/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-${p.tint}`}
                  >
                    #{p.sort_order}
                  </span>
                  <h3 className="font-semibold">{p.title}</h3>
                </div>
                <p className="text-xs text-foreground/65 line-clamp-2">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-foreground/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs hover:border-cyan/40 hover:text-cyan"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs hover:border-destructive/40 hover:text-destructive"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}
