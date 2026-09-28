import { useResponsive } from '../hooks/useResponsive';
import { Content } from '../components/ui';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParams } from '../navigation/types';
import { Button, Screen } from '../components/ui';
import { assets } from '../data/assets';
import { chefDescription, dishes, restaurantDescription } from '../data/menu';
import { colors, styles as s } from '../theme';
import { money } from '../utils/calculations';
import { priceOf } from '../store/AppStore';
export function HomeScreen({
  navigation,
}: BottomTabScreenProps<TabParams, 'Home'>) {
  const { stacked } = useResponsive();
  return (
    <Screen padded={false}>
      <Image source={assets.restaurant} style={local.hero} />
      <Content>
        <Text style={s.label}>Fine Dining</Text>
        <Text style={s.title}>Dining Experience</Text>
        <Text style={s.body}>{restaurantDescription}</Text>
        <View style={s.line} />
        <Text style={[s.label, local.red]}>Executive Chef</Text>
        <View style={[local.chef, stacked && s.stack]}>
          <Image source={assets.chef} style={local.chefImage} />
          <View style={[local.chefCopy, stacked && s.natural]}>
            <Text style={s.subtitle}>Meet Our Chef</Text>
            <Text style={local.specialty}>
              Contemporary cuisine · Seasonal inspiration
            </Text>
            <Text style={s.body}>{chefDescription}</Text>
          </View>
        </View>
        <View style={s.line} />
        {['TruffleBurrata', 'RaspberryMartini'].map((id, index) => {
          const dish = dishes.find(d => d.id === id)!;
          return (
            <View key={id} style={local.offer}>
              <Text style={s.label}>
                {index === 0 ? 'Dish' : 'Drink'} of the day
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Explore ${dish.name} in menu`}
                onPress={() => navigation.navigate('Menu')}
                style={[s.card, local.offerCard, stacked && s.stack]}
              >
                <Image
                  source={dish.image}
                  style={[local.offerImage, stacked && local.offerImageCompact]}
                />
                <View style={[local.offerCopy, stacked && s.natural]}>
                  <View style={s.between}>
                    <Text style={[s.subtitle, local.offerTitle]}>
                      {dish.name}
                    </Text>
                    <Text style={local.badge}>−20%</Text>
                  </View>
                  <Text style={local.ingredients}>{dish.ingredients}</Text>
                  <View style={s.row}>
                    <Text style={s.gold}>{money(priceOf(id))}</Text>
                    <Text style={local.oldPrice}>{money(dish.price)}</Text>
                  </View>
                </View>
              </Pressable>
            </View>
          );
        })}
        <View style={s.line} />
        <Button
          title="Explore the Menu"
          onPress={() => navigation.navigate('Menu')}
        />
        <Button
          title="Reserve a Table"
          variant="red"
          onPress={() => navigation.navigate('Booking')}
        />
        <Button
          title="Chef Masterclasses"
          variant="outline"
          onPress={() => navigation.navigate('Classes')}
        />
      </Content>
    </Screen>
  );
}
const local = StyleSheet.create({
  offerImageCompact: { width: '100%', aspectRatio: 1.8 },
  hero: { width: '100%', aspectRatio: 390 / 220 },
  red: { color: '#E53B48' },
  chef: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  chefImage: { width: 90, height: 112, borderRadius: 5 },
  chefCopy: { flex: 1, gap: 10 },
  specialty: { fontSize: 11, color: colors.gold, lineHeight: 18 },
  offer: { gap: 15, marginBottom: 12 },
  offerCard: { flexDirection: 'row', borderWidth: 0 },
  offerImage: { width: '33%', minHeight: 138 },
  offerCopy: { flex: 1, padding: 12, gap: 12 },
  offerTitle: { fontSize: 16, flex: 1 },
  badge: {
    fontSize: 10,
    color: colors.text,
    backgroundColor: colors.button,
    padding: 5,
    borderRadius: 4,
    fontWeight: '700',
  },
  ingredients: { fontSize: 11, lineHeight: 19, color: colors.muted },
  oldPrice: { textDecorationLine: 'line-through', color: colors.muted },
});
