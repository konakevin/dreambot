/**
 * Jest mock for the Deno URL import `https://esm.sh/@supabase/supabase-js@2`.
 * modelPicker.ts imports createClient from this URL — in Jest we stub it out
 * so the DB cache refresh silently no-ops (the try/catch in getPreferredModel
 * swallows the error and falls through to code-based routing).
 */
module.exports = {
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => Promise.resolve({ data: null }),
      }),
    }),
  }),
};
