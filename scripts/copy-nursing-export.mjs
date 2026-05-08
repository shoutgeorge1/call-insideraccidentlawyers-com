import { cpSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const out = join(root, 'nursing-home-chat-web', 'out');

if (!existsSync(out)) {
  console.error(
    'Missing nursing-home-chat-web/out. Run `npm run build` inside nursing-home-chat-web first.'
  );
  process.exit(1);
}

function copyIntoRoot(name) {
  const src = join(out, name);
  const dest = join(root, name);
  if (!existsSync(src)) {
    console.error('Expected path not found:', src);
    process.exit(1);
  }
  cpSync(src, dest, { recursive: true });
  console.log('Copied to repo root:', name);
}

copyIntoRoot('_next');
copyIntoRoot('nursing-home-chat-check');
copyIntoRoot('injury-help');
