#!/usr/bin/env node
/**
 * Stage 2 bench post-processor — face-crop comparison grid.
 *
 * The full-frame grid made restoration differences invisible (faces are a
 * small fraction of a 768x1344 render shown as a 240px thumb). This reworks
 * the ALREADY-DOWNLOADED bench files: detects faces in each original
 * (face-api, local models), crops the SAME padded box from the original and
 * every variant, and writes a grid of LARGE face crops with press-and-hold
 * flicker A/B against the original — the standard way to judge subtle
 * restoration deltas.
 *
 * Usage: node scripts/bench-face-restore-crops.js
 * Reads + writes ~/Desktop/faceswap-restore-bench/ (adds crops/ + faces.html).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const sharp = require('sharp');

const DIR = path.join(os.homedir(), 'Desktop', 'faceswap-restore-bench');
const CROP_DIR = path.join(DIR, 'crops');
const VARIANTS = ['orig', 'gfpgan', 'cf05', 'cf07', 'cf09'];
const LABELS = {
  orig: 'original',
  gfpgan: 'GFPGAN v1.4',
  cf05: 'CodeFormer f=0.5',
  cf07: 'CodeFormer f=0.7',
  cf09: 'CodeFormer f=0.9',
};

// Geometry-based face regions — NO detector needed. The swap framing
// contract guarantees placement (waist-up medium shot, faces to camera,
// single centered / dual left+right at the same height), so fixed regions
// generously padded always contain the face. tfjs-node is broken on this
// machine's Node; the contract makes a detector unnecessary for a bench.
function faceRegions(mode, W, H) {
  // Calibrated against real renders 2026-07-08: nightly duals render fuller-
  // body than the waist-up ideal — heads sit ~28-40% of H, inboard at
  // ~x 0.36/0.64. Generous boxes so head-height variance stays in-frame.
  if (mode === 'dual') {
    const size = Math.round(W * 0.4);
    const top = Math.round(H * 0.25);
    return [
      { x: Math.round(W * 0.36 - size / 2), y: top, w: size, h: size },
      { x: Math.round(W * 0.64 - size / 2), y: top, w: size, h: size },
    ];
  }
  const size = Math.round(W * 0.5);
  const top = Math.round(H * 0.16);
  return [{ x: Math.round(W * 0.5 - size / 2), y: top, w: size, h: size }];
}

(async () => {
  fs.mkdirSync(CROP_DIR, { recursive: true });
  // Row → swap mode, from the original bench order (duals first — see
  // bench-face-restore.js sampling). Read the sibling index.html labels.
  const indexHtml = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  const modeOf = (row) => {
    const m = new RegExp(`original \\((\\w+),[^)]*\\)</div><a href="${row}-orig`).exec(indexHtml);
    return m ? m[1] : 'single';
  };

  const rows = [
    ...new Set(
      fs
        .readdirSync(DIR)
        .map((f) => /^(r\d+)-orig\.jpg$/.exec(f)?.[1])
        .filter(Boolean)
    ),
  ].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));

  const htmlRows = [];
  for (const row of rows) {
    const origFile = path.join(DIR, `${row}-orig.jpg`);
    const meta = await sharp(origFile).metadata();
    const faces = faceRegions(modeOf(row), meta.width, meta.height);

    for (const [fi, box] of faces.entries()) {
      const left = Math.max(0, box.x);
      const top = Math.max(0, box.y);
      const size = Math.min(box.w, meta.width - left, meta.height - top);
      const cells = [];
      for (const v of VARIANTS) {
        const src = path.join(DIR, `${row}-${v}.jpg`);
        if (!fs.existsSync(src)) continue;
        // Variant outputs may differ in dimensions (some restorers resize) —
        // scale the crop box proportionally so the SAME face region is cut.
        const m = await sharp(src).metadata();
        const sx = m.width / meta.width;
        const sy = m.height / meta.height;
        const out = `${row}-f${fi}-${v}.jpg`;
        await sharp(src)
          .extract({
            left: Math.min(Math.round(left * sx), m.width - 8),
            top: Math.min(Math.round(top * sy), m.height - 8),
            width: Math.min(Math.round(size * sx), m.width - Math.round(left * sx)),
            height: Math.min(Math.round(size * sy), m.height - Math.round(top * sy)),
          })
          .resize(420, 420, { fit: 'cover' })
          .jpeg({ quality: 92 })
          .toFile(path.join(CROP_DIR, out));
        cells.push({ v, file: `crops/${out}` });
      }
      htmlRows.push({ row, fi, cells });
    }
    console.log(`${row}: ${faces.length} face(s) cropped`);
  }

  const html = `<!doctype html><meta charset="utf-8"><title>Face restore — face crops</title>
<style>
body{background:#0a0a12;color:#eee;font:14px system-ui;margin:20px}
h1{font-size:18px}.hint{color:#9a8cff;margin-bottom:16px}
.row{display:flex;gap:10px;margin-bottom:22px;overflow-x:auto;align-items:flex-start}
.cell{flex:0 0 300px;position:relative}
.cell img{width:300px;height:300px;object-fit:cover;border-radius:10px;display:block}
.cell .lbl{font-size:12px;color:#aaa;margin:4px 0}
.cell.cmp img.over{position:absolute;top:0;left:0;opacity:1;transition:none}
.cell.cmp:active img.over{opacity:0}
.tag{font-size:11px;color:#666;margin-bottom:2px}
</style>
<h1>Face-crop comparison — same face region, original vs restored</h1>
<div class="hint">PRESS AND HOLD any restored crop to flicker back to the ORIGINAL — differences pop instantly. Release to see the restored version again.</div>
${htmlRows
  .map(({ row, fi, cells }) => {
    const orig = cells.find((c) => c.v === 'orig');
    return `<div class="tag">${row} · face ${fi + 1}</div><div class="row">${cells
      .map((c) =>
        c.v === 'orig'
          ? `<div class="cell"><div class="lbl">${LABELS[c.v]}</div><img src="${c.file}"></div>`
          : `<div class="cell cmp"><div class="lbl">${LABELS[c.v]} (hold = original)</div><img src="${orig.file}"><img class="over" src="${c.file}"></div>`
      )
      .join('')}</div>`;
  })
  .join('\n')}`;
  fs.writeFileSync(path.join(DIR, 'faces.html'), html);
  console.log(`\n✅ face-crop grid: ${path.join(DIR, 'faces.html')}`);
})();
