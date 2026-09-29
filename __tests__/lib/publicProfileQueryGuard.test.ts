/**
 * Guard: the ['publicProfile', id] query is defined in ONE place, hooks/usePublicProfile.ts
 * (publicProfileQueryOptions). A second definition of the same key with a different shape is
 * what made the Profile tab janky on first open (2026-09-28): the boot prefetch in
 * app/_layout.tsx cached the raw RPC row, the tab read `header` / `postCount` off it, flashed
 * the "Add a header" strip, then refetched and the banner pushed the page down.
 *
 * Fails CI when any other file fetches or writes that key with its own queryFn / data.
 * Invalidations (invalidateQueries / removeQueries) are fine.
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..', '..');
const DIRS = ['app', 'components', 'hooks', 'lib', 'store'];
const OWNER = path.join('hooks', 'usePublicProfile.ts');

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(full));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

describe("['publicProfile', id] has one definition", () => {
  const files = DIRS.flatMap((d) => sourceFiles(path.join(ROOT, d)));

  it('no other file defines a queryFn for it', () => {
    const offenders: string[] = [];
    for (const file of files) {
      if (path.relative(ROOT, file) === OWNER) continue;
      const src = fs.readFileSync(file, 'utf-8');
      // A query definition: the key followed closely by a queryFn in the same object.
      if (/queryKey:\s*\[\s*'publicProfile'[\s\S]{0,200}?queryFn\s*:/.test(src)) {
        offenders.push(path.relative(ROOT, file));
      }
    }
    expect(offenders).toEqual([]);
  });

  it('no other file writes it with setQueryData', () => {
    const offenders = files
      .filter((f) => path.relative(ROOT, f) !== OWNER)
      .filter((f) => /setQueryData[^(]*\(\s*\[\s*'publicProfile'/.test(fs.readFileSync(f, 'utf-8')))
      .map((f) => path.relative(ROOT, f));
    expect(offenders).toEqual([]);
  });

  it('the boot prefetch uses the shared definition', () => {
    const layout = fs.readFileSync(path.join(ROOT, 'app', '_layout.tsx'), 'utf-8');
    expect(layout).toMatch(/publicProfileQueryOptions\(/);
  });
});
