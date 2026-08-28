import { useMemo, useState } from "react";
import { buildSitemap, PY_CODE } from "../data";
import { CopyBtn, Reveal, SectionHead, Stamp, useInView } from "./ui";

const inputCls =
  "w-full bg-paper border border-line px-3.5 py-2.5 text-[14px] text-ink placeholder:text-fog/60 focus:outline-none focus:border-royal focus:ring-2 focus:ring-royal/15 transition-all";

/* ---------- coloration minimale du code Python ---------- */
function PyCode({ code }: { code: string }) {
  const html = useMemo(() => {
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return code
      .split("\n")
      .map((line) => {
        const e = esc(line);
        if (/^\s*(#|""")/.test(line) || /^\s{4}[A-ZÀ-Ü]/.test(line)) {
          return `<span class="text-[#7f9a8c]">${e}</span>`;
        }
        return e
          .replace(
            /\b(def|import|from|return|if|print|not|and|or)\b/g,
            '<span class="text-[#8fb3ff]">$1</span>'
          )
          .replace(
            /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
            '<span class="text-[#a9d3a0]">$1</span>'
          );
      })
      .join("\n");
  }, [code]);

  return (
    <pre
      className="font-mono text-[12px] leading-[1.7] text-[#d7e2e8] whitespace-pre overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ---------- téléchargement du script ---------- */
function DownloadBtn() {
  const onDownload = () => {
    const blob = new Blob([PY_CODE], { type: "text/x-python;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "indexing.py";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={onDownload}
      className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase px-3 py-2 border border-line2 text-fog hover:text-bone hover:border-fog transition-all duration-300 cursor-pointer"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M6 1v7M6 8 3.2 5.2M6 8l2.8-2.8M1.5 10.5h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      indexing.py
    </button>
  );
}

/* ---------- checklist avant soumission ---------- */
const PRECHECKS = [
  { label: "La page est un contenu original, signé et daté", on: true },
  { label: "La propriété est vérifiée dans ma Search Console", on: true },
  { label: "Le sitemap est déclaré dans robots.txt", on: true },
  { label: "Aucun cloaking, aucune redirection trompeuse", on: true },
];

function PreCheck() {
  const [checks, setChecks] = useState<boolean[]>(PRECHECKS.map((p) => p.on));
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const done = checks.filter(Boolean).length;
  const pct = Math.round((done / checks.length) * 100);
  const circ = 2 * Math.PI * 26;

  return (
    <div ref={ref} className="card p-6 h-full flex flex-col">
      <div className="flex items-center gap-5 mb-5">
        <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
          <circle cx="32" cy="32" r="26" fill="none" stroke="#d3dbd3" strokeWidth="6" />
          <circle
            cx="32" cy="32" r="26" fill="none" stroke={done === checks.length ? "#1e7d46" : "#1b3c9c"}
            strokeWidth="6" strokeLinecap="round" strokeDasharray={circ}
            strokeDashoffset={circ - (circ * (inView ? pct : 0)) / 100}
            transform="rotate(-90 32 32)"
            style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.25,0.8,0.25,1), stroke .4s" }}
          />
          <text x="32" y="37" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="14" fontWeight="600" fill="#182530">
            {done}/{checks.length}
          </text>
        </svg>
        <div>
          <p className="mono-label mb-1.5">Avant de soumettre</p>
          <p className="text-[13px] text-fog leading-snug">
            Quatre conditions pour que le geste reste irréprochable.
          </p>
        </div>
        <div className="ml-auto">
          {done === checks.length && <Stamp tone="green" rot="-5deg">Prêt</Stamp>}
        </div>
      </div>
      <ul className="space-y-2.5">
        {checks.map((c, i) => (
          <li key={i}>
            <button
              onClick={() => setChecks((prev) => prev.map((v, j) => (j === i ? !v : v)))}
              className={`w-full text-left flex items-start gap-3 border px-3.5 py-2.5 cursor-pointer transition-all duration-200 ${
                c ? "border-green/40 bg-green/[0.05]" : "border-line bg-paper hover:border-fog"
              }`}
              aria-pressed={c}
            >
              <span className={`mt-0.5 w-4 h-4 shrink-0 border flex items-center justify-center transition-colors ${c ? "bg-green border-green" : "border-fog/50 bg-card"}`}>
                {c && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
                    <path d="M1.5 4.8 3.6 7 7.5 2" stroke="#f3f5f2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className={`text-[13px] leading-snug ${c ? "text-ink font-medium" : "text-fog"}`}>
                {PRECHECKS[i].label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- générateur de sitemap ---------- */
function SitemapGen() {
  const [domain, setDomain] = useState("https://www.votre-domaine.fr");
  const [paths, setPaths] = useState("/mise-au-point-officielle\n/mentions-legales");

  const list = useMemo(
    () => paths.split("\n").map((p) => p.trim()).filter(Boolean),
    [paths]
  );
  const xml = useMemo(() => buildSitemap(domain, list), [domain, list]);
  const domainOk = /^https:\/\/[^/\s]+\.[a-z]{2,}/i.test(domain.trim());

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-3.5 border-b border-line flex items-center justify-between gap-4 bg-card">
        <p className="mono-label">
          <span className="text-royal font-semibold">▸</span> Générateur sitemap.xml — en direct
        </p>
        <CopyBtn text={xml} />
      </div>
      <div className="grid md:grid-cols-2">
        <div className="p-6 space-y-5 border-b md:border-b-0 md:border-r border-line">
          <label className="block">
            <span className="mono-label block mb-2 text-ink font-semibold">Domaine (https)</span>
            <input className={inputCls} value={domain} onChange={(e) => setDomain(e.target.value)} />
            <span className={`block mt-1.5 text-[11.5px] italic ${domainOk ? "text-green" : "text-stamp"}`}>
              {domainOk ? "Format valide ✓" : "Doit commencer par https:// et contenir un domaine"}
            </span>
          </label>
          <label className="block">
            <span className="mono-label block mb-2 text-ink font-semibold">Pages — une par ligne</span>
            <textarea
              className={`${inputCls} min-h-[130px] resize-y font-mono text-[12.5px]`}
              value={paths}
              onChange={(e) => setPaths(e.target.value)}
              placeholder={"/mise-au-point-officielle\n/a-propos"}
            />
          </label>
          <p className="text-[12px] text-fog leading-relaxed">
            Déposez ce fichier à <span className="font-mono text-[11px] text-royal">/sitemap.xml</span>,
            référencez-le dans <span className="font-mono text-[11px] text-royal">robots.txt</span>
            <span className="font-mono text-[11px] text-fog"> (Sitemap: …)</span>, puis déclarez-le
            avec le script ci-contre.
          </p>
        </div>
        <pre className="p-6 font-mono text-[11.5px] leading-[1.65] text-ink/85 bg-paper bg-baselines overflow-x-auto max-h-[320px]">
{xml}
        </pre>
      </div>
    </div>
  );
}

export function Indexing() {
  return (
    <section id="indexation" className="mx-auto max-w-6xl px-5 sm:px-8 pt-20 sm:pt-28">
      <SectionHead
        no="05"
        kicker="Le geste propre — propriété vérifiée"
        title={
          <>
            Demander l'indexation,
            <br />
            <em className="text-royal font-semibold">sans rien forcer</em>
          </>
        }
        sub="Une seule fonction, pour vos pages originales sur vos propriétés vérifiées. Google reste seul juge du crawl et du classement — et c'est précisément ce qui rend le geste défendable."
      />

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* panneau code sombre */}
        <Reveal className="lg:col-span-3">
          <div className="bg-inkdeep border border-inkdeep shadow-[0_22px_48px_-28px_rgba(13,23,32,0.55)] overflow-hidden">
            <div className="px-5 py-3 border-b border-white/10 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-stamp/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green/80" />
              <span className="ml-2 font-mono text-[11px] tracking-[0.14em] text-white/50">
                scripts/indexing.py — Python 3.11+
              </span>
              <div className="ml-auto flex gap-2">
                <DownloadBtn />
                <CopyBtn text={PY_CODE} />
              </div>
            </div>
            <div className="p-5 max-h-[460px] overflow-y-auto">
              <PyCode code={PY_CODE} />
            </div>
            <div className="px-5 py-3 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-1.5 font-mono text-[10.5px] tracking-[0.1em] text-white/55">
              <span>$ pip install google-api-python-client google-auth</span>
              <span>$ python indexing.py &lt;site&gt; &lt;sitemap&gt; &lt;cle.json&gt;</span>
            </div>
          </div>
        </Reveal>

        {/* avertissement Indexing API */}
        <Reveal delay={120} className="lg:col-span-2">
          <div className="space-y-5">
            <div className="card border-l-[3px] border-l-stamp p-6">
              <p className="mono-label text-stamp mb-3">Pourquoi pas l'Indexing API ?</p>
              <p className="text-[13.5px] text-ink/85 leading-relaxed">
                <span className="font-mono text-[12px]">urlNotifications.publish</span> est{" "}
                <strong className="text-stamp">réservée aux offres d'emploi et contenus live</strong>.
                L'utiliser pour du contenu général est contraire à ses conditions : la
                notification est ignorée et la propriété peut être signalée. Ce n'est pas
                une astuce — c'est une impasse documentée.
              </p>
            </div>
            <div className="card p-6">
              <p className="mono-label mb-3">La voie sanctionnée, page par page</p>
              <ol className="space-y-2.5 text-[13.5px] text-ink/85 leading-relaxed">
                {[
                  <>Publier un <span className="font-mono text-[12px] text-royal">sitemap.xml</span> à la racine — le générateur ci-dessous le fait.</>,
                  <>Le déclarer via ce script, sur la propriété vérifiée.</>,
                  <>Contrôler chaque page avec l'<strong>outil d'inspection d'URL</strong> de la Search Console — c'est le seul bouton « demander l'indexation » officiel.</>,
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 border border-royal/50 text-royal font-mono text-[11px] flex items-center justify-center">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 pt-3 border-t border-line text-[12px] text-fog italic leading-relaxed">
                Le « ping » <span className="font-mono text-[11px]">google.com/ping</span> est
                déprécié depuis juin 2023 — tout script qui l'utilise encore est obsolète.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* sitemap + checklist */}
      <div className="mt-6 grid lg:grid-cols-5 gap-6 items-stretch">
        <Reveal className="lg:col-span-3">
          <SitemapGen />
        </Reveal>
        <Reveal delay={120} className="lg:col-span-2">
          <PreCheck />
        </Reveal>
      </div>
    </section>
  );
}
