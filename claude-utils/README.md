# Plugin `claude-utils`

Boîte à outils générique pour Claude Code : un conteneur de **skills internes réutilisables**, plus des
hooks transverses. Pensé pour grossir — chaque nouvelle capacité est une skill de plus sous `skills/`.

## Contenu actuel

```
claude-utils/
├── .claude-plugin/plugin.json
├── skills/
│   └── eco/                      ← discipline de tokens/contexte (invocable via /eco)
│       ├── SKILL.md
│       └── references/
│           ├── claude-md-template.md
│           └── reglages-vscode.md
└── hooks/
    ├── hooks.json                ← UserPromptSubmit → script Node
    └── scripts/eco-window-check.js   ← alerte avant le reset estimé de la fenêtre 5 h
```

- **Skill `eco`** : reste sous les limites 5 h glissantes / hebdomadaires, garde le contexte propre,
  choisit le bon modèle. Se déclenche automatiquement sur les sessions de code, ou via `/eco`.
- **Hook fenêtre 5 h** : estimation locale ; prévient ~30 min avant le reset (réglable). La vraie
  valeur reste `/usage`. Échec silencieux : n'interrompt jamais un prompt.

## Ajouter une nouvelle skill

1. Crée `skills/<nouveau-nom>/SKILL.md` (frontmatter `name` + `description`).
2. Ajoute ses fichiers de référence à côté si besoin.
3. Incrémente `version` dans `.claude-plugin/plugin.json` et dans le `marketplace.json` du repo.
4. Commit + push ; les postes mettent à jour via `/plugin marketplace update dev-tools`.

Pas besoin de toucher `plugin.json` pour déclarer la skill : le dossier `skills/` est auto-découvert.

## Réglages du hook (variables d'environnement, optionnelles)

| Variable | Rôle | Défaut |
|---|---|---|
| `ECO_WARN_BEFORE_MIN` | Minutes avant le reset où alerter | `30` |
| `ECO_WINDOW_MIN` | Durée de la fenêtre, en minutes | `300` (5 h) |
| `ECO_STATE_FILE` | Chemin du fichier d'état | `~/.claude/eco-window-state.json` |
