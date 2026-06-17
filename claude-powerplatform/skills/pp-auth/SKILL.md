---
name: pp-auth
description: >-
  Authentifie pac sur l'environnement Power Platform du projet, avant le diagnostic et la suite :
  lit l'URL dans PowerPlatform.md, vérifie si pac est déjà connecté au bon environnement, et sinon
  fournit la commande pac auth create (interactive, ouvre le navigateur) puis pac env select, prêtes
  à coller. À utiliser pour se connecter à l'environnement, régler une auth expirée, ou choisir le bon
  environnement. Déclenche sur : « pp-auth », « connecte-moi », « se connecter à l'environnement »,
  « pac auth », « authentification power platform », « auth expirée », « login pac », « changer
  d'environnement pac ».
---

# pp-auth — Se connecter à l'environnement Power Platform

Objectif : garantir que `pac` est authentifié sur le **bon** environnement **avant** de lancer
`/pp-diag`, `/pp-scaffold`, etc. Évite de lancer un diagnostic qui échouerait juste sur l'auth.

Contexte : VS Code sous Windows, shell **PowerShell**.

## 1. Lire l'URL d'environnement

Lire `PowerPlatform.md` à la racine du projet et récupérer **« URL de l'environnement »**
(ex. `https://orgXXXX.crm.dynamics.com/`). Si le fichier ou l'URL manque → le signaler et renvoyer
vers `/pp-scaffold` (qui crée `PowerPlatform.md`).

## 2. Vérifier l'état actuel

```powershell
pac auth list; pac org who
```

- Si `pac org who` pointe **déjà** l'URL attendue → **c'est bon, rien à faire**. Le confirmer et
  s'arrêter.
- Sinon (aucune auth, MFA expirée `AADSTS50078`, ou mauvais environnement) → étape 3.

## 3. S'authentifier — ⚠️ action MANUELLE (interactive)

`pac auth create` ouvre une **fenêtre de connexion** (navigateur, MFA). Cette étape ne peut pas être
lancée automatiquement par Claude (les commandes tournent en non-interactif). **Donner les commandes
à l'utilisateur, pré-remplies avec l'URL de `PowerPlatform.md`, et lui demander de les coller dans le
terminal :**

```powershell
pac auth create --environment "<URL-de-PowerPlatform.md>"
pac env select --environment "<URL-de-PowerPlatform.md>"
```

> Si plusieurs comptes/tenants : choisir celui qui possède l'environnement. Un **Service Principal**
> ne peut pas posséder une Code App → utiliser un compte utilisateur. `pac env list` liste les
> environnements et leurs URLs si un doute subsiste sur la bonne valeur.

## 4. Vérifier

Après que l'utilisateur a confirmé s'être connecté :

```powershell
pac org who
```

Doit afficher l'URL attendue. Confirmer « connecté à <url> » puis inviter à enchaîner sur `/pp-diag`
ou `/pp-scaffold`.

## Ce que cette skill ne fait PAS

- Elle ne lance pas elle-même la fenêtre d'authentification (interactive → l'utilisateur la lance).
- Elle ne crée pas l'environnement ni la solution, n'active pas les Code Apps (→ `/pp-setup`).
