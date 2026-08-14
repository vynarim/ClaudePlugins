# docs/ — Tutoriel publié (GitHub Pages)

Ce dossier héberge le **tutoriel HTML** « Claude Code + VS Code », publié via **GitHub Pages**.

**Page en ligne :** https://vynarim.github.io/ClaudePlugins/

---

## Contenu du dossier

| Fichier | Rôle |
|---------|------|
| `index.html` | La page publiée (un **seul fichier autonome** : HTML + CSS + JS inline). C'est lui que GitHub Pages sert à l'URL ci-dessus. |
| `README.md` | Ce fichier — notes de maintenance, non servi comme page. |
| `.nojekyll` | Fichier vide qui dit à GitHub de servir les fichiers tels quels, sans passer par Jekyll. |

---

## Comment c'est configuré (à faire une seule fois)

1. Repo → **Settings → Pages**.
2. **Source : Deploy from branch.**
3. Branche **`main`**, dossier **`/docs`** → **Save**.
4. La page sort en ligne en ~1 à 3 min (suivre l'onglet **Actions** en cas de souci).

> Astuce : ajouter un fichier vide `.nojekyll` dans `docs/` évite que GitHub
> tente de « compiler » les `.md` ou ignore d'éventuels fichiers commençant par `_`.

---

## Comment mettre à jour la page

1. Édite `index.html` directement (contenu, style et script y sont tous inline).
2. `git add docs/index.html` → `git commit` → `git push` (ou `/ship`).
3. GitHub Pages **redéploie automatiquement** à chaque push sur `main` ; recharge la page après ~1–3 min.

### Prévisualiser en local avant de pousser

Aucun serveur nécessaire : **double-clique sur `index.html`** (ou `Ctrl+O` dans le navigateur).
La page charge ses polices depuis Google Fonts → une connexion internet est requise à l'affichage (normal).

---

## Bon à savoir

- **`index.html` est autonome** : tout le style et le script de navigation sont inline. Pas de dépendances locales à gérer — un seul fichier à déplacer/mettre à jour.
- **Ne pas renommer `index.html`** si tu veux garder l'URL racine courte. Un autre nom donnerait `…/ClaudePlugins/mon-fichier.html`.
- **Vérifier les liens de temps en temps** : le tuto pointe vers des docs officielles (Claude Code, Firebase, web.dev…) qui peuvent être réorganisées.
