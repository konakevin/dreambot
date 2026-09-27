/**
 * Read the LATEST migration's definition of a Postgres function, for guard tests that lock
 * a function's shape across future migrations (a later file redefining it is what counts).
 */
import * as fs from 'fs';
import * as path from 'path';

const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'supabase', 'migrations');

/** Numeric-then-suffix sort key so 557 < 557a < 558 (the repo's NNN / NNNa prefix scheme). */
function prefixKey(file: string): [number, string] {
  const m = file.match(/^(\d{3})([a-z]?)_/);
  return m ? [Number(m[1]), m[2]] : [-1, ''];
}

/** The body of the LATEST migration's definition of `fn` (from its CREATE to the closing $$). */
export function latestFunctionBody(fn: string): { file: string; body: string } {
  const defines = new RegExp(
    `CREATE(?:\\s+OR\\s+REPLACE)?\\s+FUNCTION\\s+public\\.${fn}\\s*\\(`,
    'i'
  );
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort((a, b) => {
      const [na, sa] = prefixKey(a);
      const [nb, sb] = prefixKey(b);
      return na - nb || sa.localeCompare(sb);
    });
  let latest: { file: string; body: string } | null = null;
  for (const file of files) {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
    const m = defines.exec(sql);
    if (!m) continue;
    const rest = sql.slice(m.index);
    const open = rest.indexOf('$$');
    const close = rest.indexOf('$$', open + 2);
    latest = { file, body: rest.slice(0, close + 2) };
  }
  if (!latest) throw new Error(`no migration defines public.${fn}`);
  return latest;
}
