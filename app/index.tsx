import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth';

export default function Index() {
  const { session, initialized } = useAuthStore();

  if (!initialized) return null;

  return <Redirect href={session ? '/(tabs)' : '/(auth)'} />;
}
