import { useState } from "react";
import { ANCHORS, DOMINO, HUB_HN, JSONLD, SPOKES } from "../data";
import { CopyBtn, Reveal, SectionHead, useInView } from "./ui";

const TONE_BG = { ok: "bg-ok", tox: "bg-tox", cyn: "bg-cyn", amb: "bg-amb" } as const;
const TONE_TEXT = { ok: "text-ok", tox: "text-tox", cyn: "text-cyn", amb: "text-amb" } as const;

/* ---------- diagramme hub & spokes ---------- */
function NetworkDiagram({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const hub = { x: 260, y: 200 };
  return (
    <svg viewBox="0 0 520 420" className="w-full h-auto" role="img" aria-label="Schéma du réseau hub et spokes">
      {/* arêtes animées */}
      {SPOKES.map((s) => (
        <g key={`edge-${s.id}`}>
          <line
            x1={hub.x} y1={hub.y} x2={s.x} y2={s.y}
            stroke={active === s.id ? "#3dd68c" : "#2a3d4d"}
            strokeWidth={active === s.id ? 1.6 : 1}
            className="edge-flow"
            style={{ transition: "stroke .3s" }}
          />
          {/* sens du jus : toujours vers le hub */}
          <polygon
            points="0,-4 8,0 0,4"
            fill={active === s.id ? "#3dd68c" : "#4fc8d4"}
            transform={`translate(${hub.x + (s.x - hub.x) * 0.32}, ${hub.y + (s.y - hub.y) * 0.32}) rotate(${(Math.atan2(hub.y - s.y, hub.x - s.x) * 180) / Math.PI})`}
            style={{ transition: "fill .3s" }}
          />
        </g>
      ))}

      {/* l'accusation : isolée */}
      <g opacity="0.85">
        <circle cx="260" cy="382" r="20" fill="none" stroke="#b32e35" strokeWidth="1.2" strokeDasharray="3 5" />
        <path d="M253 375 267 389 M267 375 253 389" stroke="#ff5c5c" strokeWidth="1.6" strokeLinecap="round" />
        <text x="260" y="414" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.5" fill="#7e93a0">
          L'ACCUSATION — 0 LIEN · 0 MENTION · 0 JUS
        </text>
      </g>

      {/* hub */}
      <g>
        <circle cx={hub.x} cy={hub.y} r="72" fill="none" stroke="#1d7a50" strokeWidth="1" strokeDasharray="4 8">
          <animateTransform attributeName="transform" type="rotate" from={`0 ${hub.x} ${hub.y}`} to={`360 ${hub.x} ${hub.y}`} dur="26s" repeatCount="indefinite" />
        </circle>
        <circle cx={hub.x} cy={hub.y} r="56" fill="#0f1720" stroke="#3dd68c" strokeWidth="1.6" />
        <circle cx={hub.x} cy={hub.y} r="56" fill="rgba(61,214,140,0.06)" />
        <text x={hub.x} y={hub.y - 8} textAnchor="middle" fontFamily="Syne, sans-serif" fontWeight="800" fontSize="17" fill="#d9e4ea" letterSpacing="1">
          HUB
        </text>
        <text x={hub.x} y={hub.y + 10} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" letterSpacing="1.8" fill="#3dd68c">
          SOURCE DE VÉRITÉ
        </text>
        <text x={hub.x} y={hub.y + 26} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="8" letterSpacing="1.2" fill="#5c7280">
          /transparence-2019
        </text>
      </g>

      {/* spokes */}
      {SPOKES.map((s) => {
        const isActive = active === s.id;
        return (
          <g key={s.id} onClick={() => onSelect(s.id)} className="cursor-pointer">
            <circle
              cx={s.x} cy={s.y} r="30"
              fill={isActive ? "rgba(61,214,140,0.12)" : "#131d28"}
              stroke={isActive ? "#3dd68c" : "#2a3d4d"}
              strokeWidth={isActive ? 1.8 : 1.2}
              style={{ transition: "all .3s" }}
            />
            <text
              x={s.x} y={s.y - 2} textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1"
              fill={isActive ? "#3dd68c" : "#d9e4ea"}
            >
              {s.platform.split(" ")[0].toUpperCase().replace("/", "")}
            </text>
            <text x={s.x} y={s.y + 12} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#5c7280">
              {s.dr}
            </text>
            <text
              x={s.x} y={s.y + (s.y < 200 ? -40 : 48)} textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.5"
              fill={isActive ? "#3dd68c" : "#7e93a0"}
            >
              SPOKE {s.week}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Fortress() {
  const [active, setActive] = useState(SPOKES[0].id);
  const spoke = SPOKES.find((s) => s.id === active) ?? SPOKES[0];
  const anchors = useInView<HTMLDivElement>(0.35);

  return (
    <section id="forteresse" className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-32">
      <SectionHead
        no="03"
        kicker="Phase 02 — la forteresse"
        title={
          <>
            Hub & spokes :
            <br />
            l'architecture <span className="text-ok">d'asphyxie</span>
          </>
        }
        sub="Un HUB institutionnel au ton « rapport de conformité » — jamais une page de défense désespérée — alimenté par des spokes à haute autorité. Tout le jus converge. Rien ne sort vers l'accusation."
      />

      <div className="grid lg:grid-cols-12 gap-5">
        {/* structure du HUB */}
        <Reveal className="lg:col-span-5">
          <div className="panel p-6 h-full flex flex-col">
            <p className="mono-label mb-6">
              <span className="text-ok">▸</span> Structure du hub — page « source de vérité »
            </p>
            <ol className="space-y-4 flex-1">
              {HUB_HN.map((item, i) => (
                <li key={i} className="flex gap-3.5 group">
                  <span
                    className={`shrink-0 h-fit font-mono text-[10px] tracking-[0.14em] px-2 py-1 border ${
                      item.h === "H1"
                        ? "border-ok/60 text-ok bg-ok/10"
                        : item.h === "URL"
                          ? "border-cyn/50 text-cyn"
                          : "border-line2 text-fog"
                    }`}
                  >
                    {item.h}
                  </span>
                  <div>
                    <p className={`text-[13.5px] leading-relaxed ${item.h === "H1" ? "font-semibold text-bone" : item.h === "URL" ? "font-mono text-[12px] text-cyn" : "text-bone/85"}`}>
                      {item.text}
                    </p>
                    {item.note && <p className="text-[11.5px] text-dim mt-1 italic">{item.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-7 border border-tox/40 bg-tox/[0.06] p-4">
              <p className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-tox mb-2">⚠ Règle d'or du maillage</p>
              <p className="text-[13px] text-fog leading-relaxed">
                Aucun spoke ne mentionne ni ne link l'article accusateur.
                <strong className="text-bone"> On ne lui donne ni jus, ni citation, ni archive.</strong> Toute
                l'autorité pointe vers le HUB — exclusivement.
              </p>
            </div>
          </div>
        </Reveal>

        {/* diagramme + détail spoke */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <Reveal delay={100}>
            <div className="panel p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="mono-label">
                  <span className="text-cyn">▸</span> Topologie du réseau — cliquer un spoke
                </p>
                <span className="hidden sm:flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-dim">
                  <span className="w-4 h-px bg-ok inline-block" /> flux d'autorité → hub
                </span>
              </div>
              <NetworkDiagram active={active} onSelect={setActive} />
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="panel p-6 border-l-2 border-l-ok">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase border border-ok/50 text-ok px-2 py-1">
                  Déploiement {spoke.week}
                </span>
                <p className="font-mono text-[11.5px] text-fog">{spoke.platform}</p>
                <span className="ml-auto font-mono text-[11px] text-cyn">{spoke.dr}</span>
              </div>
              <h3 className="font-display font-bold uppercase tracking-tight text-lg sm:text-xl leading-snug mb-3">
                « {spoke.title} »
              </h3>
              <p className="text-[13.5px] text-fog leading-relaxed mb-4">{spoke.angle}</p>
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-line">
                <span className="mono-label">Ancre vers le hub</span>
                <span className="font-mono text-[12.5px] text-ok">{spoke.anchor}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* payload JSON-LD — dossier papier */}
      <Reveal className="mt-16">
        <div className="paper-panel relative">
          <div className="absolute -top-3 left-8 bg-tox text-paper font-mono text-[10px] tracking-[0.22em] uppercase px-3 py-1">
            Pièce technique — payload
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 sm:px-8 pt-8 pb-4 border-b border-paperink/15">
            <div>
              <p className="font-display font-extrabold uppercase tracking-tight text-paperink text-lg sm:text-xl">
                JSON-LD du Knowledge Graph
              </p>
              <p className="font-mono text-[11px] text-paperink/60 mt-1">
                &lt;script type="application/ld+json"&gt; — à injecter dans le &lt;head&gt; du HUB
              </p>
            </div>
            <CopyBtn text={JSONLD} light />
          </div>
          <pre className="code-scroll overflow-x-auto px-6 sm:px-8 py-6 font-mono text-[12px] leading-[1.75] text-paperink/90 max-h-[430px]">
{JSONLD}
          </pre>
          <div className="px-6 sm:px-8 py-4 border-t border-paperink/15 flex flex-wrap gap-x-8 gap-y-2">
            <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-paperink/70">
              <span className="text-toxdeep font-semibold">Person</span> → ancre l'identité professionnelle
            </p>
            <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-paperink/70">
              <span className="text-toxdeep font-semibold">ClaimReview</span> → force le classement « faux / non prouvé »
            </p>
            <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-paperink/70">
              <span className="text-toxdeep font-semibold">FAQPage</span> → rich snippet, occupation visuelle massive
            </p>
          </div>
        </div>
      </Reveal>

      {/* répartition des ancres */}
      <div className="mt-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7" ref={anchors.ref}>
          <Reveal>
            <p className="mono-label mb-6">
              <span className="text-amb">▸</span> Répartition stricte des ancres pointant vers le hub
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="flex h-12 border border-line overflow-hidden">
              {ANCHORS.filter((a) => a.pct > 0).map((a, i) => (
                <div
                  key={a.label}
                  className={`${TONE_BG[a.tone]} flex items-center justify-center transition-all duration-1000 ease-out`}
                  style={{
                    width: anchors.inView ? `${a.pct}%` : "0%",
                    transitionDelay: `${i * 160}ms`,
                    opacity: 0.9,
                  }}
                  title={`${a.label} — ${a.pct} %`}
                >
                  <span className="font-mono text-[11px] font-semibold text-abyss">{a.pct}%</span>
                </div>
              ))}
              <div
                className="border-l-2 border-dashed border-tox bg-tox/10 flex items-center justify-center transition-all duration-1000"
                style={{ width: anchors.inView ? "44px" : "0px", transitionDelay: "560ms" }}
              >
                <span className="font-mono text-[10px] font-semibold text-tox">0%</span>
              </div>
            </div>
          </Reveal>
          <div className="mt-6 space-y-3">
            {ANCHORS.map((a, i) => (
              <Reveal key={a.label} delay={i * 70}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line/70 pb-3 group">
                  <span className={`w-2.5 h-2.5 ${TONE_BG[a.tone]} shrink-0 self-center`} />
                  <span className="font-semibold text-[13.5px] text-bone">{a.label}</span>
                  <span className={`font-display font-extrabold text-xl ${TONE_TEXT[a.tone]}`}>{a.pct}%</span>
                  <span className="basis-full sm:basis-auto font-mono text-[11.5px] text-dim sm:ml-auto group-hover:text-fog transition-colors">
                    {a.ex}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* effet domino */}
        <div className="lg:col-span-5">
          <Reveal>
            <p className="mono-label mb-6">
              <span className="text-tox">▸</span> L'effet domino — projection à 60 jours
            </p>
          </Reveal>
          <ol className="relative border-l border-line2 ml-2">
            {DOMINO.map((step, i) => {
              const last = i === DOMINO.length - 1;
              return (
                <Reveal key={i} delay={i * 110}>
                  <li className="relative pl-7 pb-7 last:pb-0">
                    <span
                      className={`absolute -left-[7px] top-1 w-[13px] h-[13px] rotate-45 border ${
                        last ? "bg-tox border-tox pulse-tox" : "bg-ink border-line2"
                      }`}
                    />
                    <p className={`text-[13.5px] leading-relaxed ${last ? "text-bone font-semibold" : "text-fog"}`}>
                      <span className={`font-mono text-[11px] mr-2 ${last ? "text-tox" : "text-cyn"}`}>
                        {last ? "★" : `${String(i + 1).padStart(2, "0")}`}
                      </span>
                      {step}
                    </p>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
