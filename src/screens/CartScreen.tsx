import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParams } from '../navigation/types';
import {
  Button,
  Empty,
  Field,
  Heading,
  Quantity,
  Screen,
  Sheet,
} from '../components/ui';
import { Icon } from '../components/Icon';
import { cartTotal, priceOf, useApp } from '../store/AppStore';
import { dishes } from '../data/menu';
import { dateLabel, money, uid } from '../utils/calculations';
import { colors, styles as s } from '../theme';
export function CartScreen({
  navigation,
}: NativeStackScreenProps<RootParams, 'Cart'>) {
  const { state, update, changeQuantity } = useApp();
  const [note, setNote] = useState(state.kitchenNote);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const entries = Object.entries(state.cart);
  const total = cartTotal(state.cart);
  const saveOrder = async () => {
    const id = `RCG-${uid()}`;
    await update(current => {
      if (!Object.keys(current.cart).length) {
        throw new Error('Your cart is empty.');
      }
      return {
        ...current,
        cart: {},
        kitchenNote: '',
        orders: [
          {
            id,
            date: new Date().toISOString(),
            items: { ...current.cart },
            comment: note.trim(),
            total: cartTotal(current.cart),
          },
          ...current.orders,
        ],
      };
    });
    setNote('');
    setConfirmation(id);
  };
  return (
    <Screen>
      <Heading title="Your Cart" back={() => navigation.goBack()} />
      {!entries.length ? (
        <Empty
          title="Your table awaits"
          text="Explore the menu and add something delicious to your cart."
          icon="cart"
        />
      ) : (
        <>
          {entries.map(([id, quantity]) => {
            const dish = dishes.find(d => d.id === id)!;
            return (
              <View key={id} style={[s.card, s.pad]}>
                <View style={s.row}>
                  <Image source={dish.image} style={local.thumb} />
                  <View style={local.copy}>
                    <Text style={s.subtitle}>{dish.name}</Text>
                    <Text style={s.body}>{money(priceOf(id))} each</Text>
                  </View>
                </View>
                <View style={s.between}>
                  <Quantity
                    label={dish.name}
                    value={quantity}
                    onChange={delta => changeQuantity(id, delta)}
                  />
                  <Text style={s.gold}>{money(priceOf(id) * quantity)}</Text>
                </View>
              </View>
            );
          })}
          <Field
            label="A note for the kitchen"
            placeholder="Allergies, preferences or a special request"
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={1000}
          />
          <Button
            title="Save kitchen note"
            variant="outline"
            onPress={() =>
              update(current => ({ ...current, kitchenNote: note }))
            }
          />
          <View style={s.between}>
            <Text style={s.subtitle}>Total</Text>
            <Text style={s.gold}>{money(total)}</Text>
          </View>
          <Text style={s.body}>
            Save your order on this device to show the restaurant team. Orders
            are not sent to the kitchen automatically.
          </Text>
          <Button title="Save Order" onPress={saveOrder} />
        </>
      )}
      <Button
        title="Explore the Menu"
        variant="outline"
        onPress={() => navigation.navigate('Main', { screen: 'Menu' })}
      />
      {state.orders.length > 0 && (
        <>
          <View style={s.line} />
          <Text style={s.subtitle}>Saved Orders</Text>
          {state.orders.map(order => (
            <View key={order.id} style={[s.card, s.pad]}>
              <Text style={s.label}>{order.id}</Text>
              <View style={s.between}>
                <Text style={s.body}>{dateLabel(order.date)}</Text>
                <Text style={s.gold}>{money(order.total)}</Text>
              </View>
              {Object.entries(order.items).map(([id, q]) => (
                <Text key={id} style={s.body}>
                  {q} × {dishes.find(d => d.id === id)?.name}
                </Text>
              ))}
              {Boolean(order.comment) && (
                <Text style={s.body}>Kitchen note: {order.comment}</Text>
              )}
            </View>
          ))}
        </>
      )}
      <Sheet
        visible={confirmation !== null}
        onClose={() => setConfirmation(null)}
      >
        <View style={local.confirm}>
          <Icon name="check" color={colors.green} size={45} />
          <Text style={s.title}>Order Saved</Text>
          <Text style={[s.body, local.center]}>
            Your order is saved on this device. Show it to the restaurant team
            to place your order.
          </Text>
          <Text style={s.label}>Order reference</Text>
          <Text style={s.gold}>{confirmation}</Text>
        </View>
        <Button title="Close" onPress={() => setConfirmation(null)} />
      </Sheet>
    </Screen>
  );
}
const local = StyleSheet.create({
  thumb: { width: 76, height: 76, borderRadius: 7 },
  copy: { flex: 1, gap: 8 },
  confirm: { gap: 20, alignItems: 'center' },
  center: { textAlign: 'center' },
});
