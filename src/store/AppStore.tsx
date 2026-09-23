import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dishes } from '../data/menu';
import { overlaps } from '../utils/calculations';

export type Reservation = {
  id: string;
  table: number;
  guests: number;
  date: string;
  name: string;
};
export type Order = {
  id: string;
  date: string;
  items: Record<string, number>;
  comment: string;
  total: number;
};
export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  photo?: string;
  date: string;
};
type Profile = { name: string };
export type AppState = {
  onboarded: boolean;
  cart: Record<string, number>;
  kitchenNote: string;
  favorites: string[];
  reservations: Reservation[];
  orders: Order[];
  reviews: Review[];
  profile: Profile | null;
};
const initial: AppState = {
  onboarded: false,
  cart: {},
  kitchenNote: '',
  favorites: [],
  reservations: [],
  orders: [],
  reviews: [],
  profile: null,
};
const key = '@rama/gourmet/v1';
export const priceOf = (id: string) => {
  const price = dishes.find(d => d.id === id)?.price ?? 0;
  return ['TruffleBurrata', 'RaspberryMartini'].includes(id)
    ? Math.round(price * 80) / 100
    : price;
};
export const cartTotal = (cart: Record<string, number>) =>
  Object.entries(cart).reduce(
    (sum, [id, quantity]) => sum + priceOf(id) * quantity,
    0,
  );
function decode(raw: string): AppState {
  const data = JSON.parse(raw);
  if (
    !data ||
    typeof data.onboarded !== 'boolean' ||
    !data.cart ||
    typeof data.cart !== 'object' ||
    !Array.isArray(data.reservations) ||
    !Array.isArray(data.orders) ||
    !Array.isArray(data.reviews) ||
    !Array.isArray(data.favorites) ||
    typeof data.kitchenNote !== 'string'
  ) {
    throw new Error('Saved data could not be read.');
  }
  const cart = Object.fromEntries(
    Object.entries(data.cart).filter(
      ([id, quantity]) =>
        dishes.some(d => d.id === id) &&
        Number.isInteger(quantity) &&
        Number(quantity) > 0 &&
        Number(quantity) <= 99,
    ),
  );
  return { ...initial, ...data, cart };
}
type Store = {
  state: AppState;
  ready: boolean;
  error: string | null;
  retry: () => void;
  update: (fn: (state: AppState) => AppState) => Promise<void>;
  changeQuantity: (id: string, delta: number) => Promise<void>;
  reserve: (reservation: Reservation) => Promise<void>;
};
const Context = createContext<Store | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initial);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = useRef(initial);
  const queue = useRef(Promise.resolve());
  const retry = useCallback(() => {
    setError(null);
    AsyncStorage.getItem(key)
      .then(raw => {
        current.current = raw ? decode(raw) : initial;
        setState(current.current);
        setReady(true);
      })
      .catch(() =>
        setError('Your saved data could not be loaded. Please try again.'),
      );
  }, []);
  useEffect(retry, [retry]);
  const update = useCallback((fn: (value: AppState) => AppState) => {
    const task = queue.current.then(async () => {
      const next = fn(current.current);
      await AsyncStorage.setItem(key, JSON.stringify(next));
      current.current = next;
      setState(next);
    });
    queue.current = task.catch(() => undefined);
    return task;
  }, []);
  const changeQuantity = useCallback(
    (id: string, delta: number) =>
      update(s => {
        const cart = { ...s.cart };
        const next = Math.min(99, Math.max(0, (cart[id] ?? 0) + delta));
        if (next) {
          cart[id] = next;
        } else {
          delete cart[id];
        }
        return { ...s, cart };
      }),
    [update],
  );
  const reserve = useCallback(
    (reservation: Reservation) =>
      update(s => {
        if (new Date(reservation.date).getTime() <= Date.now()) {
          throw new Error('Please select a future date and time.');
        }
        if (
          s.reservations.some(
            r =>
              r.table === reservation.table &&
              overlaps(r.date, reservation.date),
          )
        ) {
          throw new Error('This table is already reserved for that time.');
        }
        return { ...s, reservations: [reservation, ...s.reservations] };
      }),
    [update],
  );
  return (
    <Context.Provider
      value={{ state, ready, error, retry, update, changeQuantity, reserve }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) {
    throw new Error('AppProvider is required');
  }
  return value;
}
