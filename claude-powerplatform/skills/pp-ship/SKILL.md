---
name: pp-ship
description: >-
  Publie une Power App (Code App) sur l'environnement cible : recharge le PATH, build l'app
  (npm run build) puis pousse avec pac code push --solutionName, et diagnostique les erreurs
  courantes (PATH périmé, auth pac expirée, Code Apps non activées, certificat). À utiliser quand
  l'utilisateur veut publier/déployer/pousser sa Power App ou sa Code App. Déclenche sur :
  « pp-ship », « publie la code app », « déploie la power app », « pac code push », « pousse sur
  l'environnement », « mets en ligne la code app », « build + push power apps ».
---

# pp-ship — Publier une Power App Code App

Objectif : enchaîner build + push de façon fiable, en neutralisant d'abord les deux pièges du poste
(PATH périmé, certificat) et en traduisant les erreurs `pac` en action concrète.

Contexte : VS Code sous Windows, shell **PowerShell**.

## 1. Lire la config du projet

Lire la section Power Platform du `CLAUDE.md` (gabarit dans `references/claude-md-template.md`) :

- **nom de solution** → `--solutionName` (obligatoire pour le push)
- **dossier de la code app** → où lancer `npm run build` et `pac code push`
- **certificat CA** → seulement utile si un `npm install` est nécessaire avant le build

Si le nom de solution ou le dossier manque, demander la valeur avant de continuer — ne pas deviner.

## 2. Recharger le PATH (session-scopée)

Les outils (`pac`, `node`) ajoutés au PATH après le lancement de Claude Code ne sont pas visibles
sans ça :

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

## 3. (Si besoin) Certificat pour les installs

`npm run build` et `pac code push` n'ont **pas** besoin du certificat. Ne le poser que si un
`npm install` est requis (dépendances manquantes) :

```powershell
$env:NODE_EXTRA_CA_CERTS = "<chemin .pem du CLAUDE.md>"
```

## 4. Build

Dans le dossier de la code app :

```powershell
npm run build
```

Si le build échoue sur une dépendance manquante → faire l'`npm install` (avec le certificat, étape 3)
puis relancer le build. Ne pas pousser un build cassé.

## 5. Push

```powershell
pac code push --solutionName "<nom-de-solution>"
```

## Traduction des erreurs courantes

| Erreur | Cause | Action |
|---|---|---|
| `pac` non reconnu | PATH périmé | Refaire l'étape 2 |
| `HTTP 403 CodeAppOperationNotAllowedInEnvironment` | Code Apps non activées sur l'environnement | Admin Center → environnement → Settings → Product → Features → « Power Apps code apps » |
| Erreur d'auth / token expiré | Session pac expirée | `pac auth create --environment "<url>"` puis relancer |
| `unable to get local issuer certificate` (pendant npm install) | Certificat CA non pointé | Étape 3, puis refaire l'install |

## Cycle complet de référence

```powershell
# 1. PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
# 2. dans le dossier de l'app
npm run build
pac code push --solutionName "<nom-de-solution>"
```

## Ce que cette skill ne fait PAS

- Elle n'active pas les Code Apps (réglage web, Admin Center).
- Elle ne crée pas les connexions OAuth (SharePoint, Outlook) — faites une fois dans le maker portal.
- Elle ne pousse jamais un build en échec.
- Elle ne modifie pas le PATH de façon permanente (correctif session uniquement).

## Sortie attendue

À la fin : confirmer que le push a réussi (ou l'erreur exacte traduite en action), et rappeler
l'environnement cible sur lequel la publication a eu lieu.
