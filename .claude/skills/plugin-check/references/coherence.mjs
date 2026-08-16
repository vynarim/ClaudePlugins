// Cohérence du catalogue : étapes 1 à 3 de /plugin-check, en une seule implémentation.
//
// Ces trois contrôles vivaient en PowerShell dans le SKILL.md, donc hors du garde-fou CI : une skill
// déclarée dans cinq endroits sur six, ou deux manifestes divergents, passaient la CI en vert. C'est
// pourtant la seule panne du dépôt qui casse tous les postes à la fois — un plugin dont le manifeste
// ment ne se charge plus.
//
// PowerShell 5.1 faisait mentir ces contrôles de deux façons (lecture ANSI : tout motif accentué
// échoue ; description repliée : « À utiliser » coupé entre deux lignes se lit comme absent). Node lit
// en UTF-8 et les blancs sont écrasés avant comparaison — les deux pièges disparaissent ici.
//
// La liste des cibles est celle de DEPLOYMENT.md § « Ajouter une skill à un plugin existant »,
// point 4. Elle est recopiée ici parce qu'un script doit bien la porter ; c'est la SEULE copie, et
// elle se relit à chaque modification de DEPLOYMENT.md.
//
// Les plugins sont DÉCOUVERTS, pas énumérés : un dossier de premier niveau qui porte un
// `.claude-plugin/plugin.json` est un plugin. Une liste en dur ici ferait qu'un troisième plugin
// serait ignoré en silence par le garde-fou — vert sur un catalogue faux, le pire des deux mondes.
//
// Usage : node coherence.mjs        (depuis la racine du dépôt)
// Sortie : 1 s'il reste un défaut. La longueur d'un SKILL.md est un signalement, pas un défaut.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PLUGINS = readdirSync('.', { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
  .map((e) => e.name)
  .filter((n) => existsSync(join(n, '.claude-plugin', 'plugin.json')))
  .sort();

// Toutes les cibles ne concernent pas tous les plugins : `QUICKSTART.md` n'existe que là où une prise
// en main a été écrite. Un fichier absent est retiré de la liste au lieu de faire échouer le
// contrôle — sinon le garde-fou rougirait sur un plugin qui n'a rien fait de mal.
const ciblesDe = (plugin) =>
  [
    `${plugin}/.claude-plugin/plugin.json`,
    '.claude-plugin/marketplace.json',
    `${plugin}/README.md`,
    `${plugin}/QUICKSTART.md`,
    'README.md',
    'CLAUDE.md',
  ].filter((f) => existsSync(f));

// Un écart arbitré ne se resignale pas. Toute entrée ici doit avoir sa ligne dans le SKILL.md,
// § « Exceptions admises » — une exception sans raison écrite est un défaut qu'on a renoncé à traiter.
const EXCEPTIONS = {
  // Seule skill proactive du plugin : sa description porte « Déclenche AUSSI quand », les phrases
  // n'étant qu'un déclencheur supplémentaire. L'aligner sur le gabarit la rendrait réactive, donc
  // trop tardive.
  eco: ['declenche'],
};

const MAX_LIGNES = 150;

let defauts = 0;
let signalements = 0;

// Le BOM est retiré à la lecture : `Set-Content -Encoding UTF8` en PowerShell 5.1 en écrit un, et
// trois octets invisibles en tête de fichier suffisent à faire échouer le `^---` du frontmatter —
// le contrôle rendait alors « name absent » et « description absente » sur une skill intacte.
const lire = (f) => readFileSync(f, 'utf8').replace(/^﻿/, '');
const aplatir = (t) => t.replace(/\s+/g, ' ');

const skillsDe = (plugin) =>
  readdirSync(`${plugin}/skills`, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

console.log(`Plugins découverts : ${PLUGINS.join(', ') || '(aucun)'}`);
if (!PLUGINS.length) {
  console.log('::error::aucun plugin trouvé — un plugin est un dossier portant .claude-plugin/plugin.json');
  process.exit(1);
}

// ------------------------------------------------------------------- Étape 1 — les déclarations

console.log('\n— Étape 1 : les déclarations');
for (const plugin of PLUGINS) {
  const cibles = ciblesDe(plugin);
  const contenus = new Map(cibles.map((c) => [c, aplatir(lire(c))]));
  const skills = skillsDe(plugin);

  for (const s of skills) {
    // Recherche de sous-chaîne, comme la commande PowerShell qu'elle remplace : une ABSENCE est une
    // certitude, une PRÉSENCE ne l'est pas. Resserrer sur une frontière de mot ferait rougir des
    // déclarations légitimes (`context-check` et son tiret, un nom entre accents graves) — et un
    // garde-fou qui rougit à tort est désactivé la semaine suivante.
    const manque = cibles.filter((c) => !contenus.get(c).includes(s));
    if (manque.length) {
      console.log(`::error::${plugin}/${s} — non déclarée dans : ${manque.join(', ')}`);
      defauts++;
    }
  }
  console.log(`  ${plugin} — ${skills.length} skill(s) sur ${cibles.length} cibles`);
}

// -------------------------------------------------------------------- Étape 2 — les manifestes

console.log('\n— Étape 2 : les manifestes');
const marketplace = JSON.parse(lire('.claude-plugin/marketplace.json'));
const readmeRacine = lire('README.md').split('\n');

for (const plugin of PLUGINS) {
  const manifeste = JSON.parse(lire(`${plugin}/.claude-plugin/plugin.json`));
  const entree = marketplace.plugins.find((p) => p.name === plugin);

  if (!entree) {
    console.log(`::error::${plugin} absent de marketplace.json`);
    defauts++;
    continue;
  }
  if (manifeste.description !== entree.description) {
    console.log(`::error::${plugin} — description DIVERGENTE entre plugin.json et marketplace.json`);
    defauts++;
  }
  if (JSON.stringify(manifeste.keywords) !== JSON.stringify(entree.keywords)) {
    console.log(`::error::${plugin} — keywords DIVERGENTS entre plugin.json et marketplace.json`);
    defauts++;
  }

  // La version d'un plugin se lit à DEUX endroits : son manifeste, et la colonne version du tableau
  // des plugins du README racine. C'est le README qu'on oublie — il ne casse rien, il désinforme.
  //
  // `metadata.version` de la marketplace n'entre plus dans cette comparaison : à plusieurs plugins,
  // elle ne peut plus être la version de l'un d'eux. C'est la version du CATALOGUE, bumpée à chaque
  // publication ; qu'elle l'ait été ne se déduit d'aucun fichier, donc ne se contrôle pas ici.
  const ligne = readmeRacine.find((l) => l.startsWith('|') && l.includes(`\`${plugin}\``));
  const versionReadme = ligne
    ? (ligne.split('|').map((c) => c.trim()).find((c) => /^\d+\.\d+\.\d+$/.test(c)) ?? '(aucune)')
    : '(ligne absente)';

  if (manifeste.version !== versionReadme) {
    console.log(
      `::error::${plugin} — versions DÉSALIGNÉES — plugin.json: ${manifeste.version} | README racine: ${versionReadme}`,
    );
    defauts++;
  } else {
    console.log(`  ${plugin} — version ${manifeste.version}, alignée sur le README racine`);
  }
}

const versionCatalogue = marketplace.metadata?.version;
if (!/^\d+\.\d+\.\d+$/.test(versionCatalogue ?? '')) {
  console.log(`::error::marketplace.metadata.version absente ou hors semver — ${versionCatalogue}`);
  defauts++;
} else {
  console.log(`  catalogue — version ${versionCatalogue} (non comparée : voir le commentaire)`);
}

// -------------------------------------------------------- Étape 3 — frontmatter et convention maison

console.log('\n— Étape 3 : frontmatter et convention maison');
const racines = [...PLUGINS.map((p) => `${p}/skills`), '.claude/skills'];
let verifiees = 0;

for (const racine of racines) {
  if (!existsSync(racine)) continue;
  for (const nom of readdirSync(racine)) {
    const md = join(racine, nom, 'SKILL.md');
    if (!existsSync(md)) continue;
    verifiees++;

    const texte = lire(md);
    const exempt = EXCEPTIONS[nom] ?? [];
    const front = texte.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const description = aplatir(front ? front[1] : '');

    const declare = front?.[1].match(/^name:\s*(\S+)/m)?.[1];
    if (declare !== nom) {
      // Une skill qui se charge sous un autre nom que celui de son dossier ne part jamais : on tape
      // le nom du dossier.
      console.log(`::error::${nom} — name du frontmatter = ${declare ?? '(absent)'}`);
      defauts++;
    }

    const regles = [
      ['utiliser', 'À utiliser', description, 'description sans « À utiliser »'],
      ['declenche', 'Déclenche sur', description, 'description sans « Déclenche sur : »'],
      ['nePasFaire', 'ne fait PAS', texte, 'section « Ce que cette skill ne fait PAS » absente'],
    ];
    for (const [cle, motif, ou, libelle] of regles) {
      if (exempt.includes(cle)) continue;
      if (!ou.includes(motif)) {
        console.log(`::error::${nom} — ${libelle}`);
        defauts++;
      }
    }

    // Signalement, pas défaut : ce qui déborde a sa place dans references/, mais une skill longue
    // reste fonctionnelle. Rougir là-dessus ferait désactiver le garde-fou.
    const lignes = texte.split('\n').length;
    if (lignes > MAX_LIGNES) {
      console.log(`::warning::${nom} — ${lignes} lignes (> ${MAX_LIGNES}) : déporter dans references/`);
      signalements++;
    }
  }
}

console.log(`  ${verifiees} SKILL.md vérifié(s)`);

// ------------------------------------------------------------------------------------- Rendu

console.log(`\n${defauts} défaut(s) · ${signalements} signalement(s)`);
if (!defauts) {
  console.log(
    'Non tranché automatiquement : les présences de l\'étape 1 sont trouvées par simple recherche de\n' +
    'mot — une skill au nom courant (test, doc, ci) peut être « déclarée » par une phrase quelconque.\n' +
    'Et le bump de `marketplace.metadata.version` à chaque publication ne se déduit d\'aucun fichier.',
  );
}
process.exit(defauts ? 1 : 0);
