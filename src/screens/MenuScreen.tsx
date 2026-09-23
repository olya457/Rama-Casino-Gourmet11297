import { Entrance } from '../components/Entrance';
import { useResponsive } from '../hooks/useResponsive';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootParams, TabParams } from '../navigation/types';
import { categories, Category, dishes } from '../data/menu';
import { Heading, IconButton, Quantity } from '../components/ui';
import { Icon } from '../components/Icon';
import { priceOf, useApp } from '../store/AppStore';
import { money } from '../utils/calculations';
import { colors, styles as s } from '../theme';
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParams, 'Menu'>,
  NativeStackScreenProps<RootParams>
>;
export function MenuScreen({ navigation }: Props) {
  const { contentStyle, spacing } = useResponsive();
  const [category, setCategory] = useState<Category>('Starters');
  const { state, changeQuantity } = useApp();
  const count = Object.values(state.cart).reduce((sum, q) => sum + q, 0);
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.fill}>
      <Entrance
        direction="down"
        style={[local.header, { paddingHorizontal: spacing }]}
      >
        <Heading
          title="Menu"
          right={
            <View>
              <IconButton
                name="cart"
                label={`Open cart, ${count} items`}
                onPress={() => navigation.navigate('Cart')}
              />
              {count > 0 && (
                <View style={local.badge}>
                  <Text style={local.badgeText}>{count}</Text>
                </View>
              )}
            </View>
          }
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={local.tabs}
        >
          {categories.map(cat => (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: category === cat }}
              onPress={() => setCategory(cat)}
              key={cat}
              style={[local.tab, category === cat && local.activeTab]}
            >
              <Text
                style={[local.tabText, category === cat && local.activeText]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Entrance>
      <FlatList
        key={category}
        data={dishes.filter(d => d.category === category)}
        keyExtractor={d => d.id}
        contentContainerStyle={[s.content, contentStyle]}
        renderItem={({ item, index }) => (
          <Entrance
            direction="right"
            delay={index * 50}
            style={[s.card, local.dish]}
          >
            <Image source={item.image} style={local.dishImage} />
            <View style={s.pad}>
              <Text style={s.subtitle}>{item.name}</Text>
              <Text style={s.body}>{item.ingredients}</Text>
              <View style={s.between}>
                <View style={[s.row, s.wrap]}>
                  <Text style={s.gold}>{money(priceOf(item.id))}</Text>
                  {priceOf(item.id) !== item.price && (
                    <Text style={local.old}>{money(item.price)}</Text>
                  )}
                </View>
                <View style={[s.row, s.wrap]}>
                  <Icon name="clock" size={14} color={colors.muted} />
                  <Text style={s.body}>{item.minutes} min</Text>
                </View>
              </View>
              <View style={[s.row, s.wrap]}>
                <Text style={s.body}>Quantity</Text>
                <Quantity
                  label={item.name}
                  value={state.cart[item.id] ?? 0}
                  onChange={delta => changeQuantity(item.id, delta)}
                />
              </View>
            </View>
          </Entrance>
        )}
      />
    </SafeAreaView>
  );
}
const local = StyleSheet.create({
  header: {
    padding: 20,
    paddingBottom: 0,
    gap: 16,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  tabs: { flexGrow: 1, borderBottomWidth: 1, borderColor: colors.border },
  tab: { paddingHorizontal: 15, paddingVertical: 17, minHeight: 48 },
  activeTab: { borderBottomWidth: 2, borderColor: colors.gold },
  tabText: { color: colors.muted, fontSize: 12 },
  activeText: { color: colors.gold, fontWeight: '600' },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    borderRadius: 12,
    backgroundColor: colors.red,
    minWidth: 20,
    padding: 3,
    alignItems: 'center',
  },
  badgeText: { color: colors.text, fontSize: 11 },
  dish: { borderWidth: 0 },
  dishImage: { width: '100%', aspectRatio: 1.36 },
  old: {
    textDecorationLine: 'line-through',
    color: colors.muted,
    fontSize: 12,
  },
});
