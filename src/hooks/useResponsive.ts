import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useResponsive() {
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const availableWidth = width - insets.left - insets.right;
  const compact = availableWidth <= 375;
  const stacked = compact || fontScale > 1.25;
  const spacing = compact ? 14 : 20;
  return {
    compact,
    stacked,
    short: height < 700,
    spacing,
    contentWidth: Math.min(640, availableWidth) - spacing * 2,
    availableHeight: height - insets.top - insets.bottom,
    contentStyle: {
      padding: spacing,
      paddingBottom: 28 + insets.bottom,
      gap: compact ? 16 : 20,
    },
  };
}
