import { useEffect, useMemo, useState } from "react";
import { addMonths, differenceInCalendarDays, format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Reveal, Stamp, useInView } from "./ui";

const STORAGE_KEY = "rgpd-envoi-date";

type Phase = "attente" | "relance" | "expire";

function computePhase(sentISO: string): {
  phase: Phase;
  remaining: number;
  total: number;
  due: Date;
  sent: Date;
} {
  const sent = parseISO(sentISO);
  const due = addMonths(sent, 1); // art. 12.3 RGPD : un mois
  const today = new Date();
  const total = Math.max(1, differenceInCalendarDays(due, sent));
  const remaining = differenceInCalendarDays(due, today);
  const phase: Phase = remaining < 0 ? "expire" : remaining <= 10 ? "relance" : "attente";
  return { phase, remaining, total, due, sent };
}

export function DeadlineTracker() {
  const [sentISO, setSentISO] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const { ref, inView } = useInView<HTMLDivElement>(0.35);

  useEffect(() => {
    try {
      if (sentISO) localStorage.setItem(STORAGE_KEY, sentISO);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* stockage indisponible : le suivi reste en mémoire */
    }
  }, [sentISO]);

  const state = useMemo(
    () => (sentISO && isValid(parseISO(sentISO)) ? computePhase(sentISO) : null),
    [sentISO]
  );

  const progress = state
    ? Math.min(100, Math.max(2, ((state.total - Math.max(0, state.remaining)) / state.total) * 100))
    : 0;

  const tone = state
    ? state.phase === "expire"
      ? "text-stamp"
      : state.phase === "relance"
        ? "text-amber"
        : "text-green"
    : "text-royal";
  const barColor = state
    ? state.phase === "expire"
      ? "bg-stamp"
      : state.phase === "relance"
        ? "bg-amber"
        : "bg-green"
    : "bg-royal";

  return (
    <Reveal className="mt-6">
      <div ref={ref} className="card p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="mono-label mb-2">
              <span className="text-royal font-semibold">▸</span> Suivi du délai de réponse — art. 12.3 RGPD
            </p>
            <p className="text-[13.5px] text-fog max-w-xl leading-relaxed">
              Le responsable de traitement dispose d'<strong className="text-ink">un mois</strong> pour répondre,
              prorogeable de deux mois si la demande est complexe (à condition de vous en informer sous un mois).
              Silence ou refus → plainte possible devant la <strong className="text-ink">CNIL</strong> (art. 77 RGPD).
            </p>
          </div>
          {state && state.phase === "expire" && (
            <div className="shrink-0">
              <Stamp tone="red" rot="-5deg" className="text-[10px]">
                Délai expiré
              </Stamp>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="flex items-end gap-3">
            <label className="block">
              <span className="mono-label block mb-2 text-ink font-semibold">Date d'envoi de la demande</span>
              <input
                type="date"
                value={sentISO}
                onChange={(e) => setSentISO(e.target.value)}
                className="bg-paper border border-line px-3.5 py-2.5 text-[14px] text-ink focus:outline-none focus:border-royal focus:ring-2 focus:ring-royal/15 transition-all cursor-pointer"
              />
            </label>
            {sentISO && (
              <button
                onClick={() => setSentISO("")}
                className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-fog underline underline-offset-4 hover:text-stamp transition-colors cursor-pointer pb-3"
              >
                Effacer
              </button>
            )}
          </div>

          <div className="min-w-[220px]">
            {!state ? (
              <div className="border border-dashed border-line px-5 py-4 text-[13px] text-fog italic">
                Renseignez la date d'envoi : l'échéance, le compte à rebours et le statut se calculent ici.
                La date reste sur cet appareil uniquement.
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2.5">
                  <p className={`font-display font-bold text-xl sm:text-2xl ${tone}`}>
                    {state.phase === "expire"
                      ? `Dépassé de ${Math.abs(state.remaining)} jour${Math.abs(state.remaining) > 1 ? "s" : ""}`
                      : `J−${state.remaining}`}
                  </p>
                  <p className="text-[12.5px] text-fog">
                    Réponse due le{" "}
                    <strong className="text-ink">
                      {format(state.due, "d MMMM yyyy", { locale: fr })}
                    </strong>{" "}
                    — envoyée le {format(state.sent, "d MMM yyyy", { locale: fr })}
                  </p>
                </div>
                <div className="h-[10px] bg-paperdeep border border-line overflow-hidden">
                  <div
                    className={`h-full ${barColor} transition-all duration-1000 ease-out`}
                    style={{ width: inView ? `${progress}%` : "0%" }}
                  />
                </div>
                <p className={`mt-2.5 text-[12.5px] font-medium ${tone}`}>
                  {state.phase === "attente" &&
                    "Dans les délais — aucune action requise pour l'instant."}
                  {state.phase === "relance" &&
                    "Une relance de courtoisie (e-mail daté, pièces rappelées) est recommandée avant l'échéance."}
                  {state.phase === "expire" &&
                    "Saisine de la CNIL ouverte : déposez une plainte en ligne avec copie de la demande et de la relance."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
