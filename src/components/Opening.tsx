import { TIMELINE_ROWS, TIMELINE_X } from "../data";
import { Reveal, Stamp, useInView } from "./ui";

const NAV = [
  { id: "voies", label: "Les voies de droit" },
  { id: "lettre", label: "Demande RGPD" },
  { id: "garde-fous", label: "Garde-fous" },
];

function TopBar() {
  return (
    <header className="sticky top-0 z-40 bg-paper/95 border-b border-line">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-14 flex items-center gap-6">
        <a href="#top" className="flex items-baseline gap-2.5 group">
          <span className="font-display font-black text-lg tracking-tight text-inkdeep">
            Voies<span className="text-stamp">.</span>de droit
          </span>
          <span className="hidden sm:inline font-mono text-[10px] tracking-[0.18em] uppercase text-fog">
            — presse en ligne
          </span>
        </a>
        <nav className="ml-auto hidden md:flex items-center gap-6">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="font-mono text-[11px] tracking-[0.14em] uppercase text-fog hover:text-royal transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <span className="ml-auto md:ml-0 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-green border border-green/50 px-2.5 py-1.5 bg-green/5">
          <span className="w-1.5 h-1.5 rounded-full bg-green" />
          Fiche vivante — mise à jour
        </span>
      </div>
    </header>
  );
}

function CaseCard() {
  const rows = [
    { k: "Objet", v: "Article de presse en ligne, publication 2017, allégations contestées" },
    { k: "Actions loi 1881", v: "Délais expirés (droit de réponse, diffamation — 3 mois)" },
    { k: "Levier principal", v: "Déréférencement — art. 17 RGPD, sans prescription" },
    { k: "Pièce maîtresse", v: "Éléments nouveaux à verser : démentis, affidavit, identité" },
    { k: "Dernière révision", v: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }) },
  ];
  return (
    <div className="card border-l-4 border-l-royal">
      <div className="px-5 py-3 border-b border-line flex items-center justify-between">
        <p className="mono-label text-royal font-semibold">Fiche de dossier</p>
        <p className="font-mono text-[10px] tracking-[0.14em] text-fog">Réf. VD-2026/017</p>
      </div>
      <dl>
        {rows.map((r) => (
          <div key={r.k} className="px-5 py-3 border-b border-linesoft last:border-0 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <dt className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-fog sm:w-36 shrink-0">
              {r.k}
            </dt>
            <dd className="text-[13.5px] leading-snug font-medium text-ink">{r.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ---------- frise de prescription ---------- */
function PrescriptionFrieze() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const toneBar = { red: "bg-stamp", amber: "bg-amber", blue: "bg-royal", green: "bg-green" } as const;
  const toneText = { red: "text-stamp", amber: "text-amber", blue: "text-royal", green: "text-green" } as const;

  return (
    <div ref={ref}>
      <div className="space-y-5">
        {TIMELINE_ROWS.map((row, i) => (
          <div key={row.label} className="grid sm:grid-cols-[230px_1fr] gap-2 sm:gap-5 items-center group">
            <div>
              <p className="font-semibold text-[13.5px] text-ink leading-tight">{row.label}</p>
              <p className="font-mono text-[10.5px] text-fog mt-0.5">{row.law}</p>
            </div>
            <div>
              <div className="relative h-7 bg-paperdeep border border-line overflow-hidden">
                {row.open ? (
                  <div
                    className={`bar-grow absolute inset-0 ${toneBar[row.tone]} ${inView ? "on" : ""} opacity-85`}
                    style={{ transitionDelay: `${i * 160}ms` }}
                  />
                ) : (
                  <div
                    className={`absolute left-0 top-0 bottom-0 ${row.tone === "red" ? "hatched-red" : "hatched-soft"} border-r-2 ${row.tone === "red" ? "border-stamp" : "border-amber"} bg-card`}
                    style={{ width: inView ? "100%" : "0%", transition: `width 1.1s cubic-bezier(0.25,0.8,0.25,1) ${i * 160}ms` }}
                  />
                )}
                <span
                  className={`absolute inset-0 flex items-center px-3 font-mono text-[10px] tracking-[0.1em] uppercase ${
                    row.open ? "text-paper font-semibold" : toneText[row.tone]
                  }`}
                >
                  {row.window}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* axe des années */}
      <div className="mt-3 grid sm:grid-cols-[230px_1fr] gap-2 sm:gap-5">
        <span />
        <div className="flex justify-between font-mono text-[10px] tracking-[0.12em] text-fog border-t border-line pt-2">
          {TIMELINE_X.map((y, i) => (
            <span key={y} className={i === 0 ? "text-stamp font-semibold" : i === TIMELINE_X.length - 1 ? "text-ink font-semibold" : ""}>
              {y}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Opening() {
  return (
    <div id="top">
      <TopBar />
      <section className="bg-baselines relative">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-12 sm:pt-16 pb-14">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="mono-label mb-6">
                  Fiche pratique <span className="text-stamp">◆</span> contenus de presse en ligne contestés
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="font-display font-black text-[2.4rem] sm:text-6xl leading-[0.98] tracking-tight text-inkdeep">
                  Ce qu'on peut
                  <br />
                  <em className="font-display italic font-semibold text-royal">réellement</em> obtenir.
                  <br />
                  Et comment.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <div className="mt-7 max-w-xl relative">
                  <p className="text-[15.5px] leading-relaxed text-fog">
                    Quand on s'estime mis en cause à tort par un article ancien, la tentation est
                    grande de « manipuler l'algorithme ». Elle échoue — et aggrave le dossier.
                    La loi, elle, prévoit des voies précises, avec des délais précis.
                    Cette fiche les cartographie <strong className="text-ink">honnêtement</strong> :
                    ce qui est clos, ce qui est étroit, et ce qui reste réellement ouvert.
                  </p>
                  <div className="mt-7">
                    <Stamp tone="red" rot="-5deg" delay={500}>
                      Document d'information — pas un conseil juridique
                    </Stamp>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={220}>
                <CaseCard />
              </Reveal>
              <Reveal delay={320}>
                <div className="mt-4 card px-5 py-4 border-l-4 border-l-stamp">
                  <p className="text-[13px] leading-relaxed text-ink">
                    <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-stamp font-semibold block mb-1.5">
                      Lecture honnête du dossier type
                    </span>
                    Pour une publication de <strong>septembre 2017</strong>, les actions de presse
                    (réponse, diffamation) sont prescrites depuis décembre 2017. Les leviers qui
                    restent : la <strong>rectification amiable</strong> et le{" "}
                    <strong>déréférencement RGPD</strong>.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* frise */}
          <Reveal delay={150} className="mt-14">
            <div className="card p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <p className="mono-label">
                  <span className="text-royal font-semibold">▸</span> Frise des délais — où en est chaque voie
                </p>
                <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.12em] uppercase">
                  <span className="flex items-center gap-1.5 text-stamp"><span className="w-3 h-[3px] bg-stamp" /> close</span>
                  <span className="flex items-center gap-1.5 text-green"><span className="w-3 h-[3px] bg-green" /> ouverte</span>
                </div>
              </div>
              <PrescriptionFrieze />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
