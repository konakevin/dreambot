#!/usr/bin/env python3
"""Build a render-picker page (see SKILL.md) from a manifest.

    python3 .claude/skills/render-picker/build.py <manifest.json> <outdir>

Downloads (or copies) every item's image, resizes it to 560px wide with
ImageMagick, measures the REAL aspect ratio (never trust uploads.width/height),
embeds the data into template.html and writes:

    <outdir>/index.html        the page to publish (Artifact file_path)
    <outdir>/img/<group>/<n>.jpg, <outdir>/av/<group>.jpg
    <outdir>/files.json        every supporting file, for a FIRST publish
    <outdir>/files-new.json    only files this run created, for a republish
                               (files not passed on a republish are kept)

Re-running with a bigger manifest only fetches what is missing, so a
re-roll is: append items, rebuild, republish with files-new.json.
"""
import json, os, shutil, subprocess, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
WIDTH = 560


def fetch(src, dest):
    """URL or local path -> dest. Supabase storage throttles bursts, so retry."""
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return True
    tmp = dest + '.part'
    for attempt in range(5):
        try:
            if src.startswith('http'):
                with urllib.request.urlopen(src, timeout=30) as r, open(tmp, 'wb') as f:
                    shutil.copyfileobj(r, f)
            else:
                shutil.copyfile(os.path.expanduser(src), tmp)
            if os.path.getsize(tmp) > 0:
                os.replace(tmp, dest)
                return True
        except Exception:
            time.sleep(1.5 * (attempt + 1))
    return False


def dims(path):
    out = subprocess.check_output(['magick', 'identify', '-format', '%w %h', path + '[0]'], text=True)
    w, h = out.split()
    return int(w), int(h)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    manifest_path, out = sys.argv[1], sys.argv[2]
    M = json.load(open(manifest_path))
    raw = os.path.join(out, '.raw')
    os.makedirs(raw, exist_ok=True)
    before = set()
    for root, _, files in os.walk(out):
        if '.raw' in root:
            continue
        for f in files:
            before.add(os.path.relpath(os.path.join(root, f), out))

    jobs = []  # (src, raw_path, out_rel, kind, item)
    by_src, aliases = {}, []
    for g in M['groups']:
        gk = g['key']
        os.makedirs(os.path.join(out, 'img', gk), exist_ok=True)
        if g.get('avatarSrc'):
            os.makedirs(os.path.join(out, 'av'), exist_ok=True)
            jobs.append((g['avatarSrc'], os.path.join(raw, f'av_{gk}'), f'av/{gk}.jpg', 'av', g))
        seen = set()
        for it in g['items']:
            if it['n'] in seen:
                sys.exit(f'duplicate n={it["n"]} in group {gk}: numbers must be unique per group')
            seen.add(it['n'])
            if it['src'] in by_src:          # same image reused (e.g. text options over one header): one file
                aliases.append((it, by_src[it['src']]))
                continue
            by_src[it['src']] = it
            jobs.append((it['src'], os.path.join(raw, f'{gk}_{it["n"]}'), f'img/{gk}/{it["n"]}.jpg', 'img', it))

    with ThreadPoolExecutor(max_workers=6) as ex:
        ok = list(ex.map(lambda j: fetch(j[0], j[1]), jobs))
    failed = [j[2] for j, good in zip(jobs, ok) if not good]

    for (src, rawp, rel, kind, obj), good in zip(jobs, ok):
        if not good:
            continue
        dest = os.path.join(out, rel)
        if kind == 'av':
            if not os.path.exists(dest):
                subprocess.check_call(['magick', rawp, '-resize', '112x112^', '-gravity', 'center', '-extent', '112x112', '-strip', '-quality', '74', dest])
            obj['avatar'] = rel
        else:
            w, h = dims(rawp)
            obj['ar'] = round(h / w, 4)
            obj['srcSize'] = f'{w}x{h}'
            if not os.path.exists(dest):
                subprocess.check_call(['magick', rawp, '-resize', f'{WIDTH}x', '-strip', '-quality', '72', '-sampling-factor', '4:2:0', dest])
            obj['img'] = rel

    for it, first in aliases:
        for k in ('img', 'ar', 'srcSize'):
            if k in first:
                it[k] = first[k]

    for g in M['groups']:
        g['items'] = [it for it in g['items'] if it.get('img')]
        g.pop('avatarSrc', None)

    tpl = open(os.path.join(HERE, 'template.html')).read()
    data = json.dumps(M).replace('</', '<\\/')
    title = (M.get('title') or 'Render Picker').replace('<', '')
    open(os.path.join(out, 'index.html'), 'w').write(tpl.replace('{{TITLE}}', title).replace('/*PICKERDATA*/', data))

    files = []
    for root, _, fs in os.walk(out):
        if '.raw' in root:
            continue
        for f in fs:
            rel = os.path.relpath(os.path.join(root, f), out)
            if rel.endswith('.jpg'):
                files.append(rel)
    files.sort()
    json.dump([{'path': p} for p in files], open(os.path.join(out, 'files.json'), 'w'))
    new = [p for p in files if p not in before]
    json.dump([{'path': p} for p in new], open(os.path.join(out, 'files-new.json'), 'w'))

    n_items = sum(len(g['items']) for g in M['groups'])
    sizes = sorted({it['srcSize'] for g in M['groups'] for it in g['items']})
    print(f'built {out}/index.html: {len(M["groups"])} groups, {n_items} items, mode={M.get("mode", "pick")}, frame={M.get("frame", "full")}')
    print(f'image sizes seen: {", ".join(sizes)}')
    print(f'files.json: {len(files)} files | files-new.json: {len(new)} new')
    if failed:
        print(f'FAILED to fetch {len(failed)} (left out of the page): {failed[:8]}')


if __name__ == '__main__':
    main()
