import { useState } from "react";
import { ROUTES, type RouteStatus } from "../data";
import { Reveal, SectionHead, Stamp } from "./ui";

const STATUS_TONE: Record<RouteStatus, "red" | "green" | "amber" | "blue"> = {
  clos: "red",
  etroit: "amber",
  ouvert: "green",
  "cas-par-cas": "blue",
};

const STATUS_BORDER: Record<RouteStatus, string> = {
  clos: "border-l-stamp",
  etroit: "border-l-amber",
  ouvert: "border-l-green",
  "cas-par-cas": "border-l-royal",
};

function RouteCard({ index }: { index: number }) {
  const [open, setOpen] = useState(index === ROUTES.length - 1); // RGPD ouvert par défaut
  const r = ROUTES[index];

  return (
    <Reveal delay={(index % 2) * 90}>
      <article
        className={`card border-l-4 ${STATUS_BORDER[r.status]} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(13,23,32,0.45)]`}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full text-left px-5 sm:px-7 py-5 cursor-pointer group"
          aria-expanded={open}
        >
          <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
            <span className="font-display font-black text-2xl text-line leading-none select-none group-hover:text-fog transition-colors">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-[240px]">
              <h3 className="font-display font-bold text-lg sm:text-xl text-inkdeep leading-tight group-hover:text-royal transition-colors">
                {r.name}
              </h3>
              <p className="font-mono text-[11px] tracking-[0.08em] text-fog mt-1.5">{r.basis}</p>
              <p className="text-[13.5px] text-fog leading-relaxed mt-2.5 max-w-2xl">{r.summary}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Stamp tone={STATUS_TONE[r.status]} rot={r.stampRot}>
                {r.statusLabel}
              </Stamp>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className={`text-fog transition-transform duration-400 ${open ? "rotate-180" : ""}`}
                aria-hidden
              >
                <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </button>

        <div className={`acc-body ${open ? "open" : ""}`}>
          <div className="acc-inner">
            <div className="px-5 sm:px-7 pb-6 pt-1 border-t border-linesoft">
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
                <div>
                  <p className="mono-label text-royal mb-1.5">Ce que c'est</p>
                  <p className="text-[13.5px] leading-relaxed text-ink">{r.detail.what}</p>
                </div>
                <div>
                  <p className="mono-label text-royal mb-1.5">La procédure</p>
                  <p className="text-[13.5px] leading-relaxed text-ink">{r.detail.procedure}</p>
                </div>
                <div>
                  <p className="mono-label text-royal mb-1.5">Le délai</p>
                  <p className="text-[13.5px] leading-relaxed text-ink">{r.detail.delay}</p>
                </div>
                <div>
                  <p className="mono-label text-royal mb-1.5">En réalité</p>
                  <p className="text-[13.5px] leading-relaxed text-ink">{r.detail.reality}</p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-linesoft flex flex-wrap gap-2">
                {r.refs.map((ref) => (
                  <span key={ref} className="font-mono text-[10.5px] tracking-[0.06em] px-2.5 py-1.5 bg-paperdeep border border-line text-fog">
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function Routes() {
  return (
    <section id="voies" className="mx-auto max-w-6xl px-5 sm:px-8 pt-20 sm:pt-28">
      <SectionHead
        no="01"
        kicker="Les recours, sans illusion"
        title={
          <>
            Cinq voies. Deux sont closes,
            <br />
            deux sont ouvertes. <em className="text-royal font-semibold">Sachez-le avant d'agir.</em>
          </>
        }
        sub="Chaque recours est présenté avec son fondement exact, son délai réel et ce qu'il peut — et ne peut pas — produire. Dérouler une voie pour le détail."
      />
      <div className="space-y-4">
        {ROUTES.map((_, i) => (
          <RouteCard key={ROUTES[i].id} index={i} />
        ))}
      </div>
      <Reveal delay={120}>
        <p className="mt-7 text-center font-mono text-[11px] tracking-[0.16em] uppercase text-fog">
          Un avocat spécialisé en droit de la presse valide le choix de voie en une consultation —
          c'est moins cher qu'une stratégie vouée à l'échec.
        </p>
      </Reveal>
    </section>
  );
}
