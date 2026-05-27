/**
 * Jest stub for the Deno URL imports `https://esm.sh/@jsquash/jpeg@1.5.0/{decode,encode}`.
 * imageCodec.ts (transitively imported by persistence.ts) pulls these WASM codec
 * libs at module load. No jest test exercises the decode/encode path, so the
 * stub just satisfies module resolution and throws loudly if ever called.
 */
module.exports = {
  __esModule: true,
  default: () => {
    throw new Error('jsquash codec is stubbed in tests and must not be called');
  },
};
