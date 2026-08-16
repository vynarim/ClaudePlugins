---
name: ci
description: >-
  Pose ou réaligne le garde-fou distant du dépôt courant : un workflow GitHub Actions qui rejoue à la
  poussée la batterie que `/test` joue en local. Prend les étapes dans `.claude/test-notes.md` et
  vérifie que chaque script existe vraiment avant de l'écrire — un workflow rouge en permanence est un
  workflow qu'on désactive. Ne déploie rien et ne publie jamais ce qui garde la porte (règles de
  sécurité, index). À utiliser quand les tests ne tournent que sur le poste de celui qui les a
  écrits. Déclenche sur : « ci », « mets en place la CI », « ajoute un garde-fou à la poussée »,
  « workflow GitHub Actions », « les tests ne tournent qu'en local », « pipeline », « lance les tests
  sur GitHub », « la CI est rouge », « pourquoi ça n'a pas été testé avant le merge », « intégration
  continue ».
---

# ci — le garde-fou distant, pendant de `/test`

Une batterie qui ne tourne que sur le poste de celui qui l'a écrite ne garde rien : elle est sautée le
jour où on est pressé, et c'est ce jour-là qu'elle aurait servi. Le garde-fou distant rejoue les mêmes
étapes, sur une machine neuve, sans qu'on ait à y penser.

Quatre principes :

1. **Le workflow ne redéfinit pas la batterie, il la rejoue.** Les étapes viennent de
   `.claude/test-notes.md` ou de `package.json` — jamais d'un modèle générique.
2. **Une étape inventée tue le garde-fou.** Un `npm run lint` dans un projet sans script `lint`
   échoue au premier run ; un workflow rouge en permanence est désactivé la semaine suivante, et le
   dépôt se retrouve moins protégé qu'avant.
3. **Ce qui garde la porte ne se publie pas tout seul.** Règles de sécurité, index, variables de
   production : la CI les **valide**, un humain les déploie. Voir un fichier de droits changer sous
   l'effet d'une poussée, sans que personne regarde, est exactement ce qu'on veut éviter.
4. **Garde-fou ≠ déploiement.** `ci` ne transforme pas un dépôt en publication automatique. Si le
   dépôt publie déjà par CI, c'est un fait à signaler — `/deploy` en dépend, puisque pousser y revient
   à mettre en ligne.

## Étape 0 — Charger ce qui existe déjà

```powershell
Get-ChildItem .github\workflows -File -ErrorAction SilentlyContinue
git remote -v
```

Lire `.claude/test-notes.md` (les étapes de la batterie, leur ordre, celles qui sont lentes) et
`.claude/deploy-notes.md` (cibles, secrets, ce qui se déploie à la main). **`ci` ne crée pas un
troisième fichier de notes** : ce qu'elle a besoin de savoir est déjà écrit dans ces deux-là.

Sans dépôt distant GitHub, s'arrêter et le dire : il n'y a pas de garde-fou distant à poser.

## Étape 1 — Établir la batterie réelle

Une étape ne s'écrit dans le workflow que si son script existe :

```powershell
node -e "console.log(Object.keys(require('./package.json').scripts||{}).join(' '))"
node -e "const p=require('./package.json');console.log(p.engines?.node||'engines.node absent')"
Get-Content .nvmrc -ErrorAction SilentlyContinue
```

Les noms varient d'un dépôt à l'autre — `lint` ici, `typecheck` là, `check` ailleurs. Prendre ceux du
projet, pas ceux du gabarit. Ce qui n'a pas de script mais compte quand même (règles sur émulateur,
E2E) se traite à l'étape 3.

## Étape 2 — Diagnostiquer

| Situation | Ce qu'on fait |
|---|---|
| aucun workflow | poser le garde-fou, au plus près de la batterie locale |
| workflow qui **déploie** sans rien vérifier | ajouter les vérifications **avant** l'étape de publication, dans le même job |
| workflow qui ne rejoue qu'une partie | nommer ce qui manque et pourquoi c'est resté dehors |
| workflow rouge depuis longtemps | le réparer d'abord — en ajouter un second à côté ne fait qu'ajouter du rouge |

## Étape 3 — Écrire le workflow

Un seul fichier, commenté en français, depuis
[references/workflow-template.yml](references/workflow-template.yml). Points qui ne s'improvisent
pas :

- **`npm ci`, pas `npm install`** : le lockfile fait foi, sinon la CI teste d'autres dépendances que
  le poste.
- **Identifiant public ≠ secret.** Une clé d'API web, un id de projet partent de toute façon dans le
  bundle : leur place est en `vars`. Posés en `secrets` et absents, ils seraient **vides sans que rien
  n'échoue** — le build passe, et l'application publiée n'est reliée à aucune base.
- **Un vrai secret manquant doit arrêter le run**, pas produire un artefact vide. Le contrôle se fait
  par `env:`, jamais en interpolant le secret dans la ligne `run:`.
- **Étapes lentes** (E2E, émulateurs) : les mettre en dernier, ou sur `workflow_dispatch` seul si le
  dépôt est privé — les minutes y sont comptées.

## Étape 4 — Vérifier qu'il a tourné

Un workflow jamais exécuté n'est pas un garde-fou.

```bash
gh run list --limit 3
gh run view --log-failed      # sur échec
```

## Étape 5 — Le brancher

```bash
gh api repos/{owner}/{repo}/branches/main/protection --jq '.required_status_checks.contexts'
```

Une réponse `404` signifie qu'aucune protection n'est posée : le workflow **informe** sans rien
empêcher, et une poussée rouge entre quand même. Le dire explicitement, et proposer d'exiger le check
— c'est ce dernier geste qui fait la différence entre un voyant et un garde-fou.

## Ce que cette skill ne fait PAS

- Elle ne déploie rien et n'ajoute aucune étape de publication à un workflow qui n'en avait pas.
- Elle n'écrit **jamais** de déploiement de règles de sécurité ou d'index dans un workflow.
- Elle n'invente aucun script : une étape sans script correspondant n'est pas écrite.
- Elle ne crée ni ne modifie de secret, et n'affiche jamais la valeur d'un secret existant.
- Elle ne modifie pas la protection de branche elle-même — elle constate et propose la commande.
- Elle ne committe pas — c'est `/ship`.

## Sortie attendue

Le diagnostic de l'existant, la batterie retenue **avec la preuve que chaque script existe**, le
fichier de workflow proposé en entier avant écriture, puis le résultat du premier run réel. Et pour
finir, ce que le garde-fou ne couvre pas : les étapes laissées dehors, et si le check est exigé ou
seulement affiché.
