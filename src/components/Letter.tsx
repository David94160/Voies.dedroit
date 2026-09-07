import { useMemo, useState, type ReactNode } from "react";
import { buildLetter, LETTER_GROUNDS } from "../data";
import { DeadlineTracker } from "./Deadline";
import { CopyBtn, Reveal, SectionHead, Stamp } from "./ui";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mono-label block mb-2 text-ink font-semibold">{label}</span>
      {children}
      {hint && <span className="block mt-1.5 text-[11.5px] text-fog italic">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full bg-paper border border-line px-3.5 py-2.5 text-[14px] text-ink placeholder:text-fog/60 focus:outline-none focus:border-royal focus:ring-2 focus:ring-royal/15 transition-all";

export function Letter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [urls, setUrls] = useState("");
  const [context, setContext] = useState("");
  const [grounds, setGrounds] = useState<string[]>([LETTER_GROUNDS[1]]);

  const toggleGround = (g: string) =>
    setGrounds((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const letter = useMemo(
    () =>
      buildLetter({
        name,
        email,
        city,
        urls: urls.split("\n").map((u) => u.trim()).filter(Boolean),
        context,
        grounds,
      }),
    [name, email, city, urls, context, grounds]
  );

  return (
    <section id="lettre" className="bg-paperdeep/60 border-y border-line mt-20 sm:mt-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24">
        <SectionHead
          no="03"
          kicker="Le levier ouvert — art. 17 RGPD"
          title={
            <>
              Générez votre demande
              <br />
              de <em className="text-royal font-semibold">déréférencement</em>
            </>
          }
          sub="Un courrier motivé, fondé sur Google Spain et l'article 17 du RGPD, à adresser à Google — ou à coller dans le formulaire officiel. La lettre se rédige en direct à droite."
        />

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* formulaire */}
          <Reveal>
            <div className="card p-6 sm:p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Nom complet">
                  <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Prénom Nom" />
                </Field>
                <Field label="Ville">
                  <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Paris" />
                </Field>
              </div>
              <Field label="E-mail de contact">
                <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" />
              </Field>
              <Field label="URL à déréférencer — une par ligne" hint="Cherchez votre nom sur Google et listez chaque lien menant vers l'article.">
                <textarea
                  className={`${inputCls} min-h-[96px] resize-y font-mono text-[12.5px]`}
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  placeholder={"https://www.exemple-presse.fr/article-1\nhttps://archive.exemple.fr/article-2"}
                />
              </Field>
              <Field label="Exposé factuel (bref)" hint="Nature de l'article, date, ce que vous contestez, pièces disponibles. Restez factuel — c'est ce qui pèse.">
                <textarea
                  className={`${inputCls} min-h-[110px] resize-y`}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Article publié le… alléguant… Ces allégations ont été formellement contestées : démentis datés de…, affidavit de… versé le…, usurpation d'identité documentée par…"
                />
              </Field>
              <div>
                <span className="mono-label block mb-2.5 text-ink font-semibold">Critères jurisprudentiels invoqués</span>
                <div className="space-y-2">
                  {LETTER_GROUNDS.map((g) => {
                    const on = grounds.includes(g);
                    return (
                      <button
                        key={g}
                        onClick={() => toggleGround(g)}
                        className={`w-full text-left flex items-start gap-3 border px-3.5 py-3 cursor-pointer transition-all duration-200 ${
                          on
                            ? "border-royal bg-royal/[0.06]"
                            : "border-line bg-paper hover:border-fog"
                        }`}
                        aria-pressed={on}
                      >
                        <span
                          className={`mt-0.5 w-4 h-4 shrink-0 border flex items-center justify-center transition-colors ${
                            on ? "bg-royal border-royal" : "border-fog/50 bg-card"
                          }`}
                        >
                          {on && (
                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
                              <path d="M1.5 4.8 3.6 7 7.5 2" stroke="#f3f5f2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className={`text-[13px] leading-snug ${on ? "text-ink font-medium" : "text-fog"}`}>{g}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="https://support.google.com/websearch/troubleshooter/3111061"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] tracking-[0.14em] uppercase text-royal underline underline-offset-4 hover:text-royaldeep transition-colors"
                >
                  Formulaire officiel Google ↗
                </a>
                <a
                  href="https://www.cnil.fr/fr/plaintes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] tracking-[0.14em] uppercase text-fog underline underline-offset-4 hover:text-ink transition-colors"
                >
                  Plainte CNIL ↗
                </a>
              </div>
            </div>
          </Reveal>

          {/* aperçu papier */}
          <Reveal delay={140}>
            <div className="card p-0 overflow-hidden">
              <div className="px-6 py-3.5 border-b border-line flex items-center justify-between gap-4 bg-card">
                <p className="mono-label">
                  <span className="text-royal font-semibold">▸</span> Aperçu — courrier formel
                </p>
                <CopyBtn text={letter} />
              </div>
              <div className="relative bg-paper bg-baselines p-6 sm:p-8 max-h-[640px] overflow-y-auto">
                <div className="absolute top-6 right-6 pointer-events-none select-none">
                  <Stamp tone="blue" rot="7deg" className="text-[9px] opacity-50">
                    Modèle — à adapter
                  </Stamp>
                </div>
                <pre className="font-mono text-[12px] leading-[1.75] text-ink whitespace-pre-wrap break-words">
{letter}
                </pre>
              </div>
              <div className="px-6 py-3.5 border-t border-line bg-card">
                <p className="text-[11.5px] text-fog leading-relaxed">
                  <strong className="text-ink">Important :</strong> le déréférencement retire le
                  lien des résultats associés à votre nom — l'article, lui, reste publié à la
                  source. C'est la jurisprudence Google Spain : on déréférence, on n'efface pas
                  la presse.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <DeadlineTracker />
      </div>
    </section>
  );
}
