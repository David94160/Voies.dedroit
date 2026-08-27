import { useEffect, useState } from "react";
import { NAV, TICKER } from "../data";

/* ---------- horloge UTC ---------- */
function useUtcClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now.toISOString().slice(11, 19);
}

/* ---------- barre de commandement ---------- */
export function CommandBar() {
  const clock = useUtcClock();
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-[58px] flex items-center gap-4">
        <a href="#top" className="flex items-center gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-ok pulse-ok shrink-0" />
          <span className="font-mono text-[11px] tracking-[0.2em] text-fog hidden sm:block">
            OP-2017-LM
          </span>
          <span className="font-display font-extrabold uppercase tracking-tight text-[13px] text-bone truncate">
            Algorithme Inversé
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1 mx-auto">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="group px-3 py-2 font-mono text-[11px] tracking-[0.14em] uppercase text-fog hover:text-bone transition-colors"
            >
              <span className="text-tox mr-1.5 group-hover:text-ok transition-colors">{n.no}</span>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto lg:ml-0 flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-2 border border-ok/40 text-ok px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path d="M5 1 6.2 3.8 9 5 6.2 6.2 5 9 3.8 6.2 1 5 3.8 3.8Z" fill="currentColor" />
            </svg>
            White hat
          </span>
          <span className="font-mono text-[12px] tabular-nums text-cyn">{clock} UTC</span>
        </div>
      </div>
    </header>
  );
}

/* ---------- fond ambiant ---------- */
export function Background() {
  return (
    <div className="fixed inset-0 -z-10 bg-ink" aria-hidden>
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute -top-40 -left-40 w-[46rem] h-[46rem] glow-ok" />
      <div className="absolute top-1/3 -right-56 w-[50rem] h-[50rem] glow-tox" />
      <div className="absolute bottom-[-12rem] left-1/4 w-[40rem] h-[40rem] glow-cyn" />
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(7,11,15,0.85))]" />
    </div>
  );
}

/* ---------- bandeau défilant ---------- */
export function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="ticker-wrap border-y border-line bg-abyss/70 overflow-hidden py-2.5 select-none">
      <div className="ticker-track flex w-max items-center">
        {items.map((t, i) => (
          <span key={i} className="flex items-center font-mono text-[11px] tracking-[0.18em] uppercase text-fog whitespace-nowrap">
            <span className="mx-5 text-tox">▲</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- pied de page ---------- */
export function Footer() {
  return (
    <footer className="border-t border-line bg-abyss/80 mt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-ok pulse-ok" />
            <span className="font-display font-extrabold uppercase tracking-tight text-lg">
              Algorithme Inversé
            </span>
          </div>
          <p className="text-fog text-sm leading-relaxed max-w-sm">
            Console d'opération e-réputation — déréférencement par inversion
            sémantique, étouffement par effondrement d'engagement, maillage
            asymétrique vers la source de vérité.
          </p>
        </div>
        <div className="md:col-span-4">
          <p className="mono-label mb-4">Doctrine d'engagement</p>
          <ul className="space-y-2.5 text-sm text-fog">
            {["Chaque action est réelle et factuelle", "Chaque affirmation est vérifiable", "Chaque contenu est légal et opposable", "Rien que Google puisse pénaliser"].map((r) => (
              <li key={r} className="flex items-start gap-2.5">
                <span className="mt-1 w-1.5 h-1.5 bg-ok shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className="mono-label mb-4">Cadre</p>
          <p className="text-sm text-dim leading-relaxed">
            Outil de planification stratégique. Ne constitue ni un conseil
            juridique, ni une incitation à la manipulation d'avis. Les pièces
            citées (affidavit, démentis) engagent le dossier, pas cette console.
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-wrap items-center gap-3 justify-between">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-dim">
            OP-2017-LM · confidentiel · diffusion restreinte
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-dim">
            ClaimReview : faux / non prouvé — <span className="text-ok">signal actif</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
