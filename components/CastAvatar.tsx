/**
 * CastAvatar — one cast member's face, resolved from the PRIVATE cast-photos bucket.
 *
 * Shared by the Create screen's cast chip and its picker sheet so a face cannot look
 * like two different people in two places. Renders an empty ring while the signed URL
 * resolves, and keeps that ring if it fails: a missing photo must never blank the row
 * it sits in, because the name beside it is still the answer the user came for.
 */

import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { castSignedUrl, cachedCastUrl } from '@/lib/castPhoto';
import { colors } from '@/constants/theme';

export interface CastAvatarMember {
  storage_path?: string;
  thumb_url?: string;
}

export function CastAvatar({
  member,
  size,
  overlap,
}: {
  member: CastAvatarMember;
  size: number;
  /** Pulls this avatar left over the previous one, so a pair reads as one group
   *  rather than two separate badges. */
  overlap?: boolean;
}) {
  // Seeded from the cache SYNCHRONOUSLY, so a face already resolved this session paints
  // on the very first frame. This avatar mounts the instant a typed name resolves to
  // someone, and an effect-only resolve meant the ring appeared first and the face a
  // beat later — the lag was the mint and the download, but the empty ring is what made
  // it look like the app had not noticed the name yet.
  const [uri, setUri] = useState<string | null>(() =>
    member.storage_path
      ? cachedCastUrl(member.storage_path)
      : member.thumb_url?.startsWith('http')
        ? member.thumb_url
        : null
  );
  useEffect(() => {
    let alive = true;
    (async () => {
      if (member.storage_path) {
        const signed = await castSignedUrl(member.storage_path);
        if (alive) setUri(signed);
      } else if (member.thumb_url?.startsWith('http')) {
        setUri(member.thumb_url);
      }
    })();
    return () => {
      alive = false;
    };
  }, [member.storage_path, member.thumb_url]);

  return (
    <Image
      source={uri ? { uri } : undefined}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.surface,
          // A ring in the page's own background colour is what separates two
          // overlapping faces; without it they read as one smeared shape.
          borderWidth: 1.5,
          borderColor: colors.background,
        },
        overlap ? { marginLeft: -size * 0.28 } : null,
      ]}
      contentFit="cover"
    />
  );
}
