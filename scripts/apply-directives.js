/**
 * Apply Sonnet-generated directives to constants/dreamEngine.ts
 * and supabase/functions/_shared/dreamEngine.ts
 */
const fs = require('fs');

const results = fs.readFileSync(
  '/Users/kevinmchenry/.claude/projects/-Users-kevinmchenry-Development-apps-dreambot/fe0e36c0-7802-48f3-8c0c-b5a806da58e3/tool-results/bwi7j4f62.txt',
  'utf8'
).trim().split('\n').map(l => JSON.parse(l));

function updateFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  let updated = 0;

  for (const r of results) {
    if (r.key === 'anime') continue; // already updated
    if (!r.directive || !r.fluxFragment) continue;

    // Escape quotes in the directive and fragment for use in source
    const escDir = r.directive.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const escFrag = r.fluxFragment.replace(/'/g, "\\'").replace(/"/g, '\\"');

    // Match the key block and replace directive + fluxFragment
    // Pattern: key: 'xxx', \n    label: 'Yyy',\n    directive:\n      '...' or "...",\n    fluxFragment:\n      '...' or "...",
    const keyRegex = new RegExp(
      `(key: '${r.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',\\n\\s+label: '[^']*',\\n\\s+directive:\\n\\s+)[\\s\\S]*?(,\\n\\s+fluxFragment:\\n\\s+)[\\s\\S]*?(,\\n\\s+\\})`,
    );

    if (keyRegex.test(src)) {
      src = src.replace(keyRegex, `$1\n      '${escDir}'$2\n      '${escFrag}'$3`);
      updated++;
    } else {
      console.log(`  MISS: ${r.key}`);
    }
  }

  fs.writeFileSync(filePath, src);
  console.log(`Updated ${updated} mediums in ${filePath}`);
}

updateFile('constants/dreamEngine.ts');
updateFile('supabase/functions/_shared/dreamEngine.ts');
