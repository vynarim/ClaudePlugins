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
// La liste des six cibles est celle de DEPLOYMENT.md § « Ajouter une skill à un plugin existant »,
// point 4. Elle est recopiée ici parce qu'un script doit bien la porter ; c'est la SEULE copie, et
// elle se relit à chaque modification de DEPLOYMENT.md.
//
// Usage : node coherence.mjs        (depuis la racine du dépôt)
// Sortie : 1 s'il reste un défaut. La longueur d'un SKILL.md est un signalement, pas un défaut.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PLUGIN = 'claude-utils';

const CIBLES = [
  `${PLUGIN}/.claude-plugin/plugin.json`,
  '.claude-plugin/marketplace.json',
  `${PLUGIN}/README.md`,
  `${PLUGIN}/QUICKSTART.md`,
  'README.md',
  'CLAUDE.md',
];

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

// ---------------------------------------------------------------- Étape 1 — les six déclarations

const skills = readdirSync(`${PLUGIN}/skills`, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

const contenus = new Map(CIBLES.map((c) => [c, aplatir(lire(c))]));

console.log('— Étape 1 : les six déclarations');
for (const s of skills) {
  // Recherche de sous-chaîne, comme la commande PowerShell qu'elle remplace : une ABSENCE est une
  // certitude, une PRÉSENCE ne l'est pas. Resserrer sur une frontière de mot ferait rougir des
  // déclarations légitimes (`context-check` et son tiret, un nom entre accents graves) — et un
  // garde-fou qui rougit à tort est désactivé la semaine suivante.
  const manque = CIBLES.filter((c) => !contenus.get(c).includes(s));
  if (manque.length) {
    console.log(`::error::${s} — non déclarée dans : ${manque.join(', ')}`);
    defauts++;
  }
}
console.log(`  ${skills.length} skill(s) publiée(s) vérifiée(s) sur ${CIBLES.length} cibles`);

// ------------------------------------------------------------------ Étape 2 — les deux manifestes

console.log('\n— Étape 2 : les deux manifestes');
const plugin = JSON.parse(lire(`${PLUGIN}/.claude-plugin/plugin.json`));
const marketplace = JSON.parse(lire('.claude-plugin/marketplace.json'));
const entree = marketplace.plugins.find((p) => p.name === PLUGIN);

if (!entree) {
  console.log(`::error::${PLUGIN} absent de marketplace.json`);
  defauts++;
} else {
  if (plugin.description !== entree.description) {
    console.log('::error::description DIVERGENTE entre plugin.json et marketplace.json');
    defauts++;
  }
  if (JSON.stringify(plugin.keywords) !== JSON.stringify(entree.keywords)) {
    console.log('::error::keywords DIVERGENTS entre plugin.json et marketplace.json');
    defauts++;
  }
}

// La version se lit à trois endroits, et les trois doivent coïncider : le manifeste du plugin, les
// métadonnées de la marketplace, et la colonne version du tableau des plugins du README racine.
// C'est le README qu'on oublie — il ne casse rien, il désinforme.
const ligneReadme = lire('README.md')
  .split('\n')
  .find((l) => l.startsWith('|') && l.includes(`\`${PLUGIN}\``));
const versionReadme = ligneReadme
  ? (ligneReadme.split('|').map((c) => c.trim()).find((c) => /^\d+\.\d+\.\d+$/.test(c)) ?? '(aucune)')
  : '(ligne absente)';

const versions = {
  'plugin.json': plugin.version,
  'marketplace.metadata': marketplace.metadata?.version,
  'README racine': versionReadme,
};
const distinctes = new Set(Object.values(versions));
if (distinctes.size > 1) {
  console.log(`::error::versions DÉSALIGNÉES — ${Object.entries(versions).map(([k, v]) => `${k}: ${v}`).join(' | ')}`);
  defauts++;
} else {
  console.log(`  version ${plugin.version} — alignée sur les trois emplacements`);
}

// -------------------------------------------------------- Étape 3 — frontmatter et convention maison

console.log('\n— Étape 3 : frontmatter et convention maison');
const racines = [`${PLUGIN}/skills`, '.claude/skills'];
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
    'mot — une skill au nom courant (test, doc, ci) peut être « déclarée » par une phrase quelconque.',
  );
}
process.exit(defauts ? 1 : 0);
