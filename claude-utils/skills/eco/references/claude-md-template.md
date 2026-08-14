# Gabarit CLAUDE.md (léger)

À placer à la racine du projet. Injecté à **chaque** prompt → viser < 50 lignes / ~5k tokens.
Tout ce qui dépasse part dans `docs/` et n'est référencé qu'au besoin.

```markdown
# <Nom du projet>

## Résumé
Une à trois phrases : ce que fait l'app, où elle en est, la feature active.

## Stack
- Type de projet : <p. ex. React SPA, API Node, site HTML/CSS/JS, script PowerShell…>
- Données / back : <p. ex. Postgres, API REST, état local, fichiers statiques…>
- Outils : <p. ex. VS Code, Vite, npm, TypeScript…>

## Conventions
- Style de code & nommage : <p. ex. camelCase, composants PascalCase, kebab-case pour les fichiers>
- Structure des dossiers : <p. ex. src/components, src/services, assets/, /scripts>
- Règles spécifiques : <selon la stack — p. ex. pas de dépendance lourde sur un site statique,
  conventions de modules PowerShell, contraintes de la cible de déploiement…>

## État courant
- En cours : <tâche active>
- TODO : <2-3 prochaines étapes>
- Bugs connus : <liste courte>

## Détails déportés (lire seulement si pertinent)
- Architecture détaillée : docs/architecture.md
- Conventions complètes : docs/conventions.md
- Notes spécifiques (migration, déploiement…) : docs/notes.md

## Compact instructions
Lors d'un /compact : conserver l'état courant, les fichiers cibles, les décisions d'archi et les
critères d'acceptation ; supprimer hypothèses abandonnées, logs et explorations sans suite.
```

## Pourquoi cette forme
- **Court** : relisible d'un coup d'œil, faible coût par prompt.
- **Index, pas encyclopédie** : pointe vers `docs/` au lieu d'embarquer le détail.
- **État courant explicite** : permet de reprendre après un `/clear` sans tout réexpliquer.
- **Compact instructions intégrées** : la compaction reste utile même non guidée manuellement.

## Tenir le fichier propre
La bonne pratique est la **gouvernance, pas la croissance** : si tu ne peux pas survoler ton
`CLAUDE.md` entre deux réunions, il est trop long. Demander périodiquement à Claude Code de le
re-condenser et de déporter ce qui a grossi.
