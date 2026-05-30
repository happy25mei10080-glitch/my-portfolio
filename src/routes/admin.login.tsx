import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL } from "@/lib/content";
import { toast } from "sonner";
import { Lock, LogIn, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [busy_, _setBusy] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.email === ADMIN_EMAIL) {
        navigate({ to: "/admin" });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      toast.error("Access denied. Only the admin email can sign in.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created — signing in…");
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      toast.success("Welcome back, admin.");
      navigate({ to: "/admin" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      if (mode === "signin" && /invalid|credentials/i.test(msg)) {
        toast.error("Wrong password — or no account yet. Try 'Create account'.");
      } else {
        toast.error(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} /> Back to site
      </Link>

      <div className="glass w-full max-w-md rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet/15 border border-violet/30 text-violet">
            <Lock size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Admin Access</h1>
            <p className="text-xs text-foreground/55">Restricted to site owner only</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground/90 outline-none focus:border-violet/60 focus:bg-white/[0.05]"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground/90 outline-none focus:border-violet/60 focus:bg-white/[0.05]"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all hover:bg-violet/90 disabled:opacity-50"
          >
            <LogIn size={16} />
            {busy ? "Working…" : mode === "signup" ? "Create account & sign in" : "Sign in"}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="block w-full text-center text-xs text-foreground/60 hover:text-foreground transition-colors"
          >
            {mode === "signin"
              ? "First time? Create your admin account →"
              : "← Already have an account? Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
