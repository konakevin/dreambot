import Animated from 'react-native-reanimated';
import { verticalScale, fontScale } from '@/lib/responsive';

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: fontScale(28),
        lineHeight: fontScale(32),
        marginTop: verticalScale(-6),
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}
    >
      👋
    </Animated.Text>
  );
}
