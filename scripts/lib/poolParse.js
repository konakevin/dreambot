/**
 * Parse the classic pool TS files' literal arrays/records from source —
 * seeders + the parity verifier both read FROM THE CODE (never retyped), so
 * DB content is byte-identical to the arrays by construction (invariant I2).
 */
const fs = require('fs');

/** Extract the string entries of `export const NAME: ... = [ '...' , ... ];` */
function parseStringArray(file, name) {
  const src = fs.readFileSync(file, 'utf8');
  const start = src.indexOf(`export const ${name}`);
  if (start < 0) throw new Error(`${name} not found in ${file}`);
  // seek past the '=' so the '[' in a `: string[]` TYPE annotation is skipped
  const eq = src.indexOf('=', start);
  const open = src.indexOf('[', eq);
  // find the matching closing bracket at depth 0
  let depth = 0;
  let end = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const body = src.slice(open + 1, end);
  const out = [];
  const re = /'((?:[^'\\]|\\.)*)'/g;
  let m;
  while ((m = re.exec(body))) out.push(m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
  return out;
}

/** Extract a Record<string,string[]> literal: { key: [ '...', ... ], ... } */
function parseRecord(file, name) {
  const src = fs.readFileSync(file, 'utf8');
  const start = src.indexOf(`export const ${name}`);
  if (start < 0) throw new Error(`${name} not found in ${file}`);
  const open = src.indexOf('{', start);
  let depth = 0;
  let end = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const body = src.slice(open + 1, end);
  const out = {};
  const keyRe = /(?:^|\n)\s*'?([a-z_ ]+)'?:\s*\[/g;
  let m;
  const keys = [];
  while ((m = keyRe.exec(body))) keys.push({ key: m[1], idx: m.index + m[0].length });
  for (let k = 0; k < keys.length; k++) {
    const seg = body.slice(keys[k].idx, k + 1 < keys.length ? keys[k + 1].idx : undefined);
    // entries up to the array's closing bracket (first unmatched ])
    let depth2 = 1;
    let stop = seg.length;
    for (let i = 0; i < seg.length; i++) {
      if (seg[i] === '[') depth2++;
      else if (seg[i] === ']') {
        depth2--;
        if (depth2 === 0) {
          stop = i;
          break;
        }
      }
    }
    const entries = [];
    const re = /'((?:[^'\\]|\\.)*)'/g;
    let mm;
    const inner = seg.slice(0, stop);
    while ((mm = re.exec(inner))) entries.push(mm[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
    out[keys[k].key] = entries;
  }
  return out;
}

const norm = (t) => t.toLowerCase().replace(/\s+/g, ' ').trim();

module.exports = { parseStringArray, parseRecord, norm };
