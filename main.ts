// main.ts — hands the guide in. Node 22 runs this TypeScript directly.
// It copies the static guide (app/) and the renders (screenshots/) into the output directory and
// writes dossier.json with the kit's buildDossier, so the judge gets one file describing the entry.

import { cpSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const root = dirname(fileURLToPath(import.meta.url));
const output = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A clean shelf every run: stale files would skew the dossier's byte counts.
rmSync(join(output, 'app'), { recursive: true, force: true });
rmSync(join(output, 'screenshots'), { recursive: true, force: true });
mkdirSync(output, { recursive: true });

cpSync(join(root, 'app'), join(output, 'app'), { recursive: true });
cpSync(join(root, 'screenshots'), join(output, 'screenshots'), { recursive: true });

// The scorer rebuilds this with its own copy of the library and compares bytes.
const dossier = buildDossier(output, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});

writeFileSync(join(output, 'dossier.json'), dossier);
console.log(`wrote ${join(output, 'dossier.json')} (${dossier.length} bytes)`);
