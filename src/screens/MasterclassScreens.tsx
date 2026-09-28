import { Content } from '../components/ui';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParams, TabParams } from '../navigation/types';
import { Button, Empty, Heading, IconButton, Screen } from '../components/ui';
import { masterclasses } from '../data/masterclasses';
import { assets } from '../data/assets';
import { useApp } from '../store/AppStore';
import { dateLabel, timeLabel } from '../utils/calculations';
import { colors, styles as s } from '../theme';
function useFavorites() {
  const { state, update } = useApp();
  const toggle = (id: string) =>
    update(current => ({
      ...current,
      favorites: current.favorites.includes(id)
        ? current.favorites.filter(item => item !== id)
        : [...current.favorites, id],
    }));
  return { favorites: state.favorites, toggle };
}
function Countdown({ date }: { date: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  const minutes = Math.max(
    0,
    Math.floor((new Date(date).getTime() - now) / 60000),
  );
  return (
    <View style={local.countdown}>
      <Text style={s.label}>
        {minutes > 0 ? 'Starts in' : 'Event date reached'}
      </Text>
      {minutes > 0 && (
        <Text style={local.countdownText}>
          {Math.floor(minutes / 1440)}d {Math.floor(minutes / 60) % 24}h{' '}
          {minutes % 60}m
        </Text>
      )}
    </View>
  );
}
type ListProps = CompositeScreenProps<
  BottomTabScreenProps<TabParams, 'Classes'>,
  NativeStackScreenProps<RootParams>
>;
export function MasterclassesScreen({ navigation }: ListProps) {
  const { favorites, toggle } = useFavorites();
  const [savedOnly, setSavedOnly] = useState(false);
  const items = masterclasses.filter(
    item => !savedOnly || favorites.includes(item.id),
  );
  return (
    <Screen>
      <Heading title="Chef Masterclasses" />
      <Text style={s.body}>
        Exclusive culinary experiences led by our chef.
      </Text>
      <View style={[s.row, s.wrap]}>
        {['All experiences', 'Saved'].map((label, i) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: savedOnly === Boolean(i) }}
            key={label}
            onPress={() => setSavedOnly(Boolean(i))}
            style={[
              local.filter,
              savedOnly === Boolean(i) && local.activeFilter,
            ]}
          >
            <Text style={s.text}>{label}</Text>
          </Pressable>
        ))}
      </View>
      {items.length === 0 && (
        <Empty
          title="Your culinary wishlist"
          text="Tap the heart on a masterclass to save it here."
          icon="heart"
        />
      )}
      {items.map(item => {
        const saved = favorites.includes(item.id);
        return (
          <View key={item.id} style={[s.card, saved && local.saved]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Read about ${item.name}`}
              onPress={() =>
                navigation.navigate('Masterclass', { id: item.id })
              }
            >
              <Image source={item.image} style={local.image} />
              <View style={s.pad}>
                <Text style={s.subtitle}>{item.name}</Text>
                <Text style={local.date}>
                  {dateLabel(item.date)} · {timeLabel(item.date)}
                </Text>
                <Text style={s.body}>{item.paragraphs[0].split('. ')[0]}.</Text>
                {saved && <Countdown date={item.date} />}
              </View>
            </Pressable>
            <View style={local.exclusive}>
              <Text style={local.exclusiveText}>EXCLUSIVE</Text>
            </View>
            <View style={local.heart}>
              <IconButton
                name="heart"
                label={saved ? `Unsave ${item.name}` : `Save ${item.name}`}
                filled={saved}
                onPress={() => {
                  toggle(item.id).catch(() =>
                    Alert.alert('Unable to save', 'Please try again.'),
                  );
                }}
              />
            </View>
          </View>
        );
      })}
    </Screen>
  );
}
export function MasterclassScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'Masterclass'>) {
  const item = masterclasses.find(m => m.id === route.params.id);
  const { favorites, toggle } = useFavorites();
  if (!item) {
    return (
      <Screen>
        <Heading
          title="Experience unavailable"
          back={() => navigation.goBack()}
        />
      </Screen>
    );
  }
  const saved = favorites.includes(item.id);
  return (
    <Screen padded={false}>
      <Image source={item.image} style={local.detailImage} />
      <View style={local.back}>
        <IconButton
          name="back"
          label="Go back"
          onPress={() => navigation.goBack()}
        />
      </View>
      <Content>
        <Text style={s.label}>
          Masterclass ·{' '}
          {new Date(item.date).toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <Text style={s.title}>{item.name}</Text>
        <Text style={s.body}>
          {dateLabel(item.date)} · {timeLabel(item.date)}
        </Text>
        <View style={s.line} />
        {item.paragraphs.map(p => (
          <Text key={p} style={local.paragraph}>
            {p}
          </Text>
        ))}
        <View style={[s.card, s.pad, s.row]}>
          <Image source={assets.chef} style={local.host} />
          <View style={local.hostText}>
            <Text style={s.label}>Your host</Text>
            <Text style={s.subtitle}>The Dining Experience Culinary Team</Text>
            <Text style={s.body}>Contemporary cuisine · The Grand Table</Text>
          </View>
        </View>
        {saved && <Countdown date={item.date} />}
        <Button
          title={saved ? 'Saved to Favorites' : 'Save to Favorites'}
          icon="heart"
          onPress={() => toggle(item.id)}
          variant={saved ? 'gold' : 'outline'}
        />
      </Content>
    </Screen>
  );
}
const local = StyleSheet.create({
  filter: {
    backgroundColor: colors.card,
    maxWidth: '100%',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  activeFilter: { backgroundColor: colors.button, borderColor: colors.red },
  saved: { borderColor: colors.gold },
  image: { width: '100%', aspectRatio: 1.95 },
  date: { fontSize: 12, color: colors.muted },
  exclusive: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.button,
  },
  exclusiveText: { fontSize: 10, letterSpacing: 1, color: colors.gold },
  heart: { position: 'absolute', top: 10, right: 10 },
  countdown: {
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.card,
    borderRadius: 7,
    padding: 14,
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countdownText: { color: colors.gold, fontSize: 14, fontWeight: '600' },
  detailImage: { width: '100%', aspectRatio: 1.5 },
  back: { position: 'absolute', top: 16, left: 16 },
  paragraph: { fontSize: 15, lineHeight: 27, color: colors.muted },
  host: { width: 58, height: 74, borderRadius: 4 },
  hostText: { flex: 1, gap: 8 },
});
