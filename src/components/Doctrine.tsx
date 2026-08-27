import { DOCTRINE, FORENSIC_NOTES, PIECES } from "../data";
import { Reveal, SectionHead } from "./ui";

const TONE_TEXT = { ok: "text-ok", tox: "text-tox", cyn: "text-cyn", amb: "text-amb" } as const;
const TONE_BORDER = { ok: "border-ok/40", tox: "border-tox/40", cyn: "border-cyn/40", amb: "border-amb/40" } as const;

export function Doctrine() {
  return (
    <section id="doctrine" className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32">
      <SectionHead
        no="01"
        kicker="Doctrine — mode guerre, gants blancs"
        title={
          <>
            Retourner l'algorithme
            <br />
            <span className="text-tox">contre</span> l'accusation
          </>
        }
        sub="Trois leviers ordonnés, exécutés sous doctrine white hat stricte. Chaque contenu publié est réel, factuel, vérifiable et légal — c'est précisément ce qui le rend inattaquable et indexable."
      />

      <div className="grid lg:grid-cols-12 gap-10">
        {/* colonne sticky */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="font-display font-extrabold uppercase text-2xl leading-tight">
                Le signal ancien et isolé
                <span className="text-fog"> contre </span>
                le signal massif et frais.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 panel p-6">
                <p className="mono-label mb-5">Pièces au dossier</p>
                <ul className="space-y-4">
                  {PIECES.map((p, i) => (
                    <li key={p.label} className="flex gap-4 group">
                      <span className="font-mono text-[11px] text-ok pt-0.5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-bone group-hover:text-ok transition-colors">
                          {p.label}
                        </p>
                        <p className="text-[12.5px] text-dim leading-snug mt-0.5">{p.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-5 border-t border-line flex items-center gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="text-amb shrink-0">
                    <path d="M8 1.5 9.4 5.9 14 6.2 10.5 9.2 11.6 13.7 8 11.2 4.4 13.7 5.5 9.2 2 6.2 6.6 5.9Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                  </svg>
                  <p className="text-[11.5px] text-fog leading-snug">
                    Aucun transfert prouvé. Aucune condamnation. Le dossier est
                    notre munition — pas le silence.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* leviers */}
        <div className="lg:col-span-8">
          {DOCTRINE.map((d, i) => (
            <Reveal key={d.no} delay={i * 80}>
              <article className="group grid sm:grid-cols-[92px_1fr] gap-5 border-t border-line py-9 px-2 sm:px-4 hover:bg-panel transition-all duration-300 hover:pl-6">
                <div className={`font-display font-extrabold text-5xl sm:text-6xl leading-none ${TONE_TEXT[d.tone]} opacity-80 group-hover:opacity-100 transition-opacity`}>
                  {d.no}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="font-display font-bold uppercase text-xl sm:text-2xl tracking-tight">
                      {d.title}
                    </h3>
                    <span className={`font-mono text-[9.5px] tracking-[0.18em] uppercase border px-2 py-1 ${TONE_BORDER[d.tone]} ${TONE_TEXT[d.tone]}`}>
                      {d.tag}
                    </span>
                  </div>
                  <p className="text-[14.5px] text-fog leading-relaxed max-w-2xl">{d.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
          <div className="border-t border-line" />

          {/* lecture forensique — mosaïque asymétrique */}
          <Reveal className="mt-14">
            <p className="mono-label mb-6">
              <span className="text-cyn">▸</span> Lecture forensique de la méthode
            </p>
          </Reveal>
          <div className="grid md:grid-cols-12 gap-4">
            {FORENSIC_NOTES.map((n, i) => (
              <Reveal key={n.no} delay={i * 100} className={i === 0 ? "md:col-span-5" : i === 1 ? "md:col-span-4" : "md:col-span-3"}>
                <div className="panel h-full p-6 border-t-2 border-t-line2 hover:border-t-cyn transition-colors duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] text-cyn">{n.no}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="text-dim group-hover:text-cyn group-hover:translate-x-0.5 transition-all">
                      <path d="M2 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h4 className="font-display font-bold uppercase text-[15px] tracking-tight mb-3">{n.title}</h4>
                  <p className="text-[13px] text-fog leading-relaxed">{n.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
