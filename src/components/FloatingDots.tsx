// Page-wide floating purple square decorations (phodu.club inspired).
// Rendered as a fixed overlay behind page content.

const DOTS: Array<{ top: string; left?: string; right?: string; size: number; delay: number; opacity: number }> = [
  { top: "8%", left: "5%", size: 12, delay: 0, opacity: 0.7 },
  { top: "14%", right: "8%", size: 16, delay: 1.2, opacity: 0.85 },
  { top: "22%", left: "40%", size: 8, delay: 0.6, opacity: 0.55 },
  { top: "32%", left: "12%", size: 10, delay: 2.4, opacity: 0.65 },
  { top: "38%", right: "14%", size: 14, delay: 1.8, opacity: 0.7 },
  { top: "48%", left: "6%", size: 9, delay: 0.4, opacity: 0.6 },
  { top: "52%", right: "5%", size: 11, delay: 2.0, opacity: 0.7 },
  { top: "60%", left: "35%", size: 7, delay: 1.4, opacity: 0.5 },
  { top: "68%", left: "10%", size: 13, delay: 0.9, opacity: 0.75 },
  { top: "72%", right: "12%", size: 10, delay: 2.6, opacity: 0.6 },
  { top: "82%", left: "8%", size: 12, delay: 1.6, opacity: 0.7 },
  { top: "88%", right: "9%", size: 9, delay: 0.7, opacity: 0.6 },
  { top: "92%", left: "45%", size: 8, delay: 2.2, opacity: 0.55 },
  { top: "26%", left: "70%", size: 11, delay: 1.0, opacity: 0.65 },
  { top: "56%", left: "78%", size: 9, delay: 1.9, opacity: 0.6 },
  { top: "76%", left: "55%", size: 10, delay: 0.5, opacity: 0.7 },
];

export function FloatingDots() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ height: "100vh" }}
    >
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="phodu-float"
          style={{
            top: d.top,
            left: d.left,
            right: d.right,
            width: `${d.size}px`,
            height: `${d.size}px`,
            opacity: d.opacity,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
