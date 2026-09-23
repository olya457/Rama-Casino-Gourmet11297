import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider, useApp } from '../src/store/AppStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));
let store: ReturnType<typeof useApp>;
function Probe() {
  store = useApp();
  return null;
}
let root: TestRenderer.ReactTestRenderer;
beforeEach(async () => {
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  await act(async () => {
    root = TestRenderer.create(
      <AppProvider>
        <Probe />
      </AppProvider>,
    );
  });
});
afterEach(async () => {
  await act(async () => root.unmount());
});
test('starts without fabricated user data and serializes rapid cart changes', async () => {
  expect(store.ready).toBe(true);
  expect(store.state.reviews).toEqual([]);
  expect(store.state.reservations).toEqual([]);
  await act(async () => {
    await Promise.all([
      store.changeQuantity('TruffleBurrata', 1),
      store.changeQuantity('TruffleBurrata', 1),
    ]);
  });
  expect(store.state.cart.TruffleBurrata).toBe(2);
  expect(
    JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[1][1]).cart
      .TruffleBurrata,
  ).toBe(2);
  await act(async () => {
    await store.changeQuantity('TruffleBurrata', -3);
  });
  expect(store.state.cart).toEqual({});
});
test('retains previous state after a storage failure and can retry', async () => {
  (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
    new Error('disk full'),
  );
  await act(async () => {
    await expect(store.changeQuantity('TruffleBurrata', 1)).rejects.toThrow(
      'disk full',
    );
  });
  expect(store.state.cart).toEqual({});
  await act(async () => {
    await store.changeQuantity('TruffleBurrata', 1);
  });
  expect(store.state.cart.TruffleBurrata).toBe(1);
});
test('rejects duplicate reservations at the storage boundary', async () => {
  const reservation = {
    id: 'one',
    table: 1,
    guests: 2,
    name: 'Test Guest',
    date: new Date(Date.now() + 86400000).toISOString(),
  };
  await act(async () => {
    await store.reserve(reservation);
  });
  await act(async () => {
    await expect(store.reserve({ ...reservation, id: 'two' })).rejects.toThrow(
      'already reserved',
    );
  });
  expect(store.state.reservations).toHaveLength(1);
});
test('restores saved state after remount', async () => {
  await act(async () => {
    await store.update(s => ({
      ...s,
      onboarded: true,
      favorites: ['steak'],
      kitchenNote: 'No salt',
    }));
  });
  const saved = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(saved);
  await act(async () => root.unmount());
  await act(async () => {
    root = TestRenderer.create(
      <AppProvider>
        <Probe />
      </AppProvider>,
    );
  });
  expect(store.state.onboarded).toBe(true);
  expect(store.state.favorites).toEqual(['steak']);
  expect(store.state.kitchenNote).toBe('No salt');
});
