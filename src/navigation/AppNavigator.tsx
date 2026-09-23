import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootParams, TabParams } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { CartScreen } from '../screens/CartScreen';
import { BookingScreen } from '../screens/BookingScreen';
import {
  MasterclassScreen,
  MasterclassesScreen,
} from '../screens/MasterclassScreens';
import { CalculatorsScreen } from '../screens/CalculatorsScreen';
import { ReviewsScreen } from '../screens/ReviewsScreen';
import { Icon, IconName } from '../components/Icon';
import { colors } from '../theme';
const Stack = createNativeStackNavigator<RootParams>();
const Tabs = createBottomTabNavigator<TabParams>();
const icons: Record<keyof TabParams, IconName> = {
  Home: 'home',
  Menu: 'menu',
  Booking: 'calendar',
  Classes: 'chef',
  Calculators: 'calculator',
  Reviews: 'review',
};
const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    primary: colors.gold,
    border: colors.border,
  },
};
function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return (
    <View style={local.icon}>
      <Icon name={name} color={focused ? colors.goldLight : '#795044'} />
      <View style={[local.dot, !focused && local.hidden]} />
    </View>
  );
}
const tabIcons = Object.fromEntries(
  Object.entries(icons).map(([route, name]) => [
    route,
    ({ focused }: { focused: boolean }) => (
      <TabIcon name={name} focused={focused} />
    ),
  ]),
) as Record<
  keyof TabParams,
  (props: { focused: boolean }) => React.JSX.Element
>;
function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarAccessibilityLabel: route.name,
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingTop: 9,
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarIcon: tabIcons[route.name],
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Menu" component={MenuScreen} />
      <Tabs.Screen name="Booking" component={BookingScreen} />
      <Tabs.Screen name="Classes" component={MasterclassesScreen} />
      <Tabs.Screen name="Calculators" component={CalculatorsScreen} />
      <Tabs.Screen name="Reviews" component={ReviewsScreen} />
    </Tabs.Navigator>
  );
}
export function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Masterclass" component={MasterclassScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const local = StyleSheet.create({
  hidden: { opacity: 0 },
  icon: { alignItems: 'center', gap: 5 },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 3,
    backgroundColor: colors.goldLight,
  },
});
