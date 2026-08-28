import { DSA_TEMPLATE } from "../data";
import { CopyBtn, Reveal, SectionHead, Stamp, useInView } from "./ui";

const ANGLES = [
  {
    title: "Visuel orphelin sur le CDN",
    basis: "Droit à l'image (art. 9 C. civ.) — image déconnectée de tout article",
    verdict: "Défendable : c'est le cas le plus solide, car objectif et détaché du contenu éditorial.",
    pct: 78,
    tone: "bg-green",
    text: "text-green",
  },
  {
    title: "Article de presse chez l'hébergeur",
    basis: "Diffamation — notification DSA art. 16",
    verdict:
      "Refus probable et légitime sans décision de justice. Ce qu'on obtient : une décision motivée (art. 17) qui alimente le dossier de référé et un éventuel signalement Arcom.",
    pct: 46,
    tone: "bg-amber",
    text: "text-amber",
  },
  {
    title: "« Données inexactes et obsolètes »",
    basis: "RGPD art. 16/17 invoqué sur un contenu journalistique",
    verdict:
      "Appoint au dossier, pas un fondement autonome : l'art. 85 RGPD protège le traitement journalistique et un affidavit est une déclaration unilatérale, pas une constatation d'inexactitude.",
    pct: 24,
    tone: "bg-stamp",
    text: "text-stamp",
  },
];

const MECHANICS = [
  {
    ref: "Art. 16 DSA",
    body: "Tout hébergeur visant l'UE doit traiter les notifications de manière diligente, objective et non arbitraire.",
    note: "Le délai de « 72 h » n'existe pas dans le texte — le citer faux décrédibilise la notification.",
    mark: true,
  },
  {
    ref: "Art. 17 DSA",
    body: "En cas de refus ou d'action partielle : décision motivée et voies de recours internes obligatoires.",
    note: "C'est cette décision motivée qui construit le dossier de référé — la notification est un levier de pression et de preuve, pas un interrupteur.",
    mark: false,
  },
  {
    ref: "Art. 20 DSA + Arcom",
    body: "Mécanisme de plainte interne, puis recours externe ; en France, le coordinateur des services numériques est l'Arcom.",
    note: "Un hébergeur qui ignore systématiquement des notifications documentées s'expose à un signalement.",
    mark: false,
  },
  {
    ref: "Liberté de la presse",
    body: "Un contenu de presse n'est « manifestement illicite » qu'après décision de justice.",
    note: "L'hébergeur peut donc légitimement refuser le retrait d'un article — et le fait presque toujours sans jugement.",
    mark: false,
  },
];

function AngleMeters() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className="space-y-5">
      {ANGLES.map((a, i) => (
        <div
          key={a.title}
          className="border border-line bg-card p-5 hover:border-fog hover:-translate-y-0.5 transition-all duration-300 group"
        >
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1.5">
            <h3 className="font-display font-bold text-[15.5px] text-ink">{a.title}</h3>
            <span className={`font-mono text-[10px] tracking-[0.14em] uppercase ${a.text}`}>
              plausibilité {a.pct} %
            </span>
          </div>
          <p className="font-mono text-[11px] text-fog mb-3">{a.basis}</p>
          <div className="h-[7px] bg-paperdeep border border-line mb-3 overflow-hidden">
            <div
              className={`h-full ${a.tone} transition-all duration-1000 ease-out`}
              style={{ width: inView ? `${a.pct}%` : "0%", transitionDelay: `${i * 150}ms` }}
            />
          </div>
          <p className="text-[13px] text-fog leading-relaxed group-hover:text-ink/80 transition-colors">
            {a.verdict}
          </p>
        </div>
      ))}
    </div>
  );
}

export function Host() {
  return (
    <section id="hebergeur" className="mx-auto max-w-6xl px-5 sm:px-8 pt-20 sm:pt-28">
      <SectionHead
        no="04"
        kicker="Levier serveur — règlement (UE) 2022/2065"
        title={
          <>
            Notifier l'hébergeur,
            <br />
            <em className="text-royal font-semibold">sans se raconter d'histoires</em>
          </>
        }
        sub="Un hébergeur retire ou bloque — il ne « rétrograde » rien. Une URL qui renvoie 404/410 est désindexée par Google en 1 à 4 semaines. Encore faut-il que la notification ait une chance d'aboutir : voici la mécanique réelle."
      />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* mécanique corrigée */}
        <Reveal>
          <div className="card p-6 sm:p-8 h-full">
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="mono-label">
                <span className="text-royal font-semibold">▸</span> La mécanique DSA, corrigée
              </p>
              <Stamp tone="red" rot="-6deg" className="text-[9px]">
                Pas de kill-switch
              </Stamp>
            </div>
            <ol className="space-y-5">
              {MECHANICS.map((m, i) => (
                <li key={m.ref} className="flex gap-4 group">
                  <span
                    className={`shrink-0 h-fit font-mono text-[10px] tracking-[0.12em] uppercase px-2 py-1.5 border ${
                      m.mark ? "border-stamp/60 text-stamp bg-stamp/[0.07]" : "border-line text-fog"
                    }`}
                  >
                    {m.ref}
                  </span>
                  <div>
                    <p className="text-[13.5px] text-ink leading-relaxed font-medium">{m.body}</p>
                    <p
                      className={`mt-1.5 text-[12.5px] leading-relaxed ${
                        m.mark ? "text-stamp font-semibold" : "text-fog italic"
                      }`}
                    >
                      {m.mark ? "⚠ " : "— "}
                      {m.note}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-7 pt-5 border-t border-line text-[12.5px] text-fog leading-relaxed">
              <strong className="text-ink">Avant d'envoyer :</strong> identifiez l'hébergeur réel
              (WHOIS, enregistrements DNS, en-têtes HTTP). Derrière un CDN, notifiez{" "}
              <strong className="text-ink">et</strong> le CDN (formulaire abuse / DSA){" "}
              <strong className="text-ink">et</strong> l'hébergeur d'origine.
            </p>
          </div>
        </Reveal>

        {/* trois angles */}
        <Reveal delay={120}>
          <div>
            <p className="mono-label mb-5">
              <span className="text-royal font-semibold">▸</span> Trois angles, trois réalités
            </p>
            <AngleMeters />
          </div>
        </Reveal>
      </div>

      {/* modèle de notification DSA */}
      <Reveal className="mt-10">
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-line flex flex-wrap items-center justify-between gap-3 bg-card">
            <div>
              <p className="font-display font-bold text-ink text-[15px]">
                Notification DSA — modèle corrigé
              </p>
              <p className="font-mono text-[10.5px] text-fog mt-0.5">
                Sans délai inventé · sans survente RGPD · demande de décision motivée incluse
              </p>
            </div>
            <CopyBtn text={DSA_TEMPLATE} />
          </div>
          <div className="bg-paper bg-baselines p-6 sm:p-8 max-h-[380px] overflow-y-auto">
            <pre className="font-mono text-[12px] leading-[1.75] text-ink whitespace-pre-wrap break-words">
{DSA_TEMPLATE}
            </pre>
          </div>
        </div>
      </Reveal>

      {/* après le 404 */}
      <Reveal className="mt-6">
        <div className="border border-line bg-ink text-paper p-6 sm:p-8 grid sm:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="font-display font-extrabold text-2xl sm:text-3xl leading-none">
            404<span className="text-stamp">/</span>410
          </div>
          <div>
            <p className="text-[14px] leading-relaxed text-paper/90">
              Dès qu'une URL ne répond plus, Google la désindexe naturellement en{" "}
              <strong className="text-paper">1 à 4 semaines</strong>. L'outil public{" "}
              <a
                href="https://search.google.com/search-console/remove-outdated-content"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-royal decoration-2 hover:decoration-paper transition-colors"
              >
                « Supprimer les contenus obsolètes »
              </a>{" "}
              accélère la purge — n'importe qui peut y soumettre une URL morte.
            </p>
            <p className="mt-2.5 font-mono text-[10.5px] tracking-[0.1em] uppercase text-paper/50">
              Note : l'exclusion Wayback Machine est réservée aux propriétaires du site (robots.txt).
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
