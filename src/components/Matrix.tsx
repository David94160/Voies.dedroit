import { useState } from "react";
import { MATRIX } from "../data";
import { Reveal, SectionHead, ToxicMeter } from "./ui";

type Filter = "all" | "propre" | "sans";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "propre", label: "Avec variant propre" },
  { id: "sans", label: "Sans variant propre" },
];

export function Matrix() {
  const [filter, setFilter] = useState<Filter>("all");

  const rows = MATRIX.filter((r) =>
    filter === "all" ? true : filter === "propre" ? r.propre !== null : r.propre === null
  );

  return (
    <section id="matrice" className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32">
      <SectionHead
        no="02"
        kicker="Phase 01 — exécution immédiate"
        title={
          <>
            Matrice d'inversion
            <br />
            <span className="stroke-title">sémantique</span>
          </>
        }
        sub="Pour chaque requête du cluster : deux chemins alternatifs. Le variant PROPRE blanchit le mot-clé par le vocabulaire bancaire légitime ; le variant DÉMENTI le rebind à l'affidavit de 2019. L'intention de recherche est capturée dans les deux sens."
      />

      {/* filtres */}
      <Reveal>
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {FILTERS.map((f) => {
            const count =
              f.id === "all"
                ? MATRIX.length
                : f.id === "propre"
                  ? MATRIX.filter((r) => r.propre !== null).length
                  : MATRIX.filter((r) => r.propre === null).length;
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`cursor-pointer font-mono text-[11px] tracking-[0.16em] uppercase px-4 py-2.5 border transition-all duration-300 ${
                  active
                    ? "border-ok/70 text-ok bg-ok/10"
                    : "border-line text-fog hover:text-bone hover:border-line2"
                }`}
              >
                {f.label} <span className={active ? "text-ok/70" : "text-dim"}>({String(count).padStart(2, "0")})</span>
              </button>
            );
          })}
          <span className="ml-auto hidden md:flex items-center gap-2 font-mono text-[10.5px] tracking-[0.14em] uppercase text-dim">
            <span className="w-2 h-2 bg-amb inline-block skew-x-[-12deg]" /> toxicité
            <span className="ml-2 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`w-[5px] h-[10px] skew-x-[-12deg] ${i <= 4 ? "bg-amb" : "bg-line"}`} />
              ))}
            </span>
          </span>
        </div>
      </Reveal>

      {/* lignes */}
      <div className="space-y-4">
        {rows.map((r, i) => (
          <Reveal key={r.kw} delay={i * 60}>
            <article
              className={`group panel p-5 sm:p-6 border-l-2 transition-all duration-300 hover:translate-x-1 hover:bg-panel2 ${
                r.toxicity >= 5 ? "border-l-tox" : r.toxicity >= 4 ? "border-l-amb" : "border-l-cyn"
              }`}
            >
              {/* ligne 1 : requête + intention */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
                <span className="font-mono text-[11px] text-dim">
                  {String(MATRIX.indexOf(r) + 1).padStart(2, "0")}
                </span>
                <h3 className="font-mono font-medium text-[15px] sm:text-base text-tox">
                  « {r.kw} »
                </h3>
                <ToxicMeter level={r.toxicity} />
                {r.bonus && (
                  <span className="font-mono text-[9.5px] tracking-[0.16em] uppercase border border-cyn/50 text-cyn px-2 py-0.5">
                    Bonus — protection de marque
                  </span>
                )}
                <p className="ml-auto basis-full lg:basis-auto lg:max-w-[300px] text-[12px] italic text-dim leading-snug text-left lg:text-right">
                  {r.intention}
                </p>
              </div>

              {/* ligne 2 : les deux chemins */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`border p-4 transition-colors ${r.propre ? "border-ok/25 bg-ok/[0.04] hover:bg-ok/[0.08]" : "border-line bg-abyss/40"}`}>
                  <p className="mono-label text-ok mb-2.5 flex items-center gap-2">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
                      <path d="M1.5 8.5 4 6l2 2 3.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Chemin propre — banque / finance CH
                  </p>
                  {r.propre ? (
                    <p className="text-[13.5px] text-bone/90 leading-relaxed">{r.propre}</p>
                  ) : (
                    <p className="text-[13px] text-dim leading-relaxed">
                      <span className="text-tox font-mono text-[11px] tracking-[0.14em] uppercase">Aucun</span>
                      {" "}— requête politiquement / économiquement toxique, blanchiment impossible. Traitement 100 % démenti.
                    </p>
                  )}
                </div>
                <div className="border border-amb/25 bg-amb/[0.04] hover:bg-amb/[0.08] transition-colors p-4">
                  <p className="mono-label text-amb mb-2.5 flex items-center gap-2">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
                      <path d="M5.5 1v6M5.5 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Chemin démenti — juridique / affidavit
                  </p>
                  <p className="text-[13.5px] text-bone/90 leading-relaxed">{r.dementi}</p>
                </div>
              </div>

              {/* ligne 3 : page cible */}
              <div className="mt-4 flex items-start gap-3">
                <span className="mono-label text-cyn shrink-0 pt-0.5">Page cible</span>
                <span className="h-px flex-1 bg-line mt-2.5 hidden sm:block" />
                <p className="text-[13px] text-fog leading-relaxed sm:text-right sm:max-w-[62%]">
                  {r.cible}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mt-8 text-center font-mono text-[11px] tracking-[0.18em] uppercase text-dim">
          <span className="text-ok">■</span> 10 à 15 pages déployées sur cette matrice — signal massif vs signal isolé de 2017
        </p>
      </Reveal>
    </section>
  );
}
