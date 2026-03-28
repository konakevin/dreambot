import { Text } from 'react-native';
import type { TextStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

export type UserRank = 'LEGENDARY' | 'RAD' | 'SOLID' | 'MID' | 'BAD' | 'CURSED';

const RANK_META: Record<UserRank, { colors: string[]; glow: string }> = {
  LEGENDARY: { colors: ['#FFFFFF', '#FFE566', '#FFAA00'], glow: 'rgba(255,220,80,0.75)'  },
  RAD:       { colors: ['#AAFF55', '#44EE88'],            glow: 'rgba(100,255,100,0.65)' },
  SOLID:     { colors: ['#44CCFF', '#2277EE'],            glow: 'rgba(68,204,255,0.55)'  },
  MID:       { colors: ['#BBBBBB', '#888888'],            glow: 'rgba(170,170,170,0.4)'  },
  BAD:       { colors: ['#CC77FF', '#8833CC'],            glow: 'rgba(180,100,255,0.6)'  },
  CURSED:    { colors: ['#FF4444', '#BB0000'],            glow: 'rgba(255,60,60,0.65)'   },
};

interface GradientUsernameProps {
  username: string;
  rank: UserRank | string | null | undefined;
  style: TextStyle | (TextStyle | false | null | undefined)[];
  /** Pass true on the swipe card (over photos) to swap the black shadow for a rank-tinted glow */
  photoOverlay?: boolean;
}

export function GradientUsername({ username, rank, style, photoOverlay = false }: GradientUsernameProps) {
  const text = `@${username}`;
  const meta = rank ? RANK_META[rank as UserRank] : null;

  if (!meta) {
    // Unranked: subtle warm gray gradient so it looks intentional, not broken
    return (
      <MaskedView maskElement={<Text style={style}>{text}</Text>}>
        <LinearGradient
          colors={['#999999', '#666666']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[style, { opacity: 0 }]}>{text}</Text>
        </LinearGradient>
      </MaskedView>
    );
  }

  // On photo overlays, replace the dark shadow with a colored glow so ranked
  // names feel lit rather than just floating.
  const maskStyle = photoOverlay
    ? [style, { textShadowColor: meta.glow, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 16 }]
    : style;

  return (
    <MaskedView maskElement={<Text style={maskStyle}>{text}</Text>}>
      <LinearGradient
        colors={meta.colors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}
