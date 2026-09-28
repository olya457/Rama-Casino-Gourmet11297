import { useResponsive } from '../hooks/useResponsive';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Field, Heading, IconButton, Screen } from '../components/ui';
import {
  amount,
  money,
  splitBill,
  tipAmount,
  uid,
} from '../utils/calculations';
import { colors, styles as s } from '../theme';
type Guest = { id: string; name: string; dishes: string; drinks: string };
export function CalculatorsScreen() {
  const { stacked } = useResponsive();
  const [mode, setMode] = useState(0);
  const [bill, setBill] = useState('');
  const [count, setCount] = useState('');
  const [tipBill, setTipBill] = useState('');
  const [percent, setPercent] = useState('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [touched, setTouched] = useState(false);
  const total = amount(bill);
  const people = /^\d+$/.test(count) ? Number(count) : 0;
  const splitValid = total !== null && total > 0 && people > 0 && people <= 100;
  const split = splitValid ? splitBill(total, people) : [];
  const tipTotal = amount(tipBill);
  const tipPercent = amount(percent);
  const tipValid =
    tipTotal !== null &&
    tipTotal > 0 &&
    tipPercent !== null &&
    tipPercent <= 100;
  const tip = tipValid ? tipAmount(tipTotal, tipPercent) : 0;
  const setGuest = (id: string, field: keyof Guest, value: string) =>
    setGuests(current =>
      current.map(g => (g.id === id ? { ...g, [field]: value } : g)),
    );
  const individualValid =
    guests.length > 0 &&
    guests.every(g => amount(g.dishes) !== null && amount(g.drinks) !== null);
  return (
    <Screen>
      <Heading title="Bill Calculators" />
      <View style={[local.tabs, stacked && s.stack]}>
        {['Split Bill', 'Individual', 'Tip Calc'].map((tab, i) => (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === i }}
            style={[
              local.tab,
              stacked && s.natural,
              mode === i && local.selected,
            ]}
            onPress={() => {
              setMode(i);
              setTouched(false);
            }}
          >
            <Text style={[local.tabText, mode === i && local.selectedText]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
      {mode === 0 && (
        <>
          <Field
            label="Total bill"
            placeholder="Enter amount in €"
            keyboardType="decimal-pad"
            value={bill}
            onChangeText={setBill}
            maxLength={12}
          />
          <Field
            label="Number of guests"
            placeholder="Enter number of people"
            keyboardType="number-pad"
            value={count}
            onChangeText={setCount}
            maxLength={3}
          />
          <Button title="Calculate" onPress={() => setTouched(true)} />
          {splitValid && (
            <View style={[s.card, s.pad, local.result]}>
              <View style={s.between}>
                <Text style={s.body}>Each guest pays</Text>
                <Text style={s.gold}>{money(split[0])}</Text>
              </View>
              {split[0] !== split[split.length - 1] && (
                <>
                  <Text style={s.body}>
                    The remainder is shared one cent at a time.
                  </Text>
                  {split.map((share, i) => (
                    <View key={i} style={s.between}>
                      <Text style={s.body}>Guest {i + 1}</Text>
                      <Text style={s.text}>{money(share)}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}
          {touched && !splitValid && (
            <Text accessibilityRole="alert" style={local.error}>
              Enter a positive bill amount and 1–100 guests.
            </Text>
          )}
        </>
      )}
      {mode === 1 && (
        <>
          {guests.length === 0 && (
            <Text style={s.body}>
              Add your guests, then enter the price of each person’s dishes and
              drinks. Enter 0 for anything they did not order.
            </Text>
          )}
          {guests.map((guest, i) => {
            const food = amount(guest.dishes);
            const drink = amount(guest.drinks);
            return (
              <View key={guest.id} style={[s.card, s.pad]}>
                <View style={s.between}>
                  <Text style={s.label}>Guest {i + 1}</Text>
                  <IconButton
                    name="close"
                    label={`Remove guest ${i + 1}`}
                    onPress={() =>
                      setGuests(current =>
                        current.filter(g => g.id !== guest.id),
                      )
                    }
                  />
                </View>
                <Field
                  placeholder="Name (optional)"
                  value={guest.name}
                  onChangeText={value => setGuest(guest.id, 'name', value)}
                  maxLength={60}
                />
                <View style={[s.row, stacked && s.stack]}>
                  <View style={[local.half, stacked && s.natural]}>
                    <Field
                      label="Dishes"
                      placeholder="Amount in €"
                      keyboardType="decimal-pad"
                      value={guest.dishes}
                      onChangeText={value =>
                        setGuest(guest.id, 'dishes', value)
                      }
                      maxLength={12}
                    />
                  </View>
                  <View style={[local.half, stacked && s.natural]}>
                    <Field
                      label="Drinks"
                      placeholder="Amount in €"
                      keyboardType="decimal-pad"
                      value={guest.drinks}
                      onChangeText={value =>
                        setGuest(guest.id, 'drinks', value)
                      }
                      maxLength={12}
                    />
                  </View>
                </View>
                {food !== null && drink !== null && (
                  <View style={s.between}>
                    <Text style={[s.body, local.half]}>
                      {guest.name.trim() || 'Guest'} pays
                    </Text>
                    <Text style={s.gold}>{money(food + drink)}</Text>
                  </View>
                )}
              </View>
            );
          })}
          <Button
            title="Add Guest"
            icon="plus"
            variant="outline"
            disabled={guests.length >= 100}
            onPress={() =>
              setGuests(current => [
                ...current,
                { id: uid(), name: '', dishes: '', drinks: '' },
              ])
            }
          />
          {guests.length > 0 && (
            <Button title="Calculate" onPress={() => setTouched(true)} />
          )}
          {individualValid && (
            <View style={[s.card, s.pad, local.result]}>
              <View style={s.between}>
                <Text style={s.body}>Total bill</Text>
                <Text style={s.gold}>
                  {money(
                    guests.reduce(
                      (sum, g) => sum + amount(g.dishes)! + amount(g.drinks)!,
                      0,
                    ),
                  )}
                </Text>
              </View>
            </View>
          )}
          {touched && !individualValid && (
            <Text style={local.error}>
              Enter a valid amount in both fields for every guest.
            </Text>
          )}
        </>
      )}
      {mode === 2 && (
        <>
          <Field
            label="Bill amount"
            placeholder="Enter amount in €"
            keyboardType="decimal-pad"
            value={tipBill}
            onChangeText={setTipBill}
            maxLength={12}
          />
          <Field
            label="Tip percentage"
            placeholder="Enter percentage"
            keyboardType="decimal-pad"
            value={percent}
            onChangeText={setPercent}
            maxLength={6}
          />
          <View style={[s.row, s.wrap]}>
            {[5, 10, 15, 20].map(p => (
              <Pressable
                key={p}
                accessibilityRole="button"
                onPress={() => setPercent(String(p))}
                style={[local.chip, percent === String(p) && local.selected]}
              >
                <Text style={s.text}>{p}%</Text>
              </Pressable>
            ))}
          </View>
          <Button title="Calculate" onPress={() => setTouched(true)} />
          {tipValid && (
            <View style={[s.card, s.pad, local.result]}>
              <View style={s.between}>
                <Text style={s.body}>Tip amount</Text>
                <Text style={s.gold}>{money(tip)}</Text>
              </View>
              <View style={s.line} />
              <View style={s.between}>
                <Text style={s.body}>Total with tip</Text>
                <Text style={s.gold}>{money(tipTotal + tip)}</Text>
              </View>
            </View>
          )}
          {touched && !tipValid && (
            <Text accessibilityRole="alert" style={local.error}>
              Enter a positive bill amount and a tip between 0 and 100%.
            </Text>
          )}
        </>
      )}
    </Screen>
  );
}
const local = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 4,
    borderRadius: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  selected: { backgroundColor: colors.button },
  tabText: { fontSize: 12, color: colors.muted, textAlign: 'center' },
  selectedText: { color: colors.gold, fontWeight: '600' },
  result: { borderColor: '#A37B1E', backgroundColor: colors.card },
  error: { color: '#FF8791', lineHeight: 22 },
  half: { flex: 1 },
  chip: {
    flex: 1,
    minWidth: 64,
    minHeight: 44,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 6,
  },
});
