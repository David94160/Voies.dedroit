"""
indexing.py — Demander à Google l'indexation de VOS pages, proprement.

UNE seule tâche : déclarer un sitemap à la Search Console pour une
propriété vérifiée dont vous êtes titulaire. Google reste seul juge du
crawl, de l'indexation et du classement — aucune API ne « force » un
résultat, et c'est très bien ainsi.

Pourquoi pas l'Indexing API (urlNotifications.publish) ?
    Elle est RÉSERVÉE aux offres d'emploi et aux contenus diffusés en
    direct. L'utiliser pour du contenu général est contraire à ses
    conditions d'usage : la notification est ignorée et la propriété
    peut être signalée. Pour une page générale (article, mise au point,
    page officielle), la voie sanctionnée par Google est :
        1. publier un sitemap.xml à la racine,
        2. le déclarer via la Search Console (cette fonction),
        3. vérifier page par page avec l'outil d'inspection d'URL.
    (Le « ping » http://google.com/ping est déprécié depuis juin 2023.)

Dépendances :
    pip install google-api-python-client google-auth

Prérequis :
    - La propriété est vérifiée dans votre Search Console.
    - Un compte de service Google Cloud est autorisé sur cette propriété
      (Search Console > Paramètres > Utilisateurs et autorisations).

Exécution :
    python indexing.py "https://www.exemple.fr/" \
        "https://www.exemple.fr/sitemap.xml" \
        "cle_service_account.json"
"""

from google.oauth2 import service_account
from googleapiclient.discovery import build

# Portée minimale suffisante : lecture/écriture des sitemaps uniquement.
_SCOPES = ["https://www.googleapis.com/auth/webmasters"]


def soumettre_sitemap(site_url: str, sitemap_url: str, compte_de_service: str) -> dict:
    """
    Déclare un sitemap à la Search Console pour une propriété vérifiée.

    Args:
        site_url:        Propriété vérifiée, au format URL
                         ("https://www.exemple.fr/") ou domaine
                         ("sc-domain:exemple.fr").
        sitemap_url:     URL absolue et publique du sitemap,
                         ex. "https://www.exemple.fr/sitemap.xml".
        compte_de_service: Chemin vers la clé JSON du service account
                         autorisé sur la propriété.

    Returns:
        dict {"statut": "soumis", "site": ..., "sitemap": ...}

    Raises:
        googleapiclient.errors.HttpError: propriété non vérifiée,
            sitemap injoignable ou quota dépassé — le message de
            l'erreur indique la cause exacte.
    """
    # Authentification du compte de service.
    creds = service_account.Credentials.from_service_account_file(
        compte_de_service, scopes=_SCOPES
    )
    service = build("webmasters", "v3", credentials=creds)

    # L'appel réussit silencieusement ; toute erreur lève une HttpError.
    service.sitemaps().submit(siteUrl=site_url, feedpath=sitemap_url).execute()

    return {"statut": "soumis", "site": site_url, "sitemap": sitemap_url}


if __name__ == "__main__":
    import json
    import sys

    if len(sys.argv) != 4:
        print(
            "usage: python indexing.py "
            "<site_url> <sitemap_url> <cle_service_account.json>"
        )
        sys.exit(1)

    resultat = soumettre_sitemap(sys.argv[1], sys.argv[2], sys.argv[3])
    print(json.dumps(resultat, indent=2, ensure_ascii=False))
