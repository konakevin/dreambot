/**
 * LIVE-DB test for the shortened invite code (migration 423): dream_off_gen_invite_code
 * now returns a 6-char code from the unambiguous alphabet.
 */

import { Pool, PoolClient } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();
let db: PoolClient;

beforeAll(async () => {
  db = await pool.connect();
  await db.query('DROP TABLE IF EXISTS public.dream_offs CASCADE');
  await db.query('DROP TABLE IF EXISTS public.users CASCADE');
  await db.query('CREATE TABLE public.users (id uuid PRIMARY KEY)');
  const m400 = migrationSql('400_dream_off_core_schema.sql');
  await db.query(extract(m400, 'CREATE TABLE IF NOT EXISTS public.dream_offs (', ');'));
  const m423 = migrationSql('423_dream_off_shorter_invite_code.sql');
  await db.query(
    extract(m423, 'CREATE OR REPLACE FUNCTION public.dream_off_gen_invite_code()', '$$;')
  );
});

afterAll(async () => {
  db.release();
  await pool.end();
});

describe('dream_off_gen_invite_code (migration 423)', () => {
  it('returns a 6-char code from the unambiguous alphabet', async () => {
    for (let i = 0; i < 20; i++) {
      const { rows } = await db.query('SELECT public.dream_off_gen_invite_code() AS c');
      const code = rows[0].c as string;
      expect(code).toHaveLength(6);
      expect(code).toMatch(/^[ABCDEFGHJKMNPQRSTVWXYZ23456789]{6}$/);
    }
  });
});
