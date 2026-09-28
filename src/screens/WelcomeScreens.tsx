import { Entrance } from '../components/Entrance';
import { useResponsive } from '../hooks/useResponsive';
import React, { useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../data/assets';
import { Button } from '../components/ui';
import { colors, serif, styles as s } from '../theme';
import { useApp } from '../store/AppStore';

const loaderSource = {
  html: `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  html,body{margin:0;background:transparent;height:100%;overflow:hidden}
  .dots{height:100%;display:flex;align-items:center;justify-content:center;gap:12px}
  i{width:22px;height:22px;background:#f53220;border-radius:50%;opacity:.35;animation:glow 1.2s linear infinite}
  i:nth-child(2){animation-delay:-.8s}
  i:nth-child(3){animation-delay:-.4s}
  @keyframes glow{
    0%,20%{opacity:1;box-shadow:0 0 10px #ff3b30,0 0 22px #f53220}
    33.333%,100%{opacity:.35;box-shadow:0 0 0 transparent}
  }
</style></head><body><div class="dots"><i></i><i></i><i></i></div></body></html>`,
};
export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const { width } = useWindowDimensions();
  const [loaderReady, setLoaderReady] = useState(false);
  const callback = useRef(onComplete);
  callback.current = onComplete;
  useEffect(() => {
    const timer = setTimeout(() => callback.current(), 4000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <ImageBackground source={assets.splash} style={[local.fill, s.fill]}>
      <LinearGradient
        colors={['#240A1470', '#240A1499', '#240A14E6']}
        style={local.fill}
      >
        <SafeAreaView style={local.splash}>
          <View style={local.brand}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[
                local.brandTitle,
                { fontSize: Math.min(width * 0.085, 42) },
              ]}
            >
              Dining Experience
            </Text>
          </View>
          <View
            style={local.loader}
            pointerEvents="none"
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel="Loading"
          >
            {!loaderReady && (
              <View style={local.loaderPlaceholder}>
                <View style={[local.loaderDot, local.loaderDotLit]} />
                <View style={local.loaderDot} />
                <View style={local.loaderDot} />
              </View>
            )}
            <WebView
              source={loaderSource}
              containerStyle={local.webviewContainer}
              style={[local.webview, !loaderReady && local.webviewLoading]}
              onLoad={() => setLoaderReady(true)}
              scrollEnabled={false}
              originWhitelist={['about:blank']}
              javaScriptEnabled={false}
              overScrollMode="never"
              opaque={false}
              accessible={false}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}
const slides = [
  {
    title: 'Discover\nDining Experience',
    text: 'Explore the restaurant concept, meet the chef, and discover the Dish of the Day and Drink of the Day. Find everything you need for a memorable dining experience at Dining Experience.',
  },
  {
    title: 'Explore the\nMenu',
    text: 'Browse 24 dishes across four categories, view ingredients and prices, and check preparation times. Add your favourites to the cart and leave special requests for the kitchen.',
  },
  {
    title: 'Reserve Your\nTable',
    text: 'Choose a date, time, and available table directly in the app. Use the floor plan to check table capacity and save your reservation in just a few taps.',
  },
  {
    title: 'Enjoy More\nThan Dinner',
    text: 'Join exclusive chef-led masterclasses, split the bill with ease, calculate tips, and share your dining experience. Dining Experience brings every detail of your visit together in one convenient app.',
  },
];
export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const { update } = useApp();
  const { compact, short, spacing, availableHeight } = useResponsive();
  return (
    <ImageBackground
      source={assets.onboarding[index]}
      style={[local.fill, s.fill]}
    >
      <LinearGradient
        colors={['#240A1433', '#240A1480', '#240A14F2']}
        locations={[0, 0.3, 1]}
        style={local.fill}
      >
        <SafeAreaView style={local.fill}>
          <ScrollView
            contentContainerStyle={[
              local.onboard,
              { minHeight: availableHeight, paddingHorizontal: spacing },
            ]}
          >
            <View style={[local.spacer, short && local.shortSpacer]} />
            <Entrance
              replayKey={index}
              direction="right"
              style={[local.copy, short && local.shortCopy]}
            >
              <Text style={s.label}>Dining Experience · Fine Dining</Text>
              <Text style={[local.onboardTitle, compact && local.compactTitle]}>
                {slides[index].title}
              </Text>
              <Text style={local.onboardBody}>{slides[index].text}</Text>
              <View style={local.pagination}>
                {slides.map((_, i) => (
                  <View
                    key={i}
                    style={[local.dot, i === index && local.activeDot]}
                  />
                ))}
                <Text style={local.counter}>{index + 1} of 4</Text>
              </View>
              <Button
                title="Continue"
                onPress={() =>
                  index < 3
                    ? setIndex(index + 1)
                    : update(state => ({ ...state, onboarded: true }))
                }
              />
            </Entrance>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}
const local = StyleSheet.create({
  shortSpacer: { minHeight: 40 },
  shortCopy: { gap: 16 },
  compactTitle: { fontSize: 30, lineHeight: 35 },
  fill: { flex: 1 },
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  brand: { alignItems: 'center', gap: 14, width: '94%' },
  brandTitle: {
    color: colors.text,
    fontFamily: serif,
    fontWeight: '700',
    marginTop: 24,
  },
  loader: { position: 'absolute', bottom: '4%', height: 70, width: 160 },
  webviewContainer: { flex: 1, backgroundColor: 'transparent' },
  webview: { flex: 1, width: 160, height: 70, backgroundColor: 'transparent' },
  webviewLoading: { opacity: 0 },
  loaderPlaceholder: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loaderDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#f53220',
    opacity: 0.35,
  },
  loaderDotLit: {
    opacity: 1,
    boxShadow: '0 0 10px #ff3b30, 0 0 22px #f53220',
  },
  onboard: {
    paddingHorizontal: 28,
    paddingBottom: 24,
    flexGrow: 1,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  spacer: { flex: 1, minHeight: 170 },
  copy: { gap: 24 },
  onboardTitle: {
    fontFamily: serif,
    fontSize: 36,
    lineHeight: 41,
    fontWeight: '700',
    color: colors.text,
  },
  onboardBody: { fontSize: 15, lineHeight: 26, color: '#E8DED1' },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginVertical: 10,
  },
  dot: { height: 6, width: 6, borderRadius: 4, backgroundColor: colors.border },
  activeDot: { width: 24, backgroundColor: colors.gold },
  counter: { fontSize: 12, color: colors.text, marginLeft: 6 },
});
