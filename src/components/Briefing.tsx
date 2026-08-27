import { useEffect, useState } from "react";
import { STATS, TARGETS, TERMINAL_LINES } from "../data";
import { Reveal, useCountUp, useInView } from "./ui";
import { Ticker } from "./Chrome";

/* ---------- terminal à frappe live ---------- */
function Terminal() {
  const [progress, setProgress] = useState({ line: 0, ch: 0 });

  useEffect(() => {
    if (progress.line >= TERMINAL_LINES.length) return;
    const full = TERMINAL_LINES[progress.line];
    const delay = progress.ch < full.length ? 15 : 420;
    const t = window.setTimeout(() => {
      setProgress((p) => {
        const cur = TERMINAL_LINES[p.line];
        if (!cur) return p;
        return p.ch < cur.length
          ? { line: p.line, ch: p.ch + 1 }
          : { line: p.line + 1, ch: 0 };
      });
    }, delay);
    return () => window.clearTimeout(t);
  }, [progress]);

  return (
    <div className="panel flex flex-col h-full min-h-[360px]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
        <span className="w-2.5 h-2.5 rounded-full bg-tox/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amb/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-ok/80" />
        <span className="ml-3 font-mono text-[11px] tracking-[0.16em] text-dim">
          briefing.sh — canal sécurisé
        </span>
        <span className="ml-auto font-mono text-[10px] tracking-[0.16em] text-ok uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-ok pulse-ok" /> live
        </span>
      </div>
      <div className="p-5 font-mono text-[13px] leading-[1.9] text-bone/90 flex-1">
        {TERMINAL_LINES.slice(0, progress.line).map((l, i) => (
          <p key={i} className={l.startsWith("> statut") ? "text-amb" : l.endsWith("✓") ? "text-ok" : ""}>
            {l}
          </p>
        ))}
        {progress.line < TERMINAL_LINES.length && (
          <p className="text-cyn">
            {TERMINAL_LINES[progress.line].slice(0, progress.ch)}
            <span className="caret text-ok">▍</span>
          </p>
        )}
      </div>
      <div className="px-5 py-3 border-t border-line flex items-center justify-between">
        <span className="mono-label">chiffrement AES-256</span>
        <span className="font-mono text-[10px] text-dim">tty1 · root@hub</span>
      </div>
    </div>
  );
}

/* ---------- compteur ---------- */
function Stat({ value, suffix, label, start, delay }: {
  value: number; suffix: string; label: string; start: boolean; delay: number;
}) {
  const v = useCountUp(value, start);
  return (
    <Reveal delay={delay}>
      <div className="border-l-2 border-line pl-4 hover:border-ok transition-colors duration-300">
        <p className="font-display font-extrabold text-4xl sm:text-[2.7rem] tabular-nums leading-none">
          {Math.round(v)}
          <span className="text-ok">{suffix}</span>
        </p>
        <p className="mt-2 text-[12.5px] text-fog leading-snug">{label}</p>
      </div>
    </Reveal>
  );
}

/* ---------- ouverture de la console ---------- */
export function Briefing() {
  const stats = useInView<HTMLDivElement>(0.3);

  return (
    <section id="top" className="pt-[58px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-14 sm:pt-20 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* colonne briefing */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3 mb-7">
                <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-tox">
                  OP-2017-LM // Déréférencement & étouffement sémantique
                </span>
                <span className="hidden sm:block h-px w-10 bg-line2" />
                <span className="border border-amb/50 text-amb font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-1">
                  Phase active : 03
                </span>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="font-display font-extrabold uppercase leading-[0.94] tracking-tight text-[2.6rem] sm:text-6xl xl:text-[4.6rem]">
                L'algorithme
                <br />
                <span className="stroke-title">inversé</span>
                <span className="text-ok">.</span>
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-7 max-w-xl text-[15.5px] leading-relaxed text-fog">
                On n'optimise pas une page positive pour les mots-clés toxiques.
                On <strong className="text-bone font-semibold">inverse l'objectif</strong> :
                le cluster devient synonyme d'« info démentie », le clic est
                capté à la source, et toute l'autorité du web ruisselle vers
                une seule forteresse — jamais vers l'accusation.
              </p>
            </Reveal>

            {/* cibles */}
            <Reveal delay={260}>
              <div className="mt-9 panel border-l-2 border-l-tox p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <p className="mono-label text-tox">Cibles à enterrer — page 4+</p>
                  <span className="w-2 h-2 rounded-full bg-tox pulse-tox" />
                </div>
                <ul className="space-y-2.5">
                  {TARGETS.urls.map((u, i) => (
                    <li key={i} className="flex items-center gap-3 font-mono text-[12.5px] text-fog">
                      <span className="text-tox">✕</span>
                      <span className="text-dim">https://</span>
                      <span className="text-bone/80">{u.host}.fr</span>
                      <span className="text-dim">/{u.path}</span>
                      <span className="ml-auto hidden sm:inline font-mono text-[9.5px] tracking-[0.16em] uppercase text-dim border border-line px-1.5 py-0.5">
                        accès restreint
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-line">
                  <p className="mono-label mb-3">Cluster toxique à étouffer</p>
                  <div className="flex flex-wrap gap-2">
                    {TARGETS.cluster.map((c) => (
                      <span
                        key={c}
                        className="group font-mono text-[11px] px-2.5 py-1.5 border border-tox/35 text-tox/90 bg-tox/5 hover:bg-tox/15 hover:border-tox/70 transition-colors cursor-default"
                      >
                        « {c} »
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* colonne terminal */}
          <div className="lg:col-span-5">
            <Reveal delay={200} className="h-full">
              <Terminal />
            </Reveal>
          </div>
        </div>

        {/* compteurs */}
        <div ref={stats.ref} className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {STATS.map((s, i) => (
            <Stat key={s.label} {...s} start={stats.inView} delay={i * 90} />
          ))}
        </div>
      </div>

      <Ticker />
    </section>
  );
}
