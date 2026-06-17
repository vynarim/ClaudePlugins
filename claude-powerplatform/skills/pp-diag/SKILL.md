---
name: pp-diag
description: >-
  Diagnostic d'un poste pour le développement Power Apps (Code Apps) avec Claude Code dans VS Code :
  vérifie la toolchain (node, npm, pac, git) dans le PATH, l'authentification pac sur le bon
  environnement, la présence du certificat CA corporate, et signale les causes des erreurs courantes.
  À utiliser quand l'utilisateur veut savoir si sa machine est prête pour Power Platform, quand une
  commande pac/build échoue, ou avant un pac code push. Déclenche sur : « pp-diag », « diagnostic
  power platform », « ma machine est prête pour pac ? », « pac ne marche pas », « pourquoi pac code
  push échoue », « vérifie ma config power apps », « pac auth ».
---

# pp-diag — Diagnostic d'un poste Power Platform (Code Apps)

Objectif : vérifier en quelques commandes que le poste est opérationnel pour développer et publier
une Power App Code App, et pointer la cause exacte quand quelque chose cloche.

Contexte : VS Code sous Windows, shell **PowerShell**. Toutes les commandes système ci-dessous sont
en PowerShell.

## Lire la config du projet

Avant tout, lire la section Power Platform du `CLAUDE.md` du projet (voir
`references/claude-md-template.md` pour le gabarit attendu). On y trouve :

- l'environnement cible (nom + URL Dynamics)
- le nom de la solution (`--solutionName`)
- le chemin du certificat CA corporate (ou « aucun »)
- les connexions OAuth (SharePoint, Outlook…) et leurs IDs
- le dossier de la code app

Si la section est absente, le signaler : le diagnostic reste possible mais l'étape « bon
environnement » ne pourra pas être vérifiée contre une valeur attendue.

## Les 5 vérifications

### 1. Toolchain présente dans le PATH

```powershell
node --version; npm --version; pac --version; git --version
```

Versions de référence connues comme fonctionnelles : Node ≥ 20, pac ≥ 2.8. Si une commande renvoie
« n'est pas reconnu », passer à la vérif 2 (PATH périmé) avant de conclure à une absence d'install.

### 2. Quirk du PATH (cause n°1 des faux négatifs)

Les outils ajoutés au PATH **après** le lancement de Claude Code ne sont pas visibles : les appels
PowerShell héritent d'un environnement figé au démarrage. Recharger le PATH dans la session courante :

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Puis refaire la vérif 1. Si les outils apparaissent maintenant, c'était bien le PATH périmé — et non
une install manquante. (Un terminal ouvert frais voit les outils automatiquement.)

### 3. Certificat CA corporate

Sur un réseau d'entreprise avec interception TLS, Node ne connaît pas la racine CA → les
`npm install` de paquets à build natif (ex. `keytar`) échouent sur
`unable to get local issuer certificate`.

Si le `CLAUDE.md` indique un certificat :

```powershell
Test-Path $env:NODE_EXTRA_CA_CERTS   # le .pem est-il pointé dans la session ?
```

Si vide ou faux, indiquer la commande pour le re-pointer (session-scopée) :

```powershell
$env:NODE_EXTRA_CA_CERTS = "$env:USERPROFILE\corp-ca-bundle.pem"
```

⚠️ Variable **session-scopée** : à redéfinir à chaque nouveau shell. Elle n'est nécessaire que pour
les `npm install` de dépendances — `npm run build`, `npm run dev` et `pac code push` n'en ont pas
besoin.

### 4. Authentification pac sur le bon environnement

```powershell
pac auth list
pac org who
```

`pac org who` doit pointer l'URL d'environnement attendue (celle du `CLAUDE.md`). Si aucune auth ou
mauvais environnement :

```powershell
pac auth create --environment "<url-dynamics-du-CLAUDE.md>"
```

### 5. Activation des Code Apps côté environnement

Ne se vérifie pas en CLI (réglage web). Le symptôme d'une activation manquante est un échec au push :
`HTTP 403 CodeAppOperationNotAllowedInEnvironment`. Si on l'a déjà rencontré, renvoyer vers :
Power Platform Admin Center → environnement → Settings → Product → Features → « Power Apps code apps ».

## Sortie attendue

Une checklist claire, une ligne par vérification :

```
## Diagnostic Power Platform — <projet>

- [✅/❌] Toolchain : node <v>, npm <v>, pac <v>, git <v>
- [✅/❌] PATH : outils visibles (sinon : PATH rechargé → refaire)
- [✅/❌] Certificat CA : <chemin> présent et pointé (ou « non requis »)
- [✅/❌] Auth pac : connecté à <url> (attendu : <url>)
- [ℹ️]   Code Apps activées : non vérifiable en CLI (symptôme = HTTP 403 au push)

### Verdict
<Prêt à publier / Action requise : …>
```

Rester factuel. Pour chaque ❌, donner la commande exacte qui corrige.
