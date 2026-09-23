import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { NavigationContext } from '@react-navigation/native';

const ReducedMotionContext = createContext(true);
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => {
        if (active) {
          setReduced(value);
        }
      })
      .catch(() => undefined);
    const listener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced,
    );
    return () => {
      active = false;
      listener.remove();
    };
  }, []);
  return (
    <ReducedMotionContext.Provider value={reduced}>
      {children}
    </ReducedMotionContext.Provider>
  );
}
export function Entrance({
  children,
  style,
  delay = 0,
  direction = 'up',
  replayKey,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
  direction?: 'up' | 'down' | 'right';
  replayKey?: string | number;
}) {
  const progress = useRef(new Animated.Value(1)).current;
  const reduced = useContext(ReducedMotionContext);
  const navigation = useContext(NavigationContext);
  useEffect(() => {
    const play = () => {
      progress.stopAnimation();
      if (reduced) {
        progress.setValue(1);
        return;
      }
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 420,
        delay: Math.min(delay, 240),
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    };
    play();
    const unsubscribe = navigation?.addListener('focus', play);
    return () => {
      unsubscribe?.();
      progress.stopAnimation();
    };
  }, [delay, navigation, progress, reduced, replayKey]);
  const offset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [direction === 'down' ? -20 : 24, 0],
  });
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform:
            direction === 'right'
              ? [{ translateX: offset }]
              : [{ translateY: offset }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
