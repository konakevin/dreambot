/**
 * LIVE-DB test for text_is_blocked() (migration 276) — the SERVER-SIDE mirror of
 * lib/moderation.ts. Must match the client matcher: lowercase → strip non
 * [a-z space] → whole-word match for single tokens (so "raccoon" does NOT match
 * "coon"), flexible-whitespace substring for phrases ("kill   yourself").
 *
 * Loads the real table + seed + function DDL from the migration file.
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();

async function blocked(text: string | null): Promise<boolean> {
  const res = await pool.query<{ b: boolean }>('SELECT public.text_is_blocked($1) AS b', [text]);
  return res.rows[0].b;
}

beforeAll(async () => {
  const sql = migrationSql('276_server_moderation.sql');
  const table = extract(sql, 'CREATE TABLE IF NOT EXISTS public.moderation_words', '\n);');
  const seed = extract(sql, 'INSERT INTO public.moderation_words', 'DO NOTHING;');
  const fn = extract(sql, 'CREATE OR REPLACE FUNCTION public.text_is_blocked', '$$;');

  await pool.query('DROP TABLE IF EXISTS public.moderation_words CASCADE');
  await pool.query(table);
  await pool.query(seed);
  await pool.query(fn);
});

afterAll(async () => {
  await pool.end();
});

it('blocks slurs (whole word, case/punctuation-insensitive)', async () => {
  expect(await blocked('you faggot')).toBe(true);
  expect(await blocked('FAGGOT')).toBe(true);
  expect(await blocked('you f.a.g.g.o.t')).toBe(false); // letters split apart don't normalize back
  expect(await blocked('what a chink')).toBe(true);
  expect(await blocked('kike!')).toBe(true);
});

it('blocks phrases with flexible whitespace', async () => {
  expect(await blocked('just kill yourself')).toBe(true);
  expect(await blocked('kill    yourself now')).toBe(true);
  expect(await blocked('go die')).toBe(true);
});

it('does NOT block clean text or substrings inside real words (word boundary)', async () => {
  expect(await blocked('a raccoon in the yard')).toBe(false); // "coon" inside raccoon
  expect(await blocked('a beautiful sunset')).toBe(false);
  expect(await blocked('this is great')).toBe(false);
  expect(await blocked('fuck this shit')).toBe(false); // normal profanity is allowed
});

it('passes empty / whitespace / null', async () => {
  expect(await blocked('')).toBe(false);
  expect(await blocked('   ')).toBe(false);
  expect(await blocked(null)).toBe(false);
});
