import { useState } from "react";
import { CHECKLIST, DEAD_ENDS } from "../data";
import { ProgressRing, Reveal, SectionHead, Stamp } from "./ui";

function Checklist() {
  const [checked, setChecked] = useState<boolean[]>(() => CHECKLIST.map(() => false));
  const pct = (checked.filter(Boolean).length / CHECKLIST.length) * 100;
  const allDone = pct === 100;

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)));

  return (
    <div className="card p-6 sm:p-8 h-full flex flex-col">
      <div className="flex items-center gap-5 mb-6">
        <ProgressRing pct={pct} />
        <div>
          <p className="mono-label text-royal font-semibold">Checklist — page de mise au point officielle</p>
          <p className="text-[13px] text-fog mt-1 leading-snug">
            Une réponse de première partie, assumée et vérifiable, vaut mieux que dix pages anonymes.
          </p>
        </div>
      </div>
      <ul className="space-y-3 flex-1">
        {CHECKLIST.map((item, i) => {
          const on = checked[i];
          return (
            <li key={i}>
              <button
                onClick={() => toggle(i)}
                className={`w-full text-left flex items-start gap-3.5 border px-4 py-3.5 cursor-pointer transition-all duration-200 ${
                  on ? "border-green/60 bg-green/[0.06]" : "border-line bg-paper hover:border-fog"
                }`}
                aria-pressed={on}
              >
                <span
                  className={`mt-0.5 w-[18px] h-[18px] shrink-0 border-2 flex items-center justify-center transition-colors ${
                    on ? "bg-green border-green" : "border-fog/50 bg-card"
                  }`}
                >
                  {on && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <path d="M1.5 5.4 4 7.8 8.5 2.2" stroke="#f3f5f2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className={`text-[13px] leading-relaxed transition-colors ${on ? "text-ink font-medium" : "text-fog"}`}>
                  {item.text}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className={`mt-6 pt-5 border-t border-linesoft transition-opacity duration-500 ${allDone ? "opacity-100" : "opacity-40"}`}>
        <Stamp tone={allDone ? "green" : "amber"} rot="-3deg">
          {allDone ? "Prête à publier" : `${CHECKLIST.filter((_, i) => checked[i]).length}/${CHECKLIST.length} — complétez la fiche`}
        </Stamp>
      </div>
    </div>
  );
}

export function Guardrails() {
  return (
    <section id="garde-fous" className="mx-auto max-w-6xl px-5 sm:px-8 pt-20 sm:pt-28 pb-16">
      <SectionHead
        no="03"
        kicker="Garde-fous"
        title={
          <>
            Ce qui ne marche pas —
            <br />
            <em className="text-stamp font-semibold">et qui se retourne</em>
          </>
        }
        sub="Les « systèmes » qui promettent d'étouffer un article par la manipulation des classements échouent presque toujours, et laissent des traces. En voici trois, et pourquoi."
      />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* impasses */}
        <Reveal>
          <div className="space-y-4">
            {DEAD_ENDS.map((d, i) => (
              <div key={d.title} className="card border-l-4 border-l-stamp p-5 sm:p-6 group hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <span className="shrink-0 w-9 h-9 border-2 border-stamp text-stamp flex items-center justify-center font-display font-black text-lg select-none">
                    ✕
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-lg text-inkdeep leading-tight">{d.title}</h3>
                    <p className="text-[13.5px] text-fog leading-relaxed mt-2">{d.body}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="card border-l-4 border-l-green p-5 sm:p-6">
              <p className="text-[14px] text-ink leading-relaxed">
                <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-green font-semibold block mb-2">
                  La seule logique qui tienne
                </span>
                La crédibilité est le seul actif qui s'apprécie avec le temps. Un dossier
                documenté, daté et transparent finit par peser plus lourd qu'un article
                isolé — c'est exactement ce que la loi et les moteurs récompensent.
              </p>
            </div>
          </div>
        </Reveal>

        {/* checklist */}
        <Reveal delay={140}>
          <Checklist />
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-paperdeep/70">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
        <div className="grid sm:grid-cols-2 gap-8 items-start">
          <div>
            <p className="font-display font-black text-lg text-inkdeep">
              Voies<span className="text-stamp">.</span>de droit
            </p>
            <p className="text-[12.5px] text-fog leading-relaxed mt-2 max-w-md">
              Fiche d'information indépendante sur les recours ouverts aux personnes mises en
              cause dans des contenus de presse en ligne. Elle ne remplace pas un avocat
              spécialisé en droit de la presse ou en droit du numérique.
            </p>
          </div>
          <div className="sm:text-right">
            <p className="mono-label mb-3">Textes cités</p>
            <ul className="font-mono text-[11px] text-fog space-y-1.5">
              <li>Loi du 29 juillet 1881 — <a className="underline underline-offset-2 hover:text-royal" href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000877119" target="_blank" rel="noopener noreferrer">Légifrance ↗</a></li>
              <li>LCEN n° 2004-575 — art. 6</li>
              <li>RGPD (UE) 2016/679 — art. 12 & 17</li>
              <li>CJUE, Google Spain, C-131/12 (13 mai 2014)</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center gap-x-6 gap-y-2 justify-between">
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-fog">
            Dernière révision : {new Date().toLocaleDateString("fr-FR")}
          </p>
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-fog">
            Ne constitue pas un conseil juridique
          </p>
        </div>
      </div>
    </footer>
  );
}
