# Notes de documentation — ClaudePlugins

Spécificités projet lues par la skill `/doc` (plugin `claude-utils`). La méthode vit dans la skill —
ne pas la recopier ici.

Particularité de ce dépôt : **il ne contient pas d'application, il contient un catalogue.** La vérité
n'est donc jamais dans du code exécuté, elle est dans les manifestes et dans l'arborescence des
skills. Tout ce que le README affirme est vérifiable mécaniquement.

## Carte : section du README → source qui fait foi

| Section | Où est la vérité |
|---|---|
| Table des plugins (nom, version) | `.claude-plugin/marketplace.json` **et** `<plugin>/.claude-plugin/plugin.json` — voir « la version se dit à trois endroits » plus bas |
| Tableau des skills | `claude-utils/skills/*/SKILL.md` — **un dossier = une ligne**, et le rôle se lit dans le `description` du frontmatter, pas dans le corps |
| Notes projet lues par une skill | les `SKILL.md` eux-mêmes : `grep -l "\.claude/.*-notes\.md" claude-utils/skills/*/SKILL.md`. Aujourd'hui `audit`, `deploy`, `test`, `doc` lisent les leurs, et `ship` lit le seul champ « Bumpé par » de `deploy-notes.md` |
| Installation rapide | [INSTALL.md](../INSTALL.md) — **y renvoyer, ne pas dupliquer.** Le README ne garde que les deux commandes et l'avertissement de double scope |
| Structure du repo | l'arborescence réelle, pas la mémoire qu'on en a |
| Documentation (liens de fin) | les fichiers présents à la racine et dans `docs/` |

## Ordre des sections à préserver

`# ClaudePlugins` → bandeau du tutoriel → table des plugins → `## Plugin claude-utils` (+ `### Skills`)
→ `## Installation rapide` → `## Structure du repo` → `## Documentation`

## Deux README, une frontière

- **`README.md` (racine)** — *présente* : ce que contient le catalogue, comment l'installer, où lire
  la suite. Il renvoie, il ne détaille pas.
- **`claude-utils/README.md`** — *détaille* le plugin : usage d'`/audit`, mécanique des notes projet,
  procédure de migration d'une skill locale.
- **`claude-utils/QUICKSTART.md`** — *prend en main* depuis un poste neuf.

Une même explication qui apparaît dans deux de ces fichiers finit par diverger. En cas de doute, le
détail va dans le README du plugin et la racine y renvoie.

## Fichiers annexes qui dérivent

Le vrai piège du dépôt : **une phrase sur une skill vit dans quatre fichiers.** Quand le comportement
d'une skill change, vérifier les quatre, pas seulement le README.

- `claude-utils/README.md` — tableau des skills, et les sections de méthode
- `claude-utils/QUICKSTART.md` — la liste des skills proposées après `/`, et le tableau « quand →
  quelle commande »
- `CLAUDE.md` — la ligne d'énumération des skills du plugin
- `INSTALL.md` · `DEPLOYMENT.md` — installer et dépanner d'un côté, publier de l'autre
- `docs/index.html` — tutoriel autonome publié par GitHub Pages. Il ne cite aujourd'hui **ni version
  ni nom de skill** : le vérifier plutôt que le supposer, c'est ce qui le tient hors du lot à chaque
  passage.

## Fichiers générés — ne jamais présenter comme éditables

Aucun. `docs/index.html` est écrit à la main malgré sa taille ; il n'est produit par aucune commande.

## Ce qui ne doit jamais y figurer

**Le dépôt est public.** Aucun chemin absolu du poste (`C:\Users\…`), aucun nom de dépôt privé du
propriétaire pris comme exemple — les exemples nomment des projets fictifs (`horizon-app`,
`stellar-api`).

Ne jamais documenter un hook ni un serveur MCP : le README affirme que les plugins **n'exécutent
aucun code**, et c'est cette phrase qui autorise à installer sans se méfier. Elle se vérifie :

```powershell
Get-ChildItem -Recurse -Force -Include "hooks","*.mcp.json" | Where-Object { $_.FullName -notmatch "\\\.git\\" }
```

Si un plugin gagne un jour un hook, la phrase devient fausse et doit **tomber**, pas être nuancée.

## Pièges maison

- **La version se dit à trois endroits** : `version` du `plugin.json`, `metadata.version` du
  `marketplace.json`, et la table des plugins du README. C'est l'écart le plus fréquent du dépôt, et
  le seul que le lecteur voit avant d'installer.
- **`description` et `keywords` doivent être identiques entre les deux manifestes** — divergence déjà
  constatée et corrigée (`CONF-04` du journal d'audit) :

  ```powershell
  node -e "const a=require('./claude-utils/.claude-plugin/plugin.json'),b=require('./.claude-plugin/marketplace.json').plugins[0];console.log(a.description===b.description, JSON.stringify(a.keywords)===JSON.stringify(b.keywords))"
  ```

- **Compter avant d'écrire** : autant de lignes dans le tableau des skills que de dossiers dans
  `claude-utils/skills/`, et autant de rôles énumérés dans la ligne de présentation du plugin. C'est
  par cette énumération que `context-check` a disparu du récapitulatif sans que personne le voie.
- **Skills publiées ≠ skills internes.** `claude-utils/skills/` s'installe chez les autres ;
  `.claude/skills/` (`skill-new`) ne sort jamais du dépôt et n'a rien à faire dans un tableau
  d'installation.
- **Ajouter une skill demande de resynchroniser plusieurs fichiers** : la liste vit dans
  [DEPLOYMENT.md](../DEPLOYMENT.md), point 4. Ne pas la recopier ailleurs — elle a déjà divergé une
  fois (`CONF-07`).
- **`marketplace update` seul ne met pas à jour un plugin installé.** Cette nuance se perd à chaque
  réécriture et rend la doc de mise à jour fausse ; `README.md`, `INSTALL.md` et `/update-plugins`
  doivent continuer de la dire.
