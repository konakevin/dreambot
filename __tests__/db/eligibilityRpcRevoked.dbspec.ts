/**
 * LIVE-DB test for the eligibility-RPC PUBLIC revoke (migration 324).
 *
 * is_pro_active / is_basic_active / is_dream_eligible read another user's
 * Pro/Basic/admin state. Postgres grants EXECUTE to PUBLIC by default, so a
 * plain `REVOKE ... FROM anon, authenticated` (migration 323) was NOT enough —
 * the implicit PUBLIC grant meant the anon key could still call them and probe
 * any user's entitlement. Migration 324 revokes from PUBLIC and re-grants only
 * to service_role. This locks that ACL: if a future migration drops the
 * REVOKE-from-PUBLIC (or re-grants to anon/authenticated), the assertions fail
 * instead of silently re-opening the probe (Architect audit A6, 2026-07-10,
 * promoting the grep-only content lock).
 *
 * We stub the three functions with the real SIGNATURES (the ACL is a property
 * of the grants, not the body) and apply the REAL REVOKE/GRANT block loaded
 * from migration 324 — so a drift in that SQL fails loudly.
 */

import { Pool } from 'pg';
import { makePool, migrationSql, extract } from './_support/pg';

const pool: Pool = makePool();

const FNS = ['is_pro_active', 'is_basic_active', 'is_dream_eligible'] as const;

async function canExecute(role: string, fn: string): Promise<boolean> {
  const res = await pool.query<{ ok: boolean }>(
    `SELECT has_function_privilege($1, 'public.${fn}(uuid)', 'EXECUTE') AS ok`,
    [role]
  );
  return res.rows[0].ok;
}

beforeAll(async () => {
  // Supabase roles a vanilla PG lacks — create them so the grants resolve.
  for (const role of ['anon', 'authenticated', 'service_role']) {
    await pool.query(
      `DO $$ BEGIN
         IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${role}') THEN
           CREATE ROLE ${role} NOLOGIN;
         END IF;
       END $$;`
    );
  }

  // Stub the three functions with the production signatures. `CREATE FUNCTION`
  // grants EXECUTE to PUBLIC by default — exactly the pre-324 state we then fix.
  for (const fn of FNS) {
    await pool.query(`DROP FUNCTION IF EXISTS public.${fn}(uuid)`);
    await pool.query(
      `CREATE FUNCTION public.${fn}(p_user_id uuid) RETURNS boolean
         LANGUAGE sql AS 'SELECT true'`
    );
  }

  // Apply the REAL grant block from migration 324 (loaded, not hand-copied).
  const grantBlock = extract(
    migrationSql('324_eligibility_rpc_revoke_public.sql'),
    'REVOKE EXECUTE ON FUNCTION public.is_pro_active(uuid) FROM PUBLIC;',
    'GRANT EXECUTE ON FUNCTION public.is_dream_eligible(uuid) TO service_role;'
  );
  await pool.query(grantBlock);
});

afterAll(async () => {
  await pool.end();
});

test('anon + authenticated CANNOT execute the eligibility RPCs', async () => {
  for (const fn of FNS) {
    expect(await canExecute('anon', fn)).toBe(false);
    expect(await canExecute('authenticated', fn)).toBe(false);
  }
});

test('service_role CAN execute them (edge fns / crons need it)', async () => {
  for (const fn of FNS) {
    expect(await canExecute('service_role', fn)).toBe(true);
  }
});
