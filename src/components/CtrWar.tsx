import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CTR_METRICS, LOG_POOL, TIMELINE } from "../data";
import { Reveal, SectionHead, useCountUp, useInView } from "./ui";

const TONE_TEXT = { ok: "text-ok", tox: "text-tox", cyn: "text-cyn", amb: "text-amb" } as const;
const TONE_DOT = { ok: "bg-ok", tox: "bg-tox", cyn: "bg-cyn", amb: "bg-amb" } as const;

/* ---------- tuile de métrique ---------- */
function Metric({ label, value, fmt, tone, blink, start, delay }: {
  label: string; value: number; fmt: string; tone: "ok" | "tox" | "cyn" | "amb";
  blink?: boolean; start: boolean; delay: number;
}) {
  const v = useCountUp(value, start, 1500);
  const display =
    fmt === "pct" ? `${Math.round(v)} %` : fmt === "dec" ? `${v.toFixed(1).replace(".", ",")} %` : Math.round(v).toLocaleString("fr-FR");
  return (
    <Reveal delay={delay}>
      <div className="panel p-5 h-full group hover:border-line2 transition-colors">
        <p className="mono-label mb-3">{label}</p>
        <p className={`font-display font-extrabold text-3xl sm:text-4xl tabular-nums ${TONE_TEXT[tone]} ${blink ? "soft-blink" : ""}`}>
          {display}
        </p>
        <div className="mt-3 h-[3px] w-8 group-hover:w-16 transition-all duration-500">
          <div className={`h-full w-full ${TONE_DOT[tone]} opacity-60`} />
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- graphe CTR ---------- */
function CtrChart() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const lineStyle = (delay: number): CSSProperties => ({
    strokeDasharray: 1,
    strokeDashoffset: inView ? 0 : 1,
    transition: `stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
  });
  const areaStyle = (delay: number): CSSProperties => ({
    opacity: inView ? 1 : 0,
    transition: `opacity 1.4s ease ${delay}ms`,
  });

  return (
    <div ref={ref}>
      <svg viewBox="0 0 560 232" className="w-full h-auto">
        <defs>
          <linearGradient id="gradTox" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff5c5c" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ff5c5c" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradOk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3dd68c" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3dd68c" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* grille + graduations */}
        {[0, 5, 10, 15, 20].map((p) => {
          const y = 214 - (p / 22) * 198;
          return (
            <g key={p}>
              <line x1="34" y1={y} x2="552" y2={y} stroke="#1e2c38" strokeWidth="1" strokeDasharray={p === 0 ? "0" : "2 5"} />
              <text x="26" y={y + 3} textAnchor="end" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" fill="#5c7280">
                {p}%
              </text>
            </g>
          );
        })}

        {/* seuil d'obsolescence */}
        <line x1="34" y1="196" x2="552" y2="196" stroke="#f2b441" strokeWidth="1.1" strokeDasharray="7 5" opacity="0.75" />
        <text x="548" y="190" textAnchor="end" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" letterSpacing="1.2" fill="#f2b441">
          SEUIL D'OBSOLESCENCE — 2%
        </text>

        {/* article adverse : 21% → 1,4% */}
        <path d="M34,25 C 130,30 210,95 300,140 C 395,178 490,192 552,200 L552,214 L34,214 Z" fill="url(#gradTox)" style={areaStyle(700)} />
        <path d="M34,25 C 130,30 210,95 300,140 C 395,178 490,192 552,200" fill="none" stroke="#ff5c5c" strokeWidth="2.2" pathLength={1} style={lineStyle(200)} />

        {/* HUB : 0,4% → 9% */}
        <path d="M34,210 C 160,208 270,192 370,166 C 455,144 515,142 552,133 L552,214 L34,214 Z" fill="url(#gradOk)" style={areaStyle(900)} />
        <path d="M34,210 C 160,208 270,192 370,166 C 455,144 515,142 552,133" fill="none" stroke="#3dd68c" strokeWidth="2.2" pathLength={1} style={lineStyle(450)} />

        {/* marqueurs finaux */}
        <circle cx="552" cy="200" r="4" fill="#ff5c5c" className={inView ? "soft-blink" : ""} />
        <circle cx="552" cy="133" r="4" fill="#3dd68c" />
        <text x="540" y="212" textAnchor="end" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="#ff5c5c">1,4%</text>
        <text x="540" y="126" textAnchor="end" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="#3dd68c">9,0%</text>

        {/* abscisses */}
        {[["J0", 34], ["J30", 207], ["J60", 379], ["J90", 552]].map(([l, x]) => (
          <text key={l as string} x={x as number} y="229" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.5" fill="#7e93a0">
            {l}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ---------- flux tactique ---------- */
type LogLine = { t: string; lvl: string; tone: "ok" | "tox" | "cyn" | "amb"; msg: string };

function LiveFeed() {
  const stamp = () => new Date().toISOString().slice(11, 19);
  const [lines, setLines] = useState<LogLine[]>(() =>
    LOG_POOL.slice(0, 3).map((l) => ({ t: stamp(), ...l }))
  );
  const idx = useRef(3);

  useEffect(() => {
    const id = window.setInterval(() => {
      const next = LOG_POOL[idx.current % LOG_POOL.length];
      idx.current += 1;
      setLines((prev) => [...prev.slice(-6), { t: stamp(), ...next }]);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="panel flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
        <p className="mono-label">
          <span className="text-ok">▸</span> Flux tactique — Search Console API
        </p>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase text-tox">
          <span className="w-1.5 h-1.5 rounded-full bg-tox pulse-tox" /> rec
        </span>
      </div>
      <div className="flex-1 p-4 sm:p-5 space-y-2.5 font-mono text-[11.5px] leading-relaxed overflow-hidden min-h-[300px]">
        {lines.map((l, i) => (
          <p key={`${l.t}-${i}`} className="log-line flex gap-2.5 items-start">
            <span className="text-dim shrink-0 tabular-nums">{l.t}</span>
            <span className={`shrink-0 font-semibold tracking-[0.1em] ${TONE_TEXT[l.tone]}`}>[{l.lvl}]</span>
            <span className="text-bone/80">{l.msg}</span>
          </p>
        ))}
        <p className="text-dim">
          <span className="caret text-ok">▍</span>
        </p>
      </div>
    </div>
  );
}

export function CtrWar() {
  const metrics = useInView<HTMLDivElement>(0.3);

  return (
    <section id="ctr" className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32">
      <SectionHead
        no="04"
        kicker="Phase 03 — guerre du CTR & inondation"
        title={
          <>
            Tuer le clic adverse,
            <br />
            <span className="stroke-title">pas la page</span>
          </>
        }
        sub="Impossible de supprimer l'article — inutile d'essayer. Sous 2 % de CTR, l'algorithme le déclare obsolète et le rétrograde de lui-même. Le sniffer surveille ce point de bascule 24/7."
      />

      {/* métriques */}
      <div ref={metrics.ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {CTR_METRICS.map((m, i) => (
          <Metric key={m.label} {...m} start={metrics.inView} delay={i * 90} />
        ))}
      </div>

      {/* graphe + flux */}
      <div className="grid lg:grid-cols-12 gap-5">
        <Reveal className="lg:col-span-7">
          <div className="panel p-5 sm:p-6 h-full flex flex-col">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4">
              <p className="mono-label">
                <span className="text-cyn">▸</span> Sniffer CTR — trajectoire J0 → J90
              </p>
              <div className="ml-auto flex items-center gap-4 font-mono text-[10px] tracking-[0.12em] uppercase">
                <span className="flex items-center gap-1.5 text-tox"><span className="w-3 h-[2px] bg-tox" /> article 2017</span>
                <span className="flex items-center gap-1.5 text-ok"><span className="w-3 h-[2px] bg-ok" /> hub</span>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <CtrChart />
            </div>
            <p className="mt-4 pt-4 border-t border-line text-[12px] text-dim leading-relaxed">
              Simulation based sur les seuils tactiques du sniffer — données réelles
              injectées par l'API Search Analytics dès le branchement.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-5">
          <LiveFeed />
        </Reveal>
      </div>

      {/* déduction mathématique */}
      <Reveal className="mt-5">
        <div className="panel border-l-2 border-l-cyn px-6 py-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="mono-label text-cyn">Déduction forensique</span>
          <p className="font-mono text-[12.5px] sm:text-[13.5px] text-bone/90">
            P(clic → HUB | requête du cluster) = <span className="text-ok font-semibold">78 %</span>
            <span className="mx-3 text-dim">⇒</span>
            −<span className="text-tox font-semibold">78 %</span> d'oxygène organique pour l'article de 2017
          </p>
          <p className="basis-full lg:basis-auto lg:ml-auto text-[12px] text-dim italic">
            Le volume de recherche étant stable, la part captée par le HUB est
            mathématiquement soustraite à la cible. C'est l'asphyxie.
          </p>
        </div>
      </Reveal>

      {/* calendrier 90 jours */}
      <div className="mt-20">
        <Reveal>
          <p className="mono-label mb-8">
            <span className="text-amb">▸</span> Calendrier de déploiement — fenêtre de 90 jours
          </p>
        </Reveal>
        <ol className="grid md:grid-cols-2 gap-x-10 gap-y-2">
          {TIMELINE.map((m, i) => (
            <Reveal key={m.t} delay={(i % 2) * 90}>
              <li className="group flex gap-5 border-t border-line py-6 hover:bg-panel transition-colors px-2">
                <span
                  className={`shrink-0 w-14 h-14 border flex items-center justify-center font-display font-extrabold text-sm ${
                    m.tone === "tox"
                      ? "border-tox/60 text-tox bg-tox/10"
                      : m.tone === "amb"
                        ? "border-amb/50 text-amb"
                        : m.tone === "ok"
                          ? "border-ok/50 text-ok"
                          : "border-cyn/50 text-cyn"
                  }`}
                >
                  {m.t}
                </span>
                <div>
                  <h3 className="font-display font-bold uppercase tracking-tight text-[15px] mb-1.5 group-hover:text-ok transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-[13px] text-fog leading-relaxed">{m.desc}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
