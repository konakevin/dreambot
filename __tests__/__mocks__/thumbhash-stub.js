/**
 * Jest stub for the Deno URL import `https://esm.sh/thumbhash@0.1.1`.
 * thumbhashGen.ts (transitively imported by persistence.ts) pulls this
 * pure-JS hash library at module load. No jest test exercises the
 * thumbhash path, so the stub just satisfies module resolution and
 * throws loudly if ever called.
 */
module.exports = {
  __esModule: true,
  rgbaToThumbHash: () => {
    throw new Error('thumbhash is stubbed in tests and must not be called');
  },
};
