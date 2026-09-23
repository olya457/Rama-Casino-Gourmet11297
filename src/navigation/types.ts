import { NavigatorScreenParams } from '@react-navigation/native';
export type TabParams = {
  Home: undefined;
  Menu: undefined;
  Booking: undefined;
  Classes: undefined;
  Calculators: undefined;
  Reviews: undefined;
};
export type RootParams = {
  Main: NavigatorScreenParams<TabParams>;
  Cart: undefined;
  Masterclass: { id: string };
};
