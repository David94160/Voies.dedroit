import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/* ---------- détection d'entrée dans le viewport ---------- */
export function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ---------- révélation au scroll ---------- */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`rv ${inView ? "rv-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------- tampon qui claque ---------- */
export function Stamp({
  children,
  tone,
  rot = "-4deg",
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  tone: "red" | "green" | "amber" | "blue";
  rot?: string;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const color =
    tone === "red"
      ? "text-stamp"
      : tone === "green"
        ? "text-green"
        : tone === "amber"
          ? "text-amber"
          : "text-royal";
  return (
    <span
      ref={ref}
      className={`stamp inline-block text-[11px] whitespace-nowrap ${color} ${className} ${inView ? "stamp-in" : "opacity-0"}`}
      style={{ "--rot": rot, animationDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </span>
  );
}

/* ---------- en-tête de section ---------- */
export function SectionHead({
  no,
  kicker,
  title,
  sub,
}: {
  no: string;
  kicker: string;
  title: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <div className="flex items-center gap-4 mb-5">
        <span className="font-mono text-[11px] tracking-[0.22em] text-stamp font-semibold">
          § {no}
        </span>
        <span className="h-px flex-1 bg-line" />
        <span className="mono-label">{kicker}</span>
      </div>
      <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-[1.02] tracking-tight max-w-4xl text-inkdeep">
        {title}
      </h2>
      {sub && (
        <div className="mt-5 max-w-2xl text-fog text-[15px] leading-relaxed">{sub}</div>
      )}
    </Reveal>
  );
}

/* ---------- anneau de progression ---------- */
export function ProgressRing({ pct }: { pct: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-label={`${pct} % de la checklist complétée`}>
      <circle cx="36" cy="36" r={r} fill="none" stroke="#d3dbd3" strokeWidth="5" />
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke={pct === 100 ? "#1e7d46" : "#1b3c9c"}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.2,0.7,0.2,1), stroke 0.4s" }}
      />
      <text
        x="36"
        y="41"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="14"
        fontWeight="600"
        fill="#182530"
      >
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

/* ---------- bouton copier ---------- */
export function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1700);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* silencieux */
      }
      document.body.removeChild(ta);
      done();
    }
  };

  return (
    <button
      onClick={onCopy}
      className={`cursor-pointer inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase px-4 py-2.5 border transition-all duration-300 ${
        copied
          ? "border-green text-green bg-green/10"
          : "border-ink/30 text-ink hover:bg-ink hover:text-paper"
      }`}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 6.4 4.6 9 10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copié
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <rect x="3.5" y="3.5" width="7" height="7" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8.5 3.5v-2h-7v7h2" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          Copier la lettre
        </>
      )}
    </button>
  );
}
