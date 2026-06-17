---
name: pp-ship
description: >-
  Publie une Power App (Code App) dans une solution Power Platform : vérifie que le projet est
  initialisé, recharge le PATH, build l'app (npm run build) puis pousse avec
  pac code push --solutionName, et diagnostique les erreurs courantes (PATH périmé, auth expirée,
  Code Apps non activées, certificat). À utiliser quand l'utilisateur veut publier/déployer/pousser sa
  Power App ou sa Code App. Déclenche sur : « pp-ship », « publie la code app », « déploie la power
  app », « pac code push », « pousse sur l'environnement », « mets en ligne la code app », « build +
  push power apps ».
---

# pp-ship — Publier une Power App Code App dans une solution

## Cadre citizen dev (au lancement et à la fin)

- **Au lancement**, annonce en **2 phrases** ce que tu vas faire, en langage **fonctionnel** (pas
  technique). À dire : « Je publie ton application dans ton environnement Power Platform. Une fois
  fait, elle sera accessible en ligne via une adresse. »
- Reste **sobre** ensuite : pas de jargon ni de détails techniques, sauf pour expliquer un blocage.
- **À la fin**, rappelle l'enchaînement et **la prochaine étape concrète** :
  `/pp-setup` (poste, une fois) → `/pp-scaffold` (créer l'app) → `/pp-data` (données) →
  `/pp-ship` (publier). Aides à tout moment : `/pp-auth` (connexion), `/pp-diag` (vérifier).

Objectif : enchaîner build + push de façon fiable, en neutralisant d'abord les pièges du poste (PATH
périmé, certificat), en associant l'app à la bonne solution, et en traduisant les erreurs `pac` en
action concrète.

Contexte : VS Code sous Windows, shell **PowerShell**. Statut **preview**.

## 1. Lire la config et vérifier les prérequis

Lire `PowerPlatform.md` à la racine du projet (gabarit :
`../../references/powerplatform-md-template.md`, racine du plugin) : **nom de solution**
(`--solutionName`), **dossier de l'app**, certificat.

Vérifier que le projet est une Code App initialisée :

```powershell
Test-Path power.config.json
```

Si absent → le projet n'est pas initialisé : passer par `/pp-scaffold` (`pac code init`) avant de
publier. Si le nom de solution ou le dossier manque dans `PowerPlatform.md`, demander la valeur — ne
pas deviner.

## 2. Recharger le PATH (session-scopée)

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

## 3. (Si besoin) Certificat pour les installs

`npm run build` et `pac code push` n'ont **pas** besoin du certificat. Ne le poser que si un
`npm install` est requis : `$env:NODE_EXTRA_CA_CERTS = "<chemin .pem de PowerPlatform.md>"`.

## 4. Build

Dans le dossier de l'app :

```powershell
npm run build
```

Build cassé → corriger (ou `npm install` manquant avec le certificat) avant de pousser. Ne jamais
pousser un build en échec.

## 5. Push dans la solution

```powershell
pac code push --solutionName "<nom-de-solution>"
```

Sans `--solutionName`, l'app n'est pas placée dans une solution donnée. Pour une app portable
Dev/Test/Prod, s'assurer que les sources de données sont liées par **connection references** (voir
`/pp-data`) plutôt que par `connectionId` utilisateur. Le préfixe éditeur vient de la solution cible.

Le push renvoie une URL Power Apps en cas de succès.

## Traduction des erreurs courantes

| Erreur | Cause | Action |
|---|---|---|
| `pac` non reconnu | PATH périmé | Refaire l'étape 2 |
| `HTTP 403 CodeAppOperationNotAllowedInEnvironment` | Code Apps non activées sur l'environnement | Admin Center → environnement → Settings → Product → Features → « Power Apps code apps » (voir `/pp-setup`) |
| Erreur d'auth / token expiré | Session pac expirée | `pac auth create --environment "<url>"` puis `pac env select`, relancer |
| `unable to get local issuer certificate` (pendant npm install) | Certificat CA non pointé | Étape 3, puis refaire l'install |
| `power.config.json` introuvable | Projet non initialisé | `/pp-scaffold` (`pac code init`) |

## Cycle complet de référence

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
npm run build
pac code push --solutionName "<nom-de-solution>"
```

## Ce que cette skill ne fait PAS

- Elle n'initialise pas le projet (→ `/pp-scaffold`) ni n'ajoute de sources (→ `/pp-data`).
- Elle n'active pas les Code Apps (réglage web, → `/pp-setup`).
- Elle ne crée pas les connexions OAuth.
- Elle ne pousse jamais un build en échec ; ne modifie pas le PATH de façon permanente.

## Note de dépréciation

Les commandes `pac code` sont transitoires : à terme remplacées par le CLI npm embarqué dans
`@microsoft/power-apps` (v1.0.4+). Si `pac code push` change de comportement, vérifier la doc officielle.

## Sortie attendue

À la fin : confirmer le succès du push (et l'URL retournée) ou l'erreur traduite en action, en
rappelant l'environnement et la solution cibles.
