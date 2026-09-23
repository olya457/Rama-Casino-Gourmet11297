import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../theme';
export type IconName =
  | 'home'
  | 'menu'
  | 'calendar'
  | 'chef'
  | 'calculator'
  | 'review'
  | 'cart'
  | 'heart'
  | 'back'
  | 'clock'
  | 'check'
  | 'star'
  | 'plus'
  | 'minus'
  | 'close'
  | 'photo';
export function Icon({
  name,
  size = 23,
  color = colors.gold,
  filled = false,
}: {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean;
}) {
  const paths: Partial<Record<IconName, string>> = {
    home: 'M3 10L12 3l9 7v11h-6v-8H9v8H3z',
    menu: 'M5 3h14v18H5z M3 7h4M3 12h4M3 17h4 M9 15h7 M10 11a3 3 0 0 1 6 0z',
    calendar: 'M4 5h16v16H4z M8 2v6M16 2v6M4 10h16 M8 15l3 3 5-5',
    chef: 'M7 14C0 13 3 4 8 6c1-5 7-5 8 0 5-2 8 7 1 8v6H7z M7 16h10 M10 11v4M14 11v4',
    calculator:
      'M5 2h14v20H5z M8 5h8v4H8z M8 13h1M12 13h1M16 13h1M8 17h1M12 17h1M16 17h1',
    review: 'M4 4h17v13H9l-5 4z M8 8h9M8 12h6',
    cart: 'M2 3h3l3 12h11l3-9H6 M9 20h.01M18 20h.01',
    heart: 'M12 21S2 15 2 8a5 5 0 0 1 10-2A5 5 0 0 1 22 8c0 7-10 13-10 13z',
    back: 'M15 4l-8 8 8 8',
    check: 'M5 12l5 5L20 7',
    star: 'M12 2l3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1z',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    close: 'M5 5l14 14M5 19L19 5',
    photo: 'M3 6h5l2-3h4l2 3h5v15H3z M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === 'clock' ? (
        <>
          <Circle cx={12} cy={12} r={9} />
          <Path d="M12 6v6l4 2" />
        </>
      ) : (
        <Path d={paths[name]} fill={filled ? color : 'none'} />
      )}
    </Svg>
  );
}
