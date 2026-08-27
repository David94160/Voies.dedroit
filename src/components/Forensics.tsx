import { FEEDBACK_LOOPS, PYTHON } from "../data";
import { CopyBtn, Reveal, SectionHead } from "./ui";

const THRESHOLDS = [
  { cond: "impressions > 100 ∧ clics = 0", action: "modifier le Title Tag du HUB", tone: "text-tox" },
  { cond: "CTR adverse < 2 %", action: "obsolescence engagée — maintenir l'inondation", tone: "text-ok" },
  { cond: "nouvelle requête mutante détectée", action: "spoke dédié + balisage démenti sous 72 h", tone: "text-amb" },
];

export function Forensics() {
  return (
    <section id="forensique" className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32">
      <SectionHead
        no="05"
        kicker="Forensique — le sniffer de CTR"
        title={
          <>
            Brancher le script sur
            <br />
            <span className="text-cyn">le cerveau de Google</span>
          </>
        }
        sub="Les outils SaaS voient la surface. Le wrapper google-searchconsole interroge directement l'API Search Analytics : requêtes mutantes, tests A/B de snippets et preuve de désindexation, en boucle quotidienne."
      />

      <div className="grid lg:grid-cols-12 gap-5">
        {/* code */}
        <Reveal className="lg:col-span-7">
          <div className="panel flex flex-col h-full">
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-line">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="text-amb">
                <path d="M4.5 3.5 1 7l3.5 3.5M9.5 3.5 13 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-mono text-[11.5px] tracking-[0.12em] text-bone/90">sniffer_ctr.py</span>
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-dim hidden sm:inline">
                — google-searchconsole · API Search Analytics
              </span>
              <span className="ml-auto"><CopyBtn text={PYTHON} /></span>
            </div>
            <pre className="code-scroll flex-1 overflow-auto px-5 sm:px-6 py-5 font-mono text-[12px] leading-[1.8] text-bone/85 max-h-[560px]">
{PYTHON.split("\n").map((line, i) => (
  <span key={i} className={`block ${line.trim().startsWith("#") ? "text-dim italic" : ""}`}>
    {line || " "}
  </span>
))}
            </pre>
          </div>
        </Reveal>

        {/* boucles + limite */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {FEEDBACK_LOOPS.map((l, i) => (
            <Reveal key={l.no} delay={i * 100}>
              <div className="panel p-6 group hover:border-cyn/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-display font-extrabold text-2xl text-cyn/80 group-hover:text-cyn transition-colors">{l.no}</span>
                  <span className="h-px flex-1 bg-line" />
                  <span className="mono-label">Boucle {l.no}</span>
                </div>
                <h3 className="font-display font-bold uppercase tracking-tight text-[15px] mb-2.5">{l.title}</h3>
                <p className="text-[13px] text-fog leading-relaxed">{l.body}</p>
              </div>
            </Reveal>
          ))}

          <Reveal delay={300}>
            <div className="border border-amb/50 bg-amb/[0.06] p-6">
              <p className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-amb mb-3">
                ⚠ Limite systémique — ce que Google cache
              </p>
              <p className="text-[13px] text-fog leading-relaxed">
                L'API ne remonte que les propriétés <em className="text-bone">vérifiées</em> : jamais le CTR
                direct de l'article adverse. La parade est arithmétique — le volume de
                recherche d'une requête étant quasi stable, chaque point de part de
                clic gagné par le HUB est un point d'oxygène retiré à la cible.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* seuils tactiques */}
      <Reveal className="mt-10">
        <div className="panel">
          <div className="px-6 py-4 border-b border-line flex items-center gap-3">
            <span className="mono-label"><span className="text-tox">▸</span> Seuils d'alerte tactique du sniffer</span>
          </div>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-line">
            {THRESHOLDS.map((t) => (
              <div key={t.cond} className="px-6 py-5 group hover:bg-panel2 transition-colors">
                <p className={`font-mono text-[12px] mb-2.5 ${t.tone}`}>{t.cond}</p>
                <p className="text-[13px] text-fog leading-relaxed">→ {t.action}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
