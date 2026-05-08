import { Redirect, useLocalSearchParams } from 'expo-router';

/**
 * Legacy / share-link route alias. Shared post URLs use the format
 *   https://dreambotapp.com/post/{id}
 * (matched by the apple-app-site-association file in dreambot-web). The actual
 * post screen lives at /photo/[id], so this file forwards Universal Link cold
 * starts to the real route. Without it, Expo Router shows "unmatched route"
 * because no file matches /post/[id] even though the Linking event handler
 * inside _layout.tsx successfully parses the URL.
 */
export default function PostRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return <Redirect href="/(tabs)" />;
  return <Redirect href={`/photo/${id}`} />;
}
