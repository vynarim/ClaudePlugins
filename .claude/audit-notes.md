# Notes d'audit — ClaudePlugins

Spécificités projet lues par la skill `/audit` (plugin `claude-utils`). La méthode, l'auto-vérification
et le format du rapport vivent dans la skill — ne pas les recopier ici.

⚠️ **Ici il n'y a ni base, ni écran, ni modèle de données.** La grille générique (champs hors-modèle,
cascades, validations) ne s'applique pas. Ce qu'on audite, c'est la **cohérence d'un catalogue** :
manifestes, skills, docs et versions doivent dire la même chose, et une skill doit pouvoir se
déclencher. Utiliser la grille ci-dessous **à la place** de la grille générique, en gardant tout le
reste de la méthode.

## Où vit le « modèle »

- `.claude-plugin/marketplace.json` — plugins déclarés, `description`, `keywords`, `metadata.version`
- `<plugin>/.claude-plugin/plugin.json` — `version` (c'est elle qui déclenche la mise à jour sur les
  postes), `description`, `keywords`
- `<plugin>/skills/<nom>/SKILL.md` — frontmatter `name` + `description`, et `references/` éventuels
- `.claude/skills/` — skills **internes**, non publiées (`skill-new`)
- Docs : `README.md` racine, `claude-utils/README.md`, `claude-utils/QUICKSTART.md`, `INSTALL.md`,
  `DEPLOYMENT.md`, `CLAUDE.md`, `examples/`, `docs/index.html` (page GitHub Pages autonome)

## Domaines (découpage des agents)

`manifestes` · `skills` · `docs`

## Grille propre à ce dépôt

1. **Skill publiée mais non déclarée** — absente d'un des tableaux (`README.md` racine,
   `claude-utils/README.md`, `QUICKSTART.md`, liste des skills du `CLAUDE.md`), ou de la
   `description` de `plugin.json` / `marketplace.json`. Et l'inverse : une ligne de tableau pour une
   skill qui n'existe plus.
2. **Version non bumpée** alors que des fichiers de `<plugin>/skills/` ont changé depuis le dernier
   bump : les postes ne recevront rien. Vérifier aussi que `metadata.version` de `marketplace.json`
   et la colonne version du README racine suivent `plugin.json`.
3. **Description qui ne déclenche pas** — c'est le seul élément chargé en permanence, et c'est sur
   lui seul que la skill part. Une `description` sans formulations réelles de l'utilisateur
   (« Déclenche sur : … ») donne une skill morte : présente dans `/`, jamais invoquée.
4. **`name` du frontmatter ≠ nom du dossier**, ou `name` en collision avec une skill locale d'un
   projet consommateur (`ship`, `deploy`, `test`, `doc`…). Une collision rend l'invocation ambiguë
   chez le consommateur, pas ici — donc invisible depuis ce dépôt.
5. **Renvoi croisé mort** — une skill qui cite `/xxx` supprimée ou renommée, un `references/…`
   annoncé mais absent, un lien Markdown vers un fichier déplacé.
6. **Contradiction entre deux sources** — `CLAUDE.md`, `README`, `INSTALL`/`DEPLOYMENT` et le corps
   d'une skill qui donnent des consignes différentes sur le même sujet (convention de commit, trailer,
   procédure de mise à jour, scope d'installation). C'est la classe de défaut la plus fréquente ici :
   tout est documenté deux fois.
7. **Fuite de contexte local dans une skill publiée** — chemin en dur, référence à ce dépôt, ou
   hypothèse de stack. Une skill de `claude-utils` doit tourner sur n'importe quel projet ; le
   spécifique appartient à un fichier de notes côté consommateur.
8. **`examples/` et `docs/index.html` périmés** — gabarit de `settings.json` qui déclare la
   marketplace sous une forme que `INSTALL.md` ne documente plus, page Pages qui ne liste plus les
   bonnes skills.
9. **Skill interne exposée par erreur** dans `<plugin>/skills/`, ou skill publiable restée dans
   `.claude/skills/`.

## Déjà couvert

Rien d'automatisé — pas de tests dans ce dépôt. Le seul contrôle mécanique est la validation JSON :

```powershell
node -e "['.claude-plugin/marketplace.json','claude-utils/.claude-plugin/plugin.json'].forEach(f=>{JSON.parse(require('fs').readFileSync(f,'utf8'));console.log('OK '+f)})"
```

Le lancer avant de conclure : un JSON cassé empêche le chargement du plugin et rend tout le reste de
l'audit sans objet.

## Hors périmètre

- `docs/index.html` dans son détail de mise en forme — seul son contenu factuel compte.
- Le style rédactionnel des skills. On audite ce qui est faux ou contradictoire, pas ce qui pourrait
  être mieux tourné.

## Faux positifs écartés

| Constat | Pourquoi ce n'en est pas un | Écarté le |
|---|---|---|
| *(à remplir au fil des audits)* | | |
