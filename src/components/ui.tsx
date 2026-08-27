import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ---------- hook : élément visible dans le viewport ---------- */
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
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ---------- hook : compteur animé ---------- */
export function useCountUp(target: number, start: boolean, duration = 1300) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return val;
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
  sub?: string;
}) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <div className="flex items-center gap-4 mb-5">
        <span className="font-mono text-[11px] tracking-[0.22em] text-tox">
          SECTION {no}
        </span>
        <span className="h-px flex-1 bg-line" />
        <span className="mono-label">{kicker}</span>
      </div>
      <h2 className="font-display font-800 font-extrabold uppercase leading-[0.98] text-3xl sm:text-4xl lg:text-[3.3rem] tracking-tight max-w-4xl">
        {title}
      </h2>
      {sub && (
        <p className="mt-5 max-w-2xl text-fog text-[15px] leading-relaxed">
          {sub}
        </p>
      )}
    </Reveal>
  );
}

/* ---------- bouton copier ---------- */
export function CopyBtn({ text, light = false }: { text: string; light?: boolean }) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(() => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
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
  }, [text]);

  return (
    <button
      onClick={onCopy}
      className={`group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase px-3 py-2 border transition-all duration-300 cursor-pointer ${
        light
          ? "border-paperink/30 text-paperink hover:bg-paperink hover:text-paper"
          : copied
            ? "border-ok/60 text-ok bg-ok/10"
            : "border-line2 text-fog hover:text-bone hover:border-fog"
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
          Copier
        </>
      )}
    </button>
  );
}

/* ---------- jauge de toxicité ---------- */
export function ToxicMeter({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1" title={`Toxicité ${level}/5`} aria-label={`Toxicité ${level} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`w-[7px] h-[14px] skew-x-[-12deg] ${
            i <= level ? (level >= 5 ? "bg-tox" : "bg-amb") : "bg-line"
          }`}
        />
      ))}
    </div>
  );
}
