/* ============================================================
   VOIES DE DROIT — contenus de presse en ligne contestés
   Fiche d'information — ne constitue pas un conseil juridique
   ============================================================ */

export type RouteStatus = "clos" | "etroit" | "ouvert" | "cas-par-cas";

export interface LegalRoute {
  id: string;
  name: string;
  basis: string;
  status: RouteStatus;
  statusLabel: string;
  stampRot: string;
  summary: string;
  detail: {
    what: string;
    procedure: string;
    delay: string;
    reality: string;
  };
  refs: string[];
}

export const ROUTES: LegalRoute[] = [
  {
    id: "rectification",
    name: "Rectification amiable auprès de la rédaction",
    basis: "Déontologie journalistique — « droit de suite »",
    status: "ouvert",
    statusLabel: "Ouvert — sans délai",
    stampRot: "-3deg",
    summary:
      "Demander à la rédaction une mise à jour de l'article à la lumière d'éléments nouveaux (pièces judiciaires, démentis, éléments d'identité).",
    detail: {
      what:
        "Un article ancien peut être complété : encart « mis à jour », droit de suite, correction. Beaucoup de rédactions (et leurs médiateurs) acceptent d'actualiser un papier quand des éléments objectifs nouveaux sont versés, sans que cela efface l'article.",
      procedure:
        "Courrier ou e-mail au directeur de la publication et au médiateur, avec les pièces numérotées et datées (démentis, affidavit, documents d'identité). Demande précise : encart de mise à jour, pas retrait.",
      delay: "Aucun délai légal — à engager à tout moment. Réponse usuelle : quelques semaines.",
      reality:
        "C'est la voie la plus sous-estimée et souvent la plus efficace : un encart « ces allégations ont été contestées, voici les pièces » change radicalement la lecture de l'article, sans procédure.",
    },
    refs: ["Charte de Munich (1971)", "Médiateur de la rédaction concernée"],
  },
  {
    id: "reponse",
    name: "Droit de réponse",
    basis: "Art. 13, loi du 29 juillet 1881 — art. 6-IV LCEN, décret 2007-1527",
    status: "clos",
    statusLabel: "Clos pour une publication de 2017",
    stampRot: "-5deg",
    summary:
      "Toute personne nommée dans un service de presse en ligne peut exiger l'insertion gratuite d'une réponse, à condition d'agir dans les 3 mois de la publication.",
    detail: {
      what:
        "Le droit de réponse en ligne oblige le directeur de la publication à insérer gratuitement la réponse dans les 3 jours, sous peine d'amende, dès lors que la personne y est désignée.",
      procedure:
        "Demande motivée adressée au directeur de la publication. La réponse est limitée à la longueur de l'article qui la provoque et doit rester mesurée.",
      delay: "3 mois à compter de la mise en ligne — délai de forclusion (décret du 24 octobre 2007).",
      reality:
        "Pour un article publié en 2017, ce délai est écoulé depuis longtemps. La voie n'est utile que contre une republication récente.",
    },
    refs: ["Décret n° 2007-1527 du 24 oct. 2007", "Art. 6-IV, LCEN n° 2004-575"],
  },
  {
    id: "diffamation",
    name: "Action en diffamation",
    basis: "Art. 29 et 32, loi du 29 juillet 1881 — prescription : art. 65",
    status: "clos",
    statusLabel: "Prescrite en principe (3 mois)",
    stampRot: "-4deg",
    summary:
      "La diffamation publique envers un particulier se prescrit par 3 mois. La jurisprudence fixe le point de départ à la première mise en ligne.",
    detail: {
      what:
        "La diffamation est l'allégation d'un fait portant atteinte à l'honneur. La preuve de la vérité des faits (exceptio veritatis) pèse sur le journaliste, mais le délai pour agir est très court.",
      procedure:
        "Citation directe devant le tribunal correctionnel, par avocat. La procédure de presse est formaliste : un acte irrégulier est nul.",
      delay:
        "3 mois révolus à compter de la première mise en ligne (jurisprudence constante). Un acte de republication peut, dans certains cas, faire courir un nouveau délai — point à faire trancher par un avocat au vu des faits.",
      reality:
        "Pour un article de 2017 jamais réédité, l'action est en pratique prescrite. C'est précisément ce que la loi a voulu : pacifier le débat après un délai bref. Seule une republication vérifiable rouvrirait la fenêtre.",
    },
    refs: ["Art. 65, loi 29 juill. 1881", "Cass. crim., point de départ : première mise en ligne"],
  },
  {
    id: "lcen",
    name: "Notification à l'hébergeur (LCEN)",
    basis: "Art. 6-I-5, loi n° 2004-575 du 21 juin 2004",
    status: "etroit",
    statusLabel: "Étroit — contenu « manifestement illicite »",
    stampRot: "-6deg",
    summary:
      "La notification LCEN n'est efficace que pour les contenus manifestement illicites (incitation à la haine, apologie, pédopornographie, terrorisme). La diffamation n'y figure pas.",
    detail: {
      what:
        "L'hébergeur doit retirer promptement un contenu dont l'illicéité est manifeste. Le législateur a volontairement exclu la diffamation de cette liste : elle exige une appréciation du juge.",
      procedure:
        "Notification formaliste (identité, URL, motifs légaux, copies des correspondances) adressée à l'hébergeur.",
      delay: "Pas de délai, mais un retrait sans décision de justice est rare sur un article de presse.",
      reality:
        "Sur une enquête journalistique, l'hébergeur refusera à juste titre : le caractère « manifestement illicite » n'est pas établi. Cette voie est presque toujours un détour.",
    },
    refs: ["Art. 6-I-5, LCEN", "Cass. 1re civ., notion de manifestement illicite"],
  },
  {
    id: "rgpd",
    name: "Déréférencement (droit à l'oubli)",
    basis: "Art. 17 RGPD — CJUE « Google Spain », C-131/12, 13 mai 2014",
    status: "cas-par-cas",
    statusLabel: "Ouvert — examen au cas par cas",
    stampRot: "-2deg",
    summary:
      "Demander à Google de retirer des résultats de recherche les liens associés au nom de la personne. C'est le principal levier réel pour un article ancien — sans prescription.",
    detail: {
      what:
        "Le déréférencement ne supprime pas l'article : il retire le lien des résultats obtenus en cherchant le nom de la personne. Le moteur met en balance le droit à la vie privée et l'intérêt du public à l'information.",
      procedure:
        "1) Formulaire officiel Google ou demande motivée (voir le générateur ci-dessous). 2) Réponse sous 1 mois (art. 12.3 RGPD). 3) En cas de refus : plainte à la CNIL, qui instruit et peut mettre en demeure. 4) Recours contentieux possible.",
      delay:
        "Aucun délai de prescription : la demande est appréciée à la date où elle est faite — l'ancienneté des faits joue précisément en faveur du demandeur.",
      reality:
        "Critères appliqués (Google Spain) : rôle public de la personne, exactitude des données, sensibilité, ancienneté, préjudice. Pour un dirigeant visé par une enquête d'intérêt public, l'issue est incertaine — mais c'est la seule voie qui reste ouverte, et elle a déjà abouti dans des dossiers comparables, parfois partiellement.",
    },
    refs: [
      "CJUE, 13 mai 2014, Google Spain, C-131/12",
      "Art. 17 & 12.3, RGPD (UE) 2016/679",
      "Plainte CNIL : cnil.fr",
    ],
  },
];

/* ---------- frise de prescription ---------- */

export const TIMELINE_ROWS = [
  {
    label: "Droit de réponse & diffamation",
    law: "Loi du 29 juillet 1881",
    tone: "red" as const,
    window: "Fenêtre de 3 mois — close depuis décembre 2017",
    open: false,
  },
  {
    label: "Notification LCEN",
    law: "Art. 6-I-5, loi 2004-575",
    tone: "amber" as const,
    window: "Pas de délai — mais champ quasi inapplicable à la presse",
    open: false,
  },
  {
    label: "Rectification amiable",
    law: "Droit de suite, médiateur",
    tone: "blue" as const,
    window: "Ouvert en permanence — sans formalisme",
    open: true,
  },
  {
    label: "Déréférencement RGPD",
    law: "Art. 17, RGPD — Google Spain",
    tone: "green" as const,
    window: "Ouvert — aucune prescription, l'ancienneté favorise la demande",
    open: true,
  },
];

export const TIMELINE_X = ["2017", "2019", "2021", "2023", "2025", "2026"];

/* ---------- checklist page de mise au point ---------- */

export const CHECKLIST = [
  {
    text: "Le signataire est clairement identifié — nom, qualité, date. La page est une réponse de première partie, assumée comme telle.",
  },
  {
    text: "Chaque pièce est qualifiée exactement : un affidavit est une déclaration unilatérale sous serment, pas une décision de justice.",
  },
  {
    text: "Les allégations contestées ne sont pas reproduites en détail — la réponse ne ré-indexe pas ce qu'elle conteste.",
  },
  {
    text: "Ton factuel : chronologie datée, pièces numérotées, aucun adjectif accusateur, aucune mise en cause personnelle.",
  },
  {
    text: "Un contact presse / juridique est publié pour toute demande de vérification par un journaliste.",
  },
  {
    text: "Un historique des mises à jour est visible — la transparence se démontre dans la durée.",
  },
];

/* ---------- ce qui ne fonctionne pas ---------- */

export const DEAD_ENDS = [
  {
    title: "Le faux fact-check",
    body:
      "Attribuer un marquage ClaimReview « Faux » à un tribunal — par la partie intéressée elle-même — viole les règles de données structurées de Google et décrédibilise durablement son auteur quand la supercherie est découverte. Elle le sera.",
  },
  {
    title: "L'astroturfing",
    body:
      "Les « analyses indépendantes » pilotées en coulisse sont du contenu coordonné trompeur — une politique de spam explicite. Quand la coordination apparaît, l'effet Streisand est garanti et l'article repart à la hausse.",
  },
  {
    title: "L'ingénierie d'engagement",
    body:
      "Fabriquer la chute de CTR d'un média précis : Google mesure et filtre les signaux manipulés, et cibler une rédaction expose à des risques juridiques et réputationnels nouveaux, sans compter le mépris du public informé.",
  },
];

/* ---------- modèle de demande de déréférencement ---------- */

export const LETTER_GROUNDS = [
  "les données sont inexactes, incomplètes ou présentées hors de leur contexte",
  "les faits sont anciens et leur intérêt public actuel est affaibli",
  "le référencement cause un préjudice disproportionné à ma vie privée et professionnelle",
  "les informations relèvent de données sensibles au sens de l'article 9 du RGPD",
];

export function buildLetter(fields: {
  name: string;
  email: string;
  city: string;
  urls: string[];
  context: string;
  grounds: string[];
}) {
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const urlsList =
    fields.urls.length > 0
      ? fields.urls.map((u, i) => `— ${u}`).join("\n")
      : "— [URL 1]\n— [URL 2]";
  const grounds =
    fields.grounds.length > 0
      ? fields.grounds.map((g) => `  • ${g};`).join("\n")
      : "  • [exposer ici les critères pertinents];";
  const context = fields.context.trim() || "[Exposé bref et factuel : nature de l'article, date, ce qui est contesté, pièces disponibles (démentis, affidavit, etc.).]";

  return `${fields.name || "[Nom complet]"}
${fields.email ? fields.email : "[Adresse e-mail de contact]"}

Google France — Délégué à la protection des données
8 rue de Londres, 75009 Paris
(ou via le formulaire officiel : support.google.com/websearch/troubleshooter/3111061)

Fait à ${fields.city || "……"}, le ${today}

Objet : Demande de déréférencement de liens — articles 12 et 17 du RGPD

Madame, Monsieur,

Sur le fondement de l'article 17 du règlement (UE) 2016/679 (RGPD) et de la jurisprudence de la Cour de justice de l'Union européenne (Google Spain, C-131/12, 13 mai 2014), je sollicite le déréférencement, dans les résultats de recherche associés à mon nom, des pages suivantes :

${urlsList}

Exposé de ma demande :

${context}

Au regard des critères dégagés par la jurisprudence (rôle public de la personne, exactitude des données, sensibilité, ancienneté, préjudice), je considère que :

${grounds}

Je précise que la présente demande porte sur le déréférencement des liens listés ci-dessus dans les résultats associés à mon nom, et non sur la suppression des contenus à la source, laquelle relève de l'éditeur.

Conformément à l'article 12.3 du RGPD, je vous remercie de bien vouloir me notifier votre décision dans un délai d'un mois à compter de la réception de la présente. À défaut de réponse ou en cas de refus, je saisirai la Commission nationale de l'informatique et des libertés (cnil.fr), autorité de contrôle compétente.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${fields.name || "[Nom complet]"}

Pièce jointe recommandée : copie d'une pièce d'identité (Google la demande fréquemment pour vérifier la qualité du demandeur).`;
}
