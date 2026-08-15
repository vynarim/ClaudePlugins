---
name: deploy
description: >-
  Met en production le dépôt courant : bump de version, vérifications, contrôle anti-secrets,
  envoi via ship, déploiement cible par cible dans le bon ordre, puis vérification en ligne de ce
  qui est réellement servi. Lit les cibles et les commandes dans `.claude/deploy-notes.md` — elle
  n'en devine aucune. À utiliser quand l'utilisateur veut mettre en ligne. Déclenche sur :
  « deploy », « déploie », « mets en prod », « mise en ligne », « livrer », « publie la nouvelle
  version », « déployer le hosting », « déployer les functions », « déployer les règles ».
---

# deploy — mettre en production le dépôt courant

`/ship` **ne déploie rien** — il commit et pousse. C'est cette skill qui met en ligne, et elle
appelle la procédure de `/ship` au passage pour la partie git.

Trois principes, dans cet ordre :

1. **Rien n'est deviné.** Cibles, commandes, URL et secrets viennent de
   `.claude/deploy-notes.md`. Sans ce fichier, la skill ne déploie pas : elle propose de le créer.
2. **On ne déploie jamais par-dessus du rouge.** S'arrêter à la première étape qui échoue,
   corriger, reprendre depuis le début.
3. **La sortie de l'outil ne prouve rien.** `Deploy complete!` s'affiche sur des cibles qui n'ont
   rien reçu ; `Skipped — no changes detected` s'affiche sur des composants qui viennent d'être
   publiés. Seul le comportement observé en ligne fait foi (étape 7).

## Étape 0 — Charger les notes du projet

Lire `.claude/deploy-notes.md`. **Absent : s'arrêter là**, proposer de le créer depuis
[references/deploy-notes-template.md](references/deploy-notes-template.md) et ne rien exécuter. Une
commande de déploiement inventée est le seul geste de cette skill qui ne se rattrape pas.

Y sont déclarés : les cibles et leur commande, l'URL de prod, le fichier de version, les fichiers
jamais commitables, l'emplacement des secrets du poste, le régime d'autorisation et la sonde en
ligne.

**Régime d'autorisation** — déclaré dans les notes, deux valeurs :
- `confirmation-par-commande` *(défaut)* — demander avant **chaque** commande de déploiement, même
  en plein lot, même si une précédente a été approuvée dans la même conversation. Une approbation ne
  vaut que pour le déploiement qu'elle couvre.
- `invocation-vaut-accord` — invoquer `/deploy` autorise commit, push et déploiement pour ce lot.

## Étape 1 — Bump de version

Incrémenter le fichier de version déclaré dans les notes. **Obligatoire à chaque déploiement** :
c'est le seul moyen de savoir quelle version tourne réellement sur un téléphone.

**Le bump précède le build.** Sinon le bundle embarque l'ancien numéro et le site en ligne annonce
une version différente de celle du dépôt. Si le projet délègue le bump à `/ship`, ne pas le faire
ici — et si `/ship` vient de passer sans que rien n'ait changé depuis, ne pas re-bumper.

## Étape 2 — Vérifications

Lancer la batterie déclarée dans les notes — ou `/test` si le projet en a une. Puis le build.

Les étapes lentes (règles sur émulateur, E2E) **ne sont pas optionnelles avant une livraison**, même
quand le lot ne touche aucun fichier de règles : ce sont elles qui éprouvent les droits réellement
appliqués, et un manquement ne se verrait qu'en ligne, sur les vraies données.

## Étape 3 — Vérifier que la version bumpée est dans le bundle

**Lire le numéro depuis le fichier de version, jamais l'écrire en dur dans le contrôle.** Un
contrôle qui porte une valeur figée rend faux à tous les coups dès que la série change — sur une
procédure qui interdit par ailleurs de déployer par-dessus du rouge, cela apprend à passer outre, et
plus rien n'est vu le jour où le bump manque vraiment. **Un contrôle qui échoue toujours ne contrôle
rien.**

## Étape 4 — Contrôle anti-secrets

Avant de stager, relire la liste des fichiers indexés et la confronter à la liste « ne jamais
committer » des notes :

```bash
git status --short
git diff --cached --name-only
```

Un secret poussé reste dans l'historique même après suppression. En cas de doute, s'arrêter avant de
stager plutôt que de committer puis corriger.

## Étape 5 — Envoi sur GitHub

Appliquer la procédure de **`claude-utils:ship`**. Ce qui part en ligne doit correspondre à un
**commit identifiable**, sinon le retour arrière est impossible — c'est la raison pour laquelle le
push précède le déploiement, et non l'inverse.

Si le dépôt publie **par CI** (une poussée sur la branche par défaut déclenche la mise en ligne), le
dire avant de pousser : `/ship` met alors de fait l'application en ligne. Suivre le run plutôt que
déployer à la main — un déploiement manuel court-circuiterait la CI et publierait un build non
vérifié.

## Étape 6 — Déployer, cible par cible

Ne déployer que les cibles réellement touchées par le lot. **L'ordre n'est pas fixe : il dépend du
sens du changement.**

1. **Une migration de données qui conditionne les règles passe avant tout le reste** — elle écrit
   avec la clé de service, donc hors règles, et prépare le terrain pendant que les anciennes sont
   encore en place.
2. **Les index avant le code qui les interroge**, et attendre leur construction (quelques minutes).
   Une commande qui ne déploie que les règles n'emporte pas les index, et affiche quand même un
   succès.
3. **Les fonctions** ensuite : elles ne dépendent en général d'aucune autre cible.
4. **Règles et hébergement : l'ordre dépend de qui perd des droits.**
   - Le lot **ajoute** des droits (l'interface va lire quelque chose de neuf) → **règles d'abord**,
     sinon on met en ligne des écrans que les règles anciennes refusent.
   - Le lot **retire** des droits ou restreint une lecture → **hébergement d'abord**. Le nouveau
     client, plus prudent, fonctionne sous les deux jeux de règles ; l'ancien ne survit pas aux
     nouvelles.

Si une commande semble bloquée, **lire la question** plutôt que la forcer : un outil de déploiement
demande confirmation avant de **supprimer** une ressource absente du code.

## Étape 7 — Vérifier en ligne

C'est l'étape que la sortie de l'outil ne remplace pas. Jouer la sonde déclarée dans les notes, et
au minimum :

- **le numéro de version réellement servi**, lu depuis le site en ligne — c'est le seul signe qu'on
  regarde la nouvelle build et pas une réponse en cache ;
- **si les règles ont bougé** : refaire le geste concerné avec un compte **non privilégié**. Un
  administrateur traverse les règles sans rien prouver et ne verrait pas une règle devenue trop
  stricte.

## Étape 8 — Rapport

Récapituler : fichiers touchés, nouvelle version, résultat des vérifications, hash du commit, cibles
déployées, résultat de la sonde en ligne, et l'URL. **Signaler tout ce qui a été volontairement
laissé de côté.**

## Ce que cette skill ne fait PAS

- Elle ne devine aucune commande de déploiement : sans `.claude/deploy-notes.md`, elle s'arrête.
- Elle ne déploie pas du code non commité et non poussé — le rollback deviendrait impossible.
- Elle ne déploie pas par-dessus une vérification rouge, et ne contourne pas un contrôle qui échoue.
- Elle ne remplace pas `/ship` : pour seulement pousser sans mettre en ligne, c'est `/ship`.
- Elle ne conclut pas depuis la sortie de l'outil de déploiement.

## Sortie attendue

Le rapport de l'étape 8. En cas d'arrêt, l'étape qui a échoué, ce qui a déjà été déployé, et ce qui
ne l'a pas été.
