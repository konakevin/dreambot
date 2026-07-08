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
    supabase
      .from('users')
      .select('has_ai_recipe')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setHasRecipe(data?.has_ai_recipe ?? false);
      });
  }, [user]);

  // Animated wordmark on black while we resolve where to route — hands off from
  // the native splash (static wordmark) instead of flashing a blank screen.
  if (!initialized) return <StartupLogo />;
  if (!session) return <Redirect href="/(auth)" />;
  if (hasRecipe === null) return <StartupLogo />; // loading
  if (!hasRecipe) return <Redirect href="/(onboarding)" />;
  return <Redirect href="/(tabs)" />;
}
