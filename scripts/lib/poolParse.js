/**
 * Parse the classic pool TS files' literal arrays/records from source —
 * seeders + the parity verifier both read FROM THE CODE (never retyped), so
 * DB content is byte-identical to the arrays by construction (invariant I2).
 */
const fs = require('fs');

/**
 * Unescape a JS/TS string literal body (the chars BETWEEN the quotes) into its
 * runtime value. Handles the escapes that appear in the pool arrays: \' \" \`
 * \\ \n \t \r plus a passthrough for any other \x (drop the backslash).
 */
function unescapeLiteral(body) {
  let out = '';
  for (let i = 0; i < body.length; i++) {
    if (body[i] === '\\' && i + 1 < body.length) {
      const next = body[i + 1];
      if (next === 'n') out += '\n';
      else if (next === 't') out += '\t';
      else if (next === 'r') out += '\r';
      else out += next; // \' \" \` \\ and anything else → the literal char
      i++;
    } else {
      out += body[i];
    }
  }
  return out;
}

/**
 * Tokenize a TS array-literal BODY into its string entries. Walks the source
 * char-by-char so a string is read from its opening quote to its matching
 * UNESCAPED closing quote of the SAME kind — apostrophes inside a double-quoted
 * entry (e.g. "arm's length") are just content and can never desync the scan.
 * Recognizes ' " and ` literals; skips // line and block comments and all
 * whitespace/commas between entries.
 *
 * (Replaces the old single-quote-only regex, whose quote-pairing desynced on
 * the first double-quoted apostrophe entry and captured every following ",\n  "
 * delimiter as a bogus entry — the corruption root-caused 2026-08-27.)
 */
function tokenizeStringArray(body) {
  const out = [];
  let i = 0;
  const n = body.length;
  while (i < n) {
    const c = body[i];
    if (c === '/' && body[i + 1] === '/') {
      const nl = body.indexOf('\n', i);
      i = nl < 0 ? n : nl + 1;
      continue;
    }
    if (c === '/' && body[i + 1] === '*') {
      const e = body.indexOf('*/', i);
      i = e < 0 ? n : e + 2;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      i++;
      let lit = '';
      while (i < n) {
        const ch = body[i];
        if (ch === '\\') {
          lit += ch + (i + 1 < n ? body[i + 1] : '');
          i += 2;
          continue;
        }
        if (ch === quote) {
          i++;
          break;
        }
        lit += ch;
        i++;
      }
      out.push(unescapeLiteral(lit));
      continue;
    }
    i++;
  }
  return out;
}

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
  return tokenizeStringArray(body);
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
    out[keys[k].key] = tokenizeStringArray(seg.slice(0, stop));
  }
  return out;
}

const norm = (t) => t.toLowerCase().replace(/\s+/g, ' ').trim();

module.exports = {
  parseStringArray,
  parseRecord,
  norm,
  tokenizeStringArray,
  unescapeLiteral,
};
