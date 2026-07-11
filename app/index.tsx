import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { StartupLogo } from '@/components/StartupLogo';

export default function Index() {
  const { session, user, initialized } = useAuthStore();
  const [hasRecipe, setHasRecipe] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setHasRecipe(null);
      return;
    }
    let cancelled = false;

    // Resolve onboarding state from users.has_ai_recipe. CRITICAL: a transient
    // read failure (network blip, 5xx, an auth-token refresh mid-request) must
    // NEVER route an established user into onboarding — re-running onboarding can
    // overwrite their Vibe Profile. The old code did `data?.has_ai_recipe ??
    // false` and ignored `error`, so any failed read → data null → false →
    // /(onboarding). A real user (sunnysteph, 2026-07-10) got dumped into
    // onboarding intermittently until an app restart happened to read cleanly.
    //
    // Only a CONFIRMED successful read flips hasRecipe (true → tabs, false →
    // onboarding). On error we retry with backoff; if every attempt fails we
    // leave it null (stay on the startup logo) rather than guess — a fresh app
    // open re-runs this cleanly.
    async function resolveRecipe() {
      for (let attempt = 0; attempt < 5 && !cancelled; attempt++) {
        const { data, error } = await supabase
          .from('users')
          .select('has_ai_recipe')
          .eq('id', user!.id)
          .single();
        if (cancelled) return;
        if (!error) {
          setHasRecipe(data?.has_ai_recipe ?? false);
          return;
        }
        // Transient failure — back off (200, 400, 800, 1600ms) and retry.
        await new Promise((r) => setTimeout(r, 200 * 2 ** attempt));
      }
    }
    void resolveRecipe();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Animated wordmark on black while we resolve where to route — hands off from
  // the native splash (static wordmark) instead of flashing a blank screen.
  if (!initialized) return <StartupLogo />;
  if (!session) return <Redirect href="/(auth)" />;
  if (hasRecipe === null) return <StartupLogo />; // loading / unresolved
  if (!hasRecipe) return <Redirect href="/(onboarding)" />;
  return <Redirect href="/(tabs)" />;
}
