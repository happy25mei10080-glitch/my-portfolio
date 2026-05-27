import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import happyImg from "@/assets/happy-chahal.png";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContent, useProjects } from "@/lib/content";
import {
  Github,
  Linkedin,
  Youtube,
  Mail,
  Copy,
  Check,
  ArrowUpRight,
  Menu,
  X,
  Code2,
  Database,
  Terminal,
  Sparkles,
  GraduationCap,
  Rocket,
  ExternalLink,
  CheckCircle2,
  Circle,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Chahal — Engineering Student & Aspiring Full-Stack Developer" },
      {
        name: "description",
        content:
          "Portfolio of Happy Chahal — BTech CSE student at Vellore Institute of Technology building MERN stack applications and mastering DSA in C++.",
      },
      { property: "og:title", content: "Happy Chahal — Portfolio" },
      {
        property: "og:description",
        content: "Engineering student building scalable web solutions and mastering algorithmic logic.",
      },
    ],
  }),
  component: Portfolio,
});

const NAV = [
  { id: "home", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
} as const;

/* ----------------------------- TYPEWRITER ----------------------------- */
function Typewriter({
  words,
  typingSpeed = 75,
  deletingSpeed = 40,
  pause = 1400,
}: {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[idx % words.length];
    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIdx((i) => (i + 1) % words.length);
      return;
    }
    const t = setTimeout(
      () => {
        setText((prev) =>
          deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
        );
      },
      deleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(t);
  }, [text, deleting, idx, words, typingSpeed, deletingSpeed, pause]);

  return (
    <span className="inline-flex items-baseline">
      <span>{text}</span>
      <span
        aria-hidden
        className="ml-1 inline-block h-[0.9em] w-[2px] translate-y-[2px] bg-cyan glow-cyan animate-caret-blink"
      />
    </span>
  );
}

function TypeOnce({
  text,
  className = "",
  delay = 0,
  speed = 55,
  caretClassName = "bg-current",
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  caretClassName?: string;
}) {
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const s = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(s);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (shown >= text.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), speed);
    return () => clearTimeout(t);
  }, [shown, started, text, speed]);

  const done = shown >= text.length;
  return (
    <span className={`relative inline ${className}`}>
      {text.slice(0, shown)}
      {!done && (
        <span
          aria-hidden
          className={`ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[2px] animate-caret-blink ${caretClassName}`}
        />
      )}
    </span>
  );
}


function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const email = "happyprince38699@gmail.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [menuOpen]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Ambient grid overlay */}
      <div className="pointer-events-none fixed inset-0 grid-pattern opacity-40" />

      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="relative">
        <Hero />
        <Skills />
        <Projects />
        <Education checks={checks} setChecks={setChecks} />
        <Contact email={email} copied={copied} copyEmail={copyEmail} />
      </main>

      <Footer />
    </div>
  );
}

/* ----------------------------- NAV ----------------------------- */
function Nav({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3 sm:px-6">
        <a href="#home" className="font-mono text-sm tracking-[0.2em] text-foreground/90">
          <span className="text-gradient font-semibold">HAPPY</span>
          <span className="text-foreground/70"> CHAHAL</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className="rounded-lg px-3 py-2 text-sm text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-lg border border-cyan/40 bg-cyan/10 px-4 py-2 text-xs font-medium text-cyan transition-all hover:bg-cyan/20 hover:glow-cyan md:inline-flex"
        >
          Let's Connect
        </a>

        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70 md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="glass mx-auto mt-3 max-w-6xl rounded-2xl px-4 py-4 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-3 text-sm text-foreground/80 hover:bg-white/5"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ----------------------------- HERO ----------------------------- */
function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-4 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-28"
    >
      {/* Floating purple square decorations (phodu.club style) */}
      <span className="phodu-float left-[6%] top-[22%] h-3 w-3 opacity-80" />
      <span className="phodu-float right-[8%] top-[18%] h-4 w-4 opacity-90" style={{ animationDelay: "1.2s" }} />
      <span className="phodu-float left-[12%] bottom-[18%] h-2.5 w-2.5 opacity-70" style={{ animationDelay: "2.4s" }} />
      <span className="phodu-float right-[14%] bottom-[26%] h-3.5 w-3.5 opacity-60" style={{ animationDelay: "0.6s" }} />
      <span className="phodu-float left-[40%] top-[10%] h-2 w-2 opacity-60" style={{ animationDelay: "1.8s" }} />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-violet/40 bg-violet/10 px-4 py-1.5 text-xs font-medium text-violet">
            <Sparkles size={14} />
            <span className="font-mono tracking-wide">Open to Learning & Collaboration</span>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 text-[2.5rem] font-extrabold leading-[1.05] tracking-tight break-words sm:text-6xl lg:text-7xl"
        >
          <span className="text-foreground">#</span>
          <TypeOnce
            text="HappyChahal"
            className="text-gradient"
            caretClassName="bg-violet glow-violet"
            speed={90}
          />
          <br />
          <span className="text-foreground/90">Engineering Student &</span>{" "}
          <span className="text-gradient">
            <Typewriter
              words={[
                "Full-Stack Developer.",
                "MERN Stack Builder.",
                "DSA Problem Solver.",
                "C++ Enthusiast.",
              ]}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 max-w-2xl text-base leading-relaxed text-foreground/65 sm:text-lg"
        >
          Building <TypeOnce text="scalable web solutions" className="text-violet font-medium" /> while
          mastering <TypeOnce text="algorithmic logic" className="text-fuchsia-400 font-medium" delay={1.2} />.
          Engineering student at Vellore Institute of Technology dedicated to software development.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="https://github.com/happychahal"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl bg-violet px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all hover:bg-violet/90 hover:shadow-[0_0_45px_rgba(139,92,246,0.7)]"
          >
            <Github size={16} />
            View My GitHub
            <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90"
          >
            Let's Connect
          </a>
        </motion.div>

        {/* Avatar / Orbital below — phodu style hero media */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 aspect-square w-full max-w-[18rem] sm:max-w-sm lg:max-w-md"
        >
          <OrbitalGraphic />
        </motion.div>
      </div>
    </section>
  );
}


function OrbitalGraphic() {
  return (
    <div className="relative h-full w-full">
      {/* glow */}
      <div className="absolute inset-1/4 rounded-full bg-cyan/20 blur-3xl animate-pulse-glow" />
      <div className="absolute left-1/3 top-1/2 h-32 w-32 rounded-full bg-violet/20 blur-3xl" />

      {/* outer orbit */}
      <div className="absolute inset-0 rounded-full border border-white/10 animate-spin-slow">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 glass rounded-lg px-2.5 py-1 font-mono text-[10px] text-cyan glow-cyan">
          React
        </div>
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 glass rounded-lg px-2.5 py-1 font-mono text-[10px] text-violet">
          Node.js
        </div>
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 glass rounded-lg px-2.5 py-1 font-mono text-[10px] text-emerald">
          MongoDB
        </div>
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 glass rounded-lg px-2.5 py-1 font-mono text-[10px] text-cyan">
          Next.js
        </div>
      </div>

      {/* mid orbit */}
      <div className="absolute inset-[15%] rounded-full border border-white/10 animate-spin-reverse">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-cyan glow-cyan" />
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-violet glow-violet" />
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 h-2 w-2 rounded-full bg-emerald" />
      </div>

      {/* inner orbit */}
      <div className="absolute inset-[30%] rounded-full border border-white/10 animate-spin-slow" />

      {/* core avatar */}
      <div className="absolute inset-[30%] flex items-center justify-center">
        <div className="glass glow-cyan relative h-full w-full overflow-hidden rounded-full border border-cyan/40">
          <img
            src={happyImg}
            alt="Happy Chahal"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* corner code chip */}
      <div className="absolute -bottom-2 right-0 glass animate-float rounded-xl p-2.5 font-mono text-[10px] text-foreground/70 sm:-right-2 sm:p-3 sm:text-[11px]">
        <div className="text-cyan">const dev = {"{"}</div>
        <div className="pl-3">role: <span className="text-emerald">"builder"</span>,</div>
        <div className="pl-3">stack: <span className="text-violet">"<TypeOnce text="MERN" className="text-violet" speed={180} delay={1.6} />"</span></div>
        <div className="text-cyan">{"}"}</div>
      </div>
    </div>
  );
}

/* ----------------------------- SKILLS ----------------------------- */
function Skills() {
  const cats = [
    {
      icon: Code2,
      tint: "cyan",
      title: "Languages & Fundamentals",
      groups: [
        { label: "Core Language", items: ["C++", "Object-Oriented Programming", "Memory Optimization"] },
        { label: "Core DSA", items: ["Linear & Non-Linear Structures", "Searching", "Sorting Algorithms"] },
      ],
    },
    {
      icon: Database,
      tint: "violet",
      title: "MERN Stack Development",
      groups: [
        { label: "Frontend", items: ["React.js", "Next.js", "HTML5/CSS3", "JavaScript (ES6+)", "Tailwind CSS"] },
        { label: "Backend", items: ["Node.js", "Express.js"] },
        { label: "Database", items: ["MongoDB"] },
      ],
    },
    {
      icon: Terminal,
      tint: "emerald",
      title: "Developer Utilities",
      groups: [
        { label: "Version Control", items: ["Git", "GitHub"] },
        { label: "Environments", items: ["VS Code", "Linux Terminal Shell"] },
      ],
    },
  ] as const;

  return (
    <Section id="skills" eyebrow="02 — Toolkit" title="Skills & Tech Stack">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cats.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="glass glass-hover group rounded-2xl p-6"
          >
            <div
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-${c.tint}/15 border border-${c.tint}/30 text-${c.tint}`}
            >
              <c.icon size={20} />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{c.title}</h3>

            <div className="mt-5 space-y-4">
              {c.groups.map((g) => (
                <div key={g.label}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
                    {g.label}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {g.items.map((it) => (
                      <span
                        key={it}
                        className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-foreground/80"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------- PROJECTS ----------------------------- */
function Projects() {
  const projects = [
    {
      title: "VIT FFCS Planner & Schedule Builder",
      desc: "A modern web application built to help VIT university students model, optimize, and plan their academic schedules under the Fully Flexible Credit System. Designed with rich glassmorphism UI layouts and interactive course selectors.",
      stack: ["React.js", "Tailwind CSS", "Framer Motion"],
      github: "https://github.com/happychahal",
      live: "#",
      tint: "cyan" as const,
      mock: <FFCSMock />,
    },
    {
      title: "DSA Problem-Solving Repository & Logic Engine",
      desc: "A structured, self-curated archive tracking array manipulations, binary searches, and advanced data structures implemented natively in C++. Showcases computational efficiency metrics and complexity analyses.",
      stack: ["C++", "Git", "Markdown Architecture"],
      github: "https://github.com/happychahal",
      live: null,
      tint: "violet" as const,
      mock: <DSAMock />,
    },
  ];

  return (
    <Section id="projects" eyebrow="03 — Building" title="Projects In Progress">
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="glass glass-hover group flex flex-col overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10">
              {p.mock}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((t) => (
                  <span
                    key={t}
                    className={`rounded-md border border-${p.tint}/30 bg-${p.tint}/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-${p.tint}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/65">{p.desc}</p>

              <div className="mt-6 flex items-center gap-2">
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-foreground/85 transition-colors hover:border-cyan/40 hover:text-cyan"
                >
                  <Github size={14} />
                  Repository
                </a>
                {p.live && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-cyan/40 bg-cyan/10 px-3 py-2 text-xs text-cyan transition-colors hover:bg-cyan/20"
                  >
                    <ExternalLink size={14} />
                    Live Preview
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

function FFCSMock() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-cyan/15 via-transparent to-violet/15 p-4">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="relative grid h-full grid-cols-5 gap-1.5">
        {Array.from({ length: 25 }).map((_, i) => {
          const filled = [2, 3, 7, 11, 12, 16, 19, 22].includes(i);
          const color = i % 3 === 0 ? "bg-cyan/40" : i % 3 === 1 ? "bg-violet/40" : "bg-emerald/40";
          return (
            <div
              key={i}
              className={`rounded ${filled ? `${color} border border-white/20` : "border border-white/10 bg-white/[0.02]"}`}
            />
          );
        })}
      </div>
    </div>
  );
}

const dsaSegments: { t: string; c?: string }[] = [
  { t: "int", c: "text-violet" },
  { t: " " },
  { t: "binarySearch", c: "text-cyan" },
  { t: "(vector<int>& a, " },
  { t: "int", c: "text-violet" },
  { t: " t) {\n  " },
  { t: "int", c: "text-violet" },
  { t: " l=0, r=a.size()-1;\n  " },
  { t: "while", c: "text-violet" },
  { t: " (l <= r) {\n    " },
  { t: "int", c: "text-violet" },
  { t: " m = l + (r-l)/2;\n    " },
  { t: "if", c: "text-violet" },
  { t: " (a[m]==t) " },
  { t: "return", c: "text-violet" },
  { t: " m;\n    a[m]<t ? l=m+1 : r=m-1;\n  }\n  " },
  { t: "return", c: "text-violet" },
  { t: " -1;\n}\n" },
  { t: "// O(log n) \u2713", c: "text-emerald" },
];

function DSAMock() {
  const total = dsaSegments.reduce((n, s) => n + s.t.length, 0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= total) {
      const restart = setTimeout(() => setShown(0), 4500);
      return () => clearTimeout(restart);
    }
    const t = setTimeout(() => setShown((n) => n + 1), 32);
    return () => clearTimeout(t);
  }, [shown, total]);

  let remaining = shown;
  const parts: React.ReactNode[] = [];
  for (let i = 0; i < dsaSegments.length; i++) {
    if (remaining <= 0) break;
    const seg = dsaSegments[i];
    const slice = seg.t.slice(0, remaining);
    remaining -= slice.length;
    parts.push(
      seg.c ? (
        <span key={i} className={seg.c}>
          {slice}
        </span>
      ) : (
        <span key={i}>{slice}</span>
      ),
    );
  }

  const done = shown >= total;

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-violet/15 via-transparent to-cyan/10 p-6 font-mono text-[11px] leading-relaxed">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <pre className="relative text-foreground/85">
        {parts}
        {!done && (
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[2px] bg-cyan glow-cyan animate-caret-blink"
          />
        )}
      </pre>
    </div>
  );
}

/* ----------------------------- EDUCATION ----------------------------- */
function Education({
  checks,
  setChecks,
}: {
  checks: Record<string, boolean>;
  setChecks: (v: Record<string, boolean>) => void;
}) {
  const goals = [
    "Cloud deployment integrations (Vercel, AWS)",
    "Next.js server actions & validation",
    "Automated AI workflow pipelines",
    "Open-source contributions",
  ];

  const toggle = (g: string) => setChecks({ ...checks, [g]: !checks[g] });

  return (
    <Section id="education" eyebrow="04 — Journey" title="Academic Timeline & Roadmap">
      <div className="relative mx-auto max-w-3xl">
        {/* center spine */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-cyan/60 via-violet/60 to-emerald/60 md:left-1/2 md:-translate-x-1/2" />

        {/* Milestone 1 */}
        <TimelineNode side="left" tint="cyan" icon={GraduationCap} label="Current">
          <h3 className="text-lg font-semibold">Vellore Institute of Technology</h3>
          <p className="mt-1.5 text-sm text-foreground/65">
            Bachelor of Technology (BTech) in Computer Science & Engineering.
          </p>
        </TimelineNode>

        {/* Milestone 2 */}
        <TimelineNode side="right" tint="violet" icon={Rocket} label="Next">
          <h3 className="text-lg font-semibold">What I am Building Next</h3>
          <p className="mt-1.5 text-sm text-foreground/65">
            An evolving checklist of skills and integrations on my horizon.
          </p>
          <ul className="mt-4 space-y-2">
            {goals.map((g) => {
              const done = !!checks[g];
              return (
                <li key={g}>
                  <button
                    onClick={() => toggle(g)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-left text-sm transition-colors hover:border-violet/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60"
                  >
                    {done ? (
                      <CheckCircle2 size={16} className="shrink-0 text-emerald" />
                    ) : (
                      <Circle size={16} className="shrink-0 text-foreground/40" />
                    )}
                    <span className={done ? "text-foreground/50 line-through" : "text-foreground/85"}>
                      {g}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </TimelineNode>
      </div>
    </Section>
  );
}

function TimelineNode({
  side,
  tint,
  icon: Icon,
  label,
  children,
}: {
  side: "left" | "right";
  tint: "cyan" | "violet" | "emerald";
  icon: typeof GraduationCap;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className={`relative mb-10 pl-12 md:w-1/2 md:pl-0 ${
        side === "left" ? "md:pr-10 md:text-right" : "md:ml-auto md:pl-10"
      }`}
    >
      <div
        className={`absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full glass border border-${tint}/40 text-${tint} ${
          side === "left"
            ? "md:left-auto md:right-0 md:translate-x-1/2"
            : "md:left-0 md:-translate-x-1/2"
        }`}
      >
        <Icon size={14} />
      </div>
      <div className={`glass glass-hover rounded-2xl p-6 ${side === "left" ? "md:text-left" : ""}`}>
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.2em] text-${tint}`}
        >
          {label}
        </span>
        <div className="mt-2">{children}</div>
      </div>
    </motion.div>
  );
}

/* ----------------------------- CONTACT ----------------------------- */
function Contact({
  email,
  copied,
  copyEmail,
}: {
  email: string;
  copied: boolean;
  copyEmail: () => void;
}) {
  const socials = [
    { href: "https://github.com/happychahal", icon: Github, label: "GitHub", tint: "cyan" },
    { href: "https://linkedin.com/in/happychahal", icon: Linkedin, label: "LinkedIn", tint: "violet" },
    { href: "https://youtube.com/@happychahal", icon: Youtube, label: "YouTube", tint: "emerald" },
  ] as const;

  return (
    <Section id="contact" eyebrow="05 — Reach out" title="Let's Build Something">
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-6"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
            Direct line
          </div>
          <h3 className="mt-2 text-lg font-semibold">Email</h3>
          <button
            onClick={copyEmail}
            className="mt-4 group flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-cyan/40 hover:bg-cyan/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Mail size={16} className="shrink-0 text-cyan" />
              <span className="truncate font-mono text-sm text-foreground/85">{email}</span>
            </div>
            <span className="shrink-0 text-foreground/60 group-hover:text-cyan">
              {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
            </span>
          </button>
          <AnimatePresence>
            {copied && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 font-mono text-xs text-emerald"
              >
                ✓ Copied to clipboard
              </motion.p>
            )}
          </AnimatePresence>

          <p className="mt-6 text-sm text-foreground/60">
            Best for project collaborations, internship opportunities, or just a hello from a fellow
            builder.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
            Network
          </div>
          <h3 className="mt-2 text-lg font-semibold">Find me online</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className={`group flex flex-col items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-${s.tint}/40 hover:bg-${s.tint}/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-${s.tint}/60`}
              >
                <s.icon size={20} className={`text-${s.tint}`} />
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium text-foreground/90">{s.label}</span>
                  <ArrowUpRight
                    size={14}
                    className="text-foreground/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ----------------------------- FOOTER ----------------------------- */
function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-foreground/45 sm:flex-row">
        <span className="font-mono">© {new Date().getFullYear()} Happy Chahal — Crafted with care.</span>
        <span className="font-mono">Vellore Institute of Technology · BTech CSE</span>
      </div>
    </footer>
  );
}

/* ----------------------------- Section wrapper ----------------------------- */
function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan">
            {eyebrow}
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}
