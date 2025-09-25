import React, { useMemo } from 'react';
import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;
const PARALLAX_FACTOR = 0.75;
const SCALE_FACTOR = 2;

interface ParallaxScrollViewProps extends PropsWithChildren {
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}

const ParallaxScrollView = React.memo(({
  children,
  headerImage,
  headerBackgroundColor,
}: ParallaxScrollViewProps) => {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * PARALLAX_FACTOR]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [SCALE_FACTOR, 1, 1]
          ),
        },
      ],
    };
  }, []);

  const scrollViewStyle = useMemo(
    () => ({ backgroundColor, flex: 1 }),
    [backgroundColor]
  );

  const headerStyle = useMemo(
    () => [
      styles.header,
      { backgroundColor: headerBackgroundColor[colorScheme] },
      headerAnimatedStyle,
    ],
    [headerBackgroundColor, colorScheme, headerAnimatedStyle]
  );

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={scrollViewStyle}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Animated.View
        style={headerStyle}
        accessible={false}
      >
        {headerImage}
      </Animated.View>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
});

ParallaxScrollView.displayName = 'ParallaxScrollView';

export default ParallaxScrollView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
