# DEPLOYMENT.md — maintenir le plugin `claude-utils`

Guide mainteneur : ajouter une skill, publier une version, activer le plugin dans un projet.

---

## Ajouter une skill

1. Crée `claude-utils/skills/<nom>/SKILL.md` avec le frontmatter `name` et `description`.
2. Le dossier `skills/` est auto-découvert par le harness — pas de modification de `plugin.json` requise.
3. Incrémente la version et publie (voir section suivante).

---

## Publier une version

1. Incrémente `version` dans `claude-utils/.claude-plugin/plugin.json`.
2. `git commit` + `git push`.
3. Sur chaque poste : `claude plugin marketplace update dev-tools` (ou `/plugin marketplace update dev-tools`
   en session, suivi de `/reload-plugins`).

L'auto-update étant désactivé par défaut pour les marketplaces tierces, les développeurs doivent
lancer cette commande manuellement après chaque release.

---

## Activer le plugin dans un projet

Committe `.claude/settings.json` à la racine du projet (gabarit dans `examples/`) :

```json
{
  "extraKnownMarketplaces": {
    "dev-tools": {
      "source": { "source": "github", "repo": "vynarim/ClaudePlugins" }
    }
  },
  "enabledPlugins": {
    "claude-utils@dev-tools": { "enabled": true, "scope": "project" }
  }
}
```

Quand un développeur ouvre le projet et fait confiance au dossier, Claude Code lui propose
d'installer la marketplace et le plugin s'il ne les a pas encore. Ce n'est pas une installation
silencieuse forcée — c'est une proposition.

Si le projet a déjà un `.claude/settings.json`, **fusionne** les clés `extraKnownMarketplaces` et
`enabledPlugins` dans l'existant au lieu de remplacer le fichier.

---

## Sécurité

Le hook Node s'exécute avec les privilèges de l'utilisateur. N'installe que depuis ce repo interne.
Après toute install ou mise à jour : `/reload-plugins` ou redémarrage de VS Code pour activer les
changements.
