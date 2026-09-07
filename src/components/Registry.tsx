import { useEffect, useMemo, useState } from "react";
import { CopyBtn, Reveal, SectionHead } from "./ui";

/* ------------------------------------------------------------------ */
/* Registre des demandes — journal de bord du dossier                  */
/* Une ligne par courrier envoyé, chaque réponse consignée             */
/* ------------------------------------------------------------------ */

type DemandeType = "rgpd" | "image" | "dsa" | "rectif";
type Statut = "a-notifier" | "en-cours" | "refus" | "accepte";

interface Entry {
  id: string;
  cible: string;
  type: DemandeType;
  statut: Statut;
  date: string; // AAAA-MM-JJ
  notes: string;
}

const TYPE_LABELS: Record<DemandeType, string> = {
  rgpd: "Déréférencement RGPD (Google)",
  image: "Retrait de visuel (droit à l'image)",
  dsa: "Notification DSA (hébergeur)",
  rectif: "Rectification amiable (rédaction)",
};

const STATUTS: { id: Statut; label: string; dot: string; text: string }[] = [
  { id: "a-notifier", label: "À notifier", dot: "bg-fog", text: "text-fog" },
  { id: "en-cours", label: "En cours", dot: "bg-royal", text: "text-royal" },
  { id: "refus", label: "Refus motivé", dot: "bg-stamp", text: "text-stamp" },
  { id: "accepte", label: "Accepté", dot: "bg-green", text: "text-green" },
];

const STORAGE_KEY = "vd-registre-v1";

function load(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

const inputCls =
  "w-full bg-paper border border-line px-3 py-2 text-[13.5px] text-ink placeholder:text-fog/60 focus:outline-none focus:border-royal focus:ring-2 focus:ring-royal/15 transition-all";

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T12:00:00`);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function Registry() {
  const [entries, setEntries] = useState<Entry[]>(load);
  const [cible, setCible] = useState("");
  const [type, setType] = useState<DemandeType>("rgpd");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* stockage indisponible : le registre reste en mémoire */
    }
  }, [entries]);

  const add = () => {
    if (!cible.trim()) return;
    const e: Entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      cible: cible.trim(),
      type,
      statut: "en-cours",
      date,
      notes: notes.trim(),
    };
    setEntries((prev) => [e, ...prev]);
    setCible("");
    setNotes("");
  };

  const setStatut = (id: string, s: Statut) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, statut: s } : e)));

  const remove = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const counts = useMemo(() => {
    const c: Record<Statut, number> = { "a-notifier": 0, "en-cours": 0, refus: 0, accepte: 0 };
    entries.forEach((e) => (c[e.statut] += 1));
    return c;
  }, [entries]);

  const exportText = useMemo(() => {
    const today = new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    if (entries.length === 0) return "Registre des demandes — aucune entrée à ce jour.";
    const lines = entries.map((e, i) => {
      const st = STATUTS.find((s) => s.id === e.statut)?.label ?? e.statut;
      return `${i + 1}. ${e.cible}
   Demande : ${TYPE_LABELS[e.type]}
   Statut  : ${st}${e.date ? ` — envoyée le ${formatDate(e.date)}` : ""}${
     e.notes ? `\n   Notes   : ${e.notes}` : ""
   }`;
    });
    return `REGISTRE DES DEMANDES — arrêté au ${today}

${lines.join("\n\n")}

Registre tenu par la partie demanderesse. Chaque entrée renvoie aux
courriers, accusés de réception et décisions conservés en pièces.`;
  }, [entries]);

  return (
    <section id="registre" className="mx-auto max-w-6xl px-5 sm:px-8 pt-20 sm:pt-28">
      <SectionHead
        no="02"
        kicker="Journal de bord du dossier"
        title={
          <>
            Registre des
            <br />
            <em className="text-royal font-semibold">demandes</em>
          </>
        }
        sub="Une ligne par courrier envoyé : déréférencement, retrait de visuel, notification DSA, rectification. Les statuts restent sur cet appareil — le registre s'exporte en texte pour l'avocat ou la CNIL."
      />

      {/* compteurs */}
      <Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {STATUTS.map((s) => (
            <div key={s.id} className="card px-4 py-3.5 flex items-center gap-3">
              <span className={`w-2.5 h-2.5 ${s.dot} shrink-0`} />
              <div>
                <p className={`font-display font-black text-2xl tabular-nums leading-none ${s.text}`}>
                  {String(counts[s.id]).padStart(2, "0")}
                </p>
                <p className="mono-label mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* formulaire d'ajout */}
      <Reveal delay={90}>
        <div className="card p-5 sm:p-6">
          <p className="mono-label mb-4">
            <span className="text-green font-semibold">+</span> Consigner une demande
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1.2fr_auto] gap-3">
            <input
              className={inputCls}
              value={cible}
              onChange={(e) => setCible(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Cible — ex. Mediapart, article du 27/09/2017"
              aria-label="Cible de la demande"
            />
            <select
              className={`${inputCls} cursor-pointer`}
              value={type}
              onChange={(e) => setType(e.target.value as DemandeType)}
              aria-label="Type de demande"
            >
              {(Object.keys(TYPE_LABELS) as DemandeType[]).map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            <input
              className={`${inputCls} cursor-pointer`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Date d'envoi"
            />
          </div>
          <div className="grid sm:grid-cols-[1fr_auto] gap-3 mt-3">
            <input
              className={inputCls}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Notes — n° de référence Google, accusé de réception, pièce jointe…"
              aria-label="Notes"
            />
            <button
              onClick={add}
              disabled={!cible.trim()}
              className="cursor-pointer bg-royal text-paper font-mono text-[11px] tracking-[0.16em] uppercase px-6 py-2.5 hover:bg-royaldeep transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Inscrire au registre
            </button>
          </div>
        </div>
      </Reveal>

      {/* entrées */}
      <Reveal delay={160}>
        <div className="card mt-4 overflow-hidden">
          {entries.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-line m-4">
              <p className="font-display font-bold text-lg text-ink mb-2">Registre vierge</p>
              <p className="text-[13.5px] text-fog max-w-md mx-auto leading-relaxed">
                Consignez ici chaque démarche déjà engagée — y compris les
                déréférencements obtenus et les refus reçus. Un dossier qui se
                suit s'argumente.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-linesoft">
              {entries.map((e) => {
                const st = STATUTS.find((s) => s.id === e.statut) ?? STATUTS[0];
                return (
                  <li key={e.id} className="p-4 sm:p-5 hover:bg-paperdeep/40 transition-colors group">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="font-mono text-[12px] text-fog tabular-nums shrink-0">
                        {formatDate(e.date)}
                      </span>
                      <p className="font-semibold text-[14.5px] text-ink flex-1 min-w-[200px]">
                        {e.cible}
                      </p>
                      <button
                        onClick={() => remove(e.id)}
                        className="cursor-pointer font-mono text-[11px] text-fog hover:text-stamp transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Retirer cette entrée"
                      >
                        ✕ retirer
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="font-mono text-[10px] tracking-[0.12em] uppercase border border-line bg-paper px-2 py-1 text-fog">
                        {TYPE_LABELS[e.type]}
                      </span>
                      <div className="flex border border-line overflow-hidden">
                        {STATUTS.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setStatut(e.id, s.id)}
                            className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase transition-all duration-200 ${
                              e.statut === s.id
                                ? `${s.text} bg-paperdeep font-semibold`
                                : "text-fog/70 hover:text-ink"
                            }`}
                            aria-pressed={e.statut === s.id}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {e.notes && (
                      <p className="mt-2.5 text-[12.5px] text-fog italic leading-relaxed">
                        ↳ {e.notes}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* pied du registre */}
          <div className="px-5 sm:px-6 py-4 border-t border-line bg-card flex flex-wrap items-center gap-4">
            <p className="text-[12px] text-fog">
              {entries.length === 0
                ? "Aucune entrée enregistrée."
                : `${entries.length} entrée${entries.length > 1 ? "s" : ""} — ${counts.accepte} acceptée${counts.accepte > 1 ? "s" : ""}, ${counts.refus} refus motivé${counts.refus > 1 ? "s" : ""}.`}
            </p>
            <div className="ml-auto">
              <CopyBtn text={exportText} />
            </div>
            <span className="mono-label text-[10px]">Export pour l'avocat</span>
          </div>
        </div>
      </Reveal>

      {/* rappel probatoire */}
      <Reveal delay={220}>
        <div className="mt-5 border border-line border-l-2 border-l-royal bg-card px-5 py-4">
          <p className="text-[13px] text-fog leading-relaxed">
            <strong className="text-ink">Réflexe d'enquêteur :</strong> un déréférencement se
            vérifie depuis un navigateur neutre (navigation privée, aucun compte connecté), et se
            fige par captures datées. Le déréférencement vaut pour votre nom, dans certaines
            zones — l'article reste accessible à la source et via d'autres requêtes. Chaque
            refus motivé (art. 17 DSA) se conserve : c'est la pièce du référé et du signalement
            Arcom.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
