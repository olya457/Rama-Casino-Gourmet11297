import React, { useState } from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/store/AppStore';
import { SplashScreen, OnboardingScreen } from './src/screens/WelcomeScreens';
import { AppNavigator } from './src/navigation/AppNavigator';
import { MotionProvider } from './src/components/Entrance';
import { Button, Screen } from './src/components/ui';
import { colors, styles } from './src/theme';
function AppContent() {
  const { ready, error, retry, state } = useApp();
  const [splashDone, setSplashDone] = useState(false);
  if (!splashDone) {
    return <SplashScreen onComplete={() => setSplashDone(true)} />;
  }
  if (error) {
    return (
      <Screen>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.body}>{error}</Text>
        <Button title="Try Again" onPress={retry} />
      </Screen>
    );
  }
  if (!ready) {
    return (
      <View style={styles.fill}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }
  return state.onboarded ? <AppNavigator /> : <OnboardingScreen />;
}
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <MotionProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </MotionProvider>
    </SafeAreaProvider>
  );
}
