# Axe SEC — Sécurité & authentification

Checklist fermée. Chaque point porte un id stable (`SEC-1`…) : un constat se rapporte toujours au
point qui l'a trouvé, ce qui rend deux audits comparables.

## Points d'entrée

Règles et policies (`firestore.rules`, `storage.rules`, RLS, `*.policy.*`) · middlewares et guards de
routes · routes API et fonctions serveur · configuration d'auth (providers, sessions, cookies) ·
tout code qui lit un rôle ou un flag de privilège · `.env*` et fichiers de config.

## Checklist

1. **Règles trop permissives** — écriture autorisée sur un champ réservé au serveur ; `allow write:
   if request.auth != null` qui vaut « n'importe quel compte peut tout écrire » ; règle par défaut
   plus large que les règles nommées.
2. **Autorité serveur vs client** — quelles écritures passent par le serveur (qui contourne les
   règles) et lesquelles sont directes ? Une écriture sensible faite côté client. Une fonction
   serveur qui ne revalide pas parce qu'« il y a déjà les règles ».
3. **Auto-promotion** — un utilisateur peut-il écrire son propre rôle, son statut, son quota ? Rôle
   global vs rôle par entité : les deux sont-ils vérifiés au bon endroit ?
4. **Chemin détourné** — import de fichier, appel d'API brut ou lien profond qui injecte un flag
   privilégié sans passer par le garde-fou de l'UI.
5. **État lecture seule** (archivé, clos, verrouillé, payé) — gardé dans **chaque handler
   d'écriture**, pas seulement masqué à l'affichage.
6. **Guard de route** absent, ou posé uniquement côté client — page protégée atteignable en deep
   link, ou données récupérables par appel direct de l'API sans passer par l'écran.
7. **Session** — expiration, révocation, rafraîchissement. Que se passe-t-il après un changement de
   rôle, une désactivation ou une suppression de compte : la session en cours garde-t-elle ses
   droits ?
8. **Identité de confiance** — l'id utilisateur utilisé pour autoriser vient-il du jeton vérifié
   côté serveur, ou d'un champ envoyé par le client ?
9. **Secrets** — clé privée ou jeton d'API dans le bundle client, `.env` committé, secret écrit dans
   un log ou un message d'erreur renvoyé au client.
10. **Entrées non validées côté serveur** — injection SQL/NoSQL, chemin de fichier construit depuis
    une entrée, HTML injecté (`dangerouslySetInnerHTML`, `v-html`), redirection ouverte.
11. **Exposition excessive** — endpoint ou requête qui renvoie plus de champs que l'écran n'en
    affiche (email, notes internes, hash), listing qui laisse énumérer les ids.
12. **Surface réseau** — CORS en `*`, en-têtes de sécurité absents, upload sans contrôle de type ni
    de taille, absence de limitation de débit sur login / reset / envoi de mail.

## Faux positifs classiques

- Une **clé publique** (apiKey Firebase, publishable key Stripe, id de projet) n'est pas un secret :
  elle est faite pour être dans le client. Ce qui compte, ce sont les règles derrière.
- Une validation **absente côté client** n'est pas une faille si le serveur valide — c'est au pire
  un défaut d'UX (axe FONC).
- Un endpoint volontairement public (page vitrine, healthcheck) n'est pas une exposition.

## Gravité sur cet axe

🔴 dès qu'un utilisateur non autorisé peut **lire ou écrire** une donnée qui ne lui appartient pas,
ou élever ses droits — même si l'UI ne propose pas le chemin. 🟠 pour une défense en profondeur
manquante alors qu'une autre couche tient encore. 🟡 pour du durcissement.
