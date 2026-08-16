# uxui-notes.md — gabarit

À copier dans `.claude/uxui-notes.md` du projet concerné. **Un seul fichier pour tout le plugin
`claude-uxui`**, pas un par skill : le profil d'un projet ne change pas selon la skill qui le lit, et
deux fichiers qui décrivent la même application finissent par se contredire.

Facultatif. Sans lui, chaque skill détecte le profil et **demande confirmation** avant d'agir. Avec
lui, elle ne repose plus la question à chaque passage.

Tout supprimer ce qui ne s'applique pas. Une section vide vaut mieux qu'une section inventée.

---

## Profil

**Profil :** `mobile-only` · `mobile-first` · `responsive` · `desktop`

*Un seul. C'est la ligne la plus importante du fichier : elle autorise ou interdit une skill entière.
`mobile-only` = l'application n'a aucune version desktop et n'en aura pas. `mobile-first` = elle
s'adapte déjà au-delà du seuil. `responsive` / `desktop` = `ui-frame` ne s'applique pas.*

**Pourquoi ce profil :** *(une phrase — installée en PWA depuis le téléphone, distribuée par QR code
sur place, usage terrain gant/soleil…)*

## Points d'ancrage

| Rôle | Sélecteur / chemin |
|---|---|
| Point d'entrée HTML | `index.html` |
| Feuille de style globale | `src/index.css` |
| Conteneur racine (le cadre) | `#root` |
| Conteneur qui défile | `.app-shell` |
| Éléments fixes (nav, toasts) | `.bottom-nav`, `.toast-host` |

*Le conteneur qui défile est celui qu'on identifie mal. Il porte l'en-tête et l'écran courant ; la nav
et les modales sont ses **frères**, pas ses enfants.*

## Cadre

- **Seuil desktop :** `600px`
- **Ratio :** `412 / 915`
- **Largeur mobile de référence :** `480px` — *la largeur pour laquelle l'application a réellement
  été dessinée, celle sur laquelle l'en-tête et la nav sont calés. Le cadre ne doit jamais la
  dépasser, sinon le contenu se recentre en dedans et des bandes de fond apparaissent sur les côtés.
  C'est le terme du `min()` qu'on oublie.*
- **Nom des propriétés :** `--app-frame-h`, `--app-ratio`, `--app-max-w`
  *(à relever tel quel si le projet en emploie d'autres — `--app-h`, `--app-w`… : la skill compare,
  elle ne renomme pas.)*
- **Fond de page hors cadre :** `#050409`
- **Zoom global d'interface :** aucun · `--app-zoom` posé par `<composant>`
  *Si présent, `--app-frame-h` doit être recalculée dans le sous-arbre zoomé — voir le § « piège du
  zoom » de la référence.*

## Portails et échappées connues

*Les `createPortal` / `Teleport` du projet, avec leur cible et la raison de leur existence. Un portail
posé pour échapper au `transform` d'une animation de swipe ne doit pas être supprimé — seulement
reciblé.*

| Composant | Cible actuelle | Raison |
|---|---|---|
| `SwipeSheet` | `document.body` | échappe au `transform` de la transition de swipe |

## Contraintes d'accessibilité propres au projet

*Contraintes réelles, pas la checklist WCAG générique : usage en plein soleil, avec des gants, à une
main, par des utilisateurs qui ne reviendront jamais sur l'application.*

## Hors périmètre

*Ce que les skills UX/UI ne doivent pas toucher : écran embarqué dans un iframe tiers, page de
paiement dont la mise en page vient du prestataire, maquette figée par un client…*

## Arbitrages déjà rendus

*Ce qu'on a décidé de garder tel quel, pour ne pas se le faire re-proposer à chaque passage.*

| Constat | Décision | Date |
|---|---|---|
