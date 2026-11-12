/**
 * Vercel-only frontend build.
 * - Ensures .env files exist for dotenvx (Vercel env vars still win)
 * - Generates Prisma client (gitignored)
 * - Builds @onlyjs/web without building @onlyjs/api
 */
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');

const ensureEnv = (exampleRel: string, targetRel: string) => {
  const example = resolve(root, exampleRel);
  const target = resolve(root, targetRel);
  if (!existsSync(target) && existsSync(example)) {
    copyFileSync(example, target);
    console.info(`Created ${targetRel} from example`);
  }
};

ensureEnv('config/apps/web/.env.example', 'config/apps/web/.env');
ensureEnv('config/apps/api/.env.example', 'config/apps/api/.env');

const generate = Bun.spawn({
  cmd: ['bun', 'run', 'generate'],
  cwd: resolve(root, 'packages/database'),
  stdout: 'inherit',
  stderr: 'inherit',
});
if ((await generate.exited) !== 0) {
  process.exit(1);
}

// --only: do not build workspace deps (@onlyjs/api)
const build = Bun.spawn({
  cmd: ['bun', 'x', 'turbo', 'run', 'build', '--filter=@onlyjs/web', '--only'],
  cwd: root,
  stdout: 'inherit',
  stderr: 'inherit',
});
process.exit(await build.exited);
