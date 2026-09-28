import { ScrollView } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Field, Heading, Screen, Sheet } from '../components/ui';
import { Icon } from '../components/Icon';
import { assets } from '../data/assets';
import { tables } from '../data/tables';
import { useApp } from '../store/AppStore';
import { dateLabel, overlaps, timeLabel, uid } from '../utils/calculations';
import { colors, styles as s } from '../theme';
const defaultDate = () => {
  const d = new Date();
  d.setMinutes(Math.ceil((d.getMinutes() + 1) / 30) * 30, 0, 0);
  return d;
};
export function BookingScreen() {
  const { stacked, compact, contentWidth } = useResponsive();
  const { state, update, reserve } = useApp();
  const [date, setDate] = useState(defaultDate);
  const [picker, setPicker] = useState<'date' | 'time' | null>(null);
  const [selected, setSelected] = useState<(typeof tables)[number] | null>(
    null,
  );
  const [name, setName] = useState(state.profile?.name ?? '');
  const [guests, setGuests] = useState('');
  const [error, setError] = useState('');
  const occupied = (table: number) =>
    state.reservations.some(
      r => r.table === table && overlaps(r.date, date.toISOString()),
    );
  const confirm = async () => {
    if (!selected) {
      return;
    }
    if (!name.trim()) {
      setError('Please enter the name for your reservation.');
      return;
    }
    const count = Number(guests);
    if (!/^\d+$/.test(guests) || count < 1 || count > selected.seats) {
      setError(`Enter between 1 and ${selected.seats} guests.`);
      return;
    }
    await reserve({
      id: uid(),
      table: selected.id,
      date: date.toISOString(),
      guests: count,
      name: name.trim(),
    });
    setSelected(null);
    setGuests('');
    Alert.alert(
      'Reservation saved',
      'Saved on this device. Please confirm availability with the restaurant before your visit.',
    );
  };
  return (
    <Screen>
      <Heading title="Reserve a Table" />
      <View style={[s.row, stacked && s.stack]}>
        {(['date', 'time'] as const).map(mode => (
          <View key={mode} style={[local.half, stacked && s.natural]}>
            <Text style={s.label}>{mode}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Choose ${mode}`}
              onPress={() => setPicker(mode)}
              style={local.dateButton}
            >
              <Text style={[s.text, local.dateText]}>
                {mode === 'date' ? dateLabel(date) : timeLabel(date)}
              </Text>
              <Icon name={mode === 'date' ? 'calendar' : 'clock'} size={16} />
            </Pressable>
          </View>
        ))}
      </View>
      {picker && (
        <View style={s.card}>
          <DateTimePicker
            value={date}
            mode={picker}
            minimumDate={picker === 'date' ? new Date() : undefined}
            display={
              Platform.OS === 'ios'
                ? compact
                  ? 'compact'
                  : 'spinner'
                : 'default'
            }
            themeVariant="dark"
            onChange={(event, value) => {
              if (Platform.OS === 'android') {
                setPicker(null);
              }
              if (event.type !== 'dismissed' && value) {
                setDate(value);
              }
            }}
          />
          {Platform.OS === 'ios' && (
            <Button title="Done" onPress={() => setPicker(null)} />
          )}
        </View>
      )}
      <View style={[s.row, s.wrap]}>
        <View style={[local.legend, { backgroundColor: colors.green }]} />
        <Text style={s.body}>Available</Text>
        <View style={[local.legend, { backgroundColor: colors.red }]} />
        <Text style={s.body}>Occupied</Text>
      </View>
      <View style={s.card}>
        <Text style={local.planLabel}>
          Restaurant floor plan · Tap to select
        </Text>
        <ScrollView
          horizontal
          bounces={false}
          contentContainerStyle={local.floorViewport}
        >
          <ImageBackground
            source={assets.floor}
            resizeMode="stretch"
            style={[local.floor, { width: Math.max(352, contentWidth - 2) }]}
          >
            {tables.map(table => {
              const taken = occupied(table.id);
              return (
                <Pressable
                  key={table.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Table ${table.id}, ${
                    table.seats
                  } seats, ${taken ? 'occupied' : 'available'}`}
                  onPress={() => {
                    if (taken) {
                      Alert.alert(
                        'Table occupied',
                        'Choose another table or time.',
                      );
                    } else {
                      setSelected(table);
                      setError('');
                    }
                  }}
                  style={[
                    local.table,
                    taken ? local.occupied : local.available,
                    {
                      left: `${table.x}%`,
                      top: `${table.y}%`,
                      borderColor: taken ? colors.red : colors.green,
                    },
                  ]}
                >
                  <Text
                    style={[
                      local.tableNumber,
                      taken ? local.occupiedText : local.availableText,
                    ]}
                  >
                    {table.id}
                  </Text>
                  <Text style={local.seats}>{table.seats}p</Text>
                </Pressable>
              );
            })}
          </ImageBackground>
        </ScrollView>
      </View>
      <Text style={s.body}>
        Table selections are saved on this device for a two-hour visit. Live
        restaurant availability is not connected.
      </Text>
      {state.reservations.length > 0 && (
        <Text style={s.subtitle}>My Reservations</Text>
      )}
      {state.reservations.map(r => (
        <View key={r.id} style={[s.card, s.pad, local.reservation]}>
          <View style={[s.row, s.wrap]}>
            <Icon name="check" color={colors.green} />
            <Text style={s.subtitle}>Reservation Saved</Text>
          </View>
          <Text style={s.body}>
            Table #{r.table} · {r.guests} {r.guests === 1 ? 'guest' : 'guests'}
          </Text>
          <Text style={s.text}>{r.name}</Text>
          <Text style={s.body}>
            {dateLabel(r.date)} · {timeLabel(r.date)}
          </Text>
          <Button
            title="Cancel Reservation"
            variant="outline"
            onPress={() =>
              new Promise<void>(resolve =>
                Alert.alert(
                  'Cancel reservation?',
                  'This removes your saved table selection.',
                  [
                    { text: 'Keep', style: 'cancel', onPress: () => resolve() },
                    {
                      text: 'Cancel reservation',
                      style: 'destructive',
                      onPress: () => {
                        update(current => ({
                          ...current,
                          reservations: current.reservations.filter(
                            item => item.id !== r.id,
                          ),
                        }))
                          .then(() => resolve())
                          .catch(() => {
                            Alert.alert('Unable to save', 'Please try again.');
                            resolve();
                          });
                      },
                    },
                  ],
                  { cancelable: true, onDismiss: () => resolve() },
                ),
              )
            }
          />
        </View>
      ))}
      <Sheet visible={Boolean(selected)} onClose={() => setSelected(null)}>
        <Text style={s.title}>Table {selected?.id}</Text>
        <Text style={s.body}>Seats up to {selected?.seats} guests</Text>
        <View style={[s.card, s.pad]}>
          <Text style={s.text}>
            {dateLabel(date)} · {timeLabel(date)}
          </Text>
          <Text style={s.body}>Duration: 2 hours</Text>
        </View>
        <Field
          label="Reservation name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          maxLength={80}
          autoComplete="name"
        />
        <Field
          label="Number of guests"
          value={guests}
          onChangeText={setGuests}
          keyboardType="number-pad"
          placeholder={`1–${selected?.seats}`}
          maxLength={1}
        />
        {Boolean(error) && (
          <Text accessibilityRole="alert" style={local.error}>
            {error}
          </Text>
        )}
        <Button title="Save Reservation" onPress={confirm} />
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => setSelected(null)}
        />
      </Sheet>
    </Screen>
  );
}
const local = StyleSheet.create({
  occupied: { backgroundColor: '#60172FF2' },
  available: { backgroundColor: '#350F1FF2' },
  occupiedText: { color: '#FF6269' },
  availableText: { color: '#60D391' },
  half: { flex: 1, gap: 12 },
  dateText: { flex: 1 },
  dateButton: {
    backgroundColor: colors.card,
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  legend: { width: 10, height: 10, borderRadius: 5 },
  planLabel: {
    fontSize: 9,
    letterSpacing: 1,
    color: colors.muted,
    padding: 12,
  },
  floorViewport: { flexGrow: 1 },
  floor: { width: '100%', minWidth: 352, aspectRatio: 352 / 625 },
  table: {
    position: 'absolute',
    width: 38,
    height: 38,
    marginLeft: -19,
    marginTop: -19,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableNumber: { fontSize: 13, fontWeight: '700' },
  seats: { fontSize: 8, color: colors.muted },
  reservation: { borderColor: colors.gold },
  error: { color: '#FF8791' },
});
