import { Content } from '../components/ui';
import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  Button,
  Empty,
  Field,
  IconButton,
  Screen,
  Sheet,
} from '../components/ui';
import { Icon } from '../components/Icon';
import { assets } from '../data/assets';
import { useApp } from '../store/AppStore';
import { dateLabel, uid } from '../utils/calculations';
import { colors, styles as s } from '../theme';
function Stars({
  rating,
  onChange,
}: {
  rating: number;
  onChange?: (value: number) => void;
}) {
  return (
    <View style={local.stars}>
      {[1, 2, 3, 4, 5].map(n =>
        onChange ? (
          <Pressable
            key={n}
            accessibilityRole="radio"
            accessibilityLabel={`${n} stars`}
            accessibilityState={{ checked: n === rating }}
            onPress={() => onChange(n)}
            style={local.starButton}
          >
            <Icon name="star" size={25} filled={n <= rating} />
          </Pressable>
        ) : (
          <Icon
            key={n}
            name="star"
            size={15}
            filled={n <= Math.round(rating)}
            color={n <= Math.round(rating) ? colors.gold : colors.border}
          />
        ),
      )}
    </View>
  );
}
export function ReviewsScreen() {
  const { state, update } = useApp();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();
  const [error, setError] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState(state.profile?.name ?? '');
  const average = state.reviews.length
    ? state.reviews.reduce((sum, review) => sum + review.rating, 0) /
      state.reviews.length
    : null;
  const pickPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: true,
      maxWidth: 900,
      maxHeight: 900,
      quality: 0.7,
    });
    if (result.didCancel) {
      return;
    }
    if (result.errorCode) {
      Alert.alert(
        'Photo unavailable',
        result.errorMessage || 'Please allow photo access in Settings.',
      );
      return;
    }
    const asset = result.assets?.[0];
    if (asset?.base64) {
      setPhoto(`data:${asset.type || 'image/jpeg'};base64,${asset.base64}`);
    } else {
      Alert.alert('Photo unavailable', 'Please choose a different image.');
    }
  };
  const submit = async () => {
    if (!state.profile) {
      setProfileOpen(true);
      return;
    }
    if (!rating || text.trim().length < 3) {
      setError('Choose 1–5 stars and write at least 3 characters.');
      return;
    }
    await update(current => ({
      ...current,
      reviews: [
        {
          id: uid(),
          author: current.profile!.name,
          rating,
          text: text.trim(),
          photo,
          date: new Date().toISOString(),
        },
        ...current.reviews,
      ],
    }));
    setRating(0);
    setText('');
    setPhoto(undefined);
    setError('');
    Alert.alert(
      'Review saved',
      'Your review is saved on this device. It has not been published to Google Maps.',
    );
  };
  return (
    <Screen padded={false}>
      <Image source={assets.restaurant} style={local.hero} />
      <Content>
        <Text style={s.label}>Rama Casino · The Grand Table</Text>
        <Text style={s.title}>Guest Reviews</Text>
        <View style={s.row}>
          <Text style={local.average}>
            {average === null ? '—' : average.toFixed(1)}
          </Text>
          <View style={local.ratingCopy}>
            <Stars rating={average ?? 0} />
            <Text style={s.body}>
              {state.reviews.length
                ? `Based on ${state.reviews.length} local ${
                    state.reviews.length === 1 ? 'review' : 'reviews'
                  }`
                : 'No reviews on this device yet'}
            </Text>
          </View>
        </View>
        <Text style={s.body}>
          Google Maps rating is not connected. Reviews below are saved on this
          device.
        </Text>
        <View style={[s.card, s.pad]}>
          <View style={s.between}>
            <Text style={s.label}>Leave a review</Text>
            {state.profile && (
              <IconButton
                name="menu"
                label="Edit local profile"
                onPress={() => setProfileOpen(true)}
              />
            )}
          </View>
          {state.profile ? (
            <Text style={s.body}>Writing as {state.profile.name}</Text>
          ) : (
            <Button
              title="Create Local Profile"
              variant="outline"
              onPress={() => setProfileOpen(true)}
            />
          )}
          <Text style={s.body}>Your rating</Text>
          <Stars rating={rating} onChange={setRating} />
          <Field
            value={text}
            onChangeText={setText}
            multiline
            placeholder="Share your experience"
            maxLength={3000}
          />
          {photo && (
            <View>
              <Image source={{ uri: photo }} style={local.photo} />
              <View style={local.removePhoto}>
                <IconButton
                  name="close"
                  label="Remove photo"
                  onPress={() => setPhoto(undefined)}
                />
              </View>
            </View>
          )}
          <Button
            title={photo ? 'Change Photo' : 'Add Photo (optional)'}
            icon="photo"
            variant="outline"
            onPress={pickPhoto}
          />
          {Boolean(error) && (
            <Text accessibilityRole="alert" style={local.error}>
              {error}
            </Text>
          )}
          <Button title="Save Review" variant="red" onPress={submit} />
        </View>
        {state.reviews.length === 0 && (
          <Empty
            title="Be the first to share"
            text="Your dining memories and photos will appear here."
          />
        )}
        {state.reviews.map(review => (
          <View key={review.id} style={[s.card, s.pad]}>
            <View style={s.between}>
              <Text style={[s.text, local.author]}>{review.author}</Text>
              <Text style={local.date}>{dateLabel(review.date)}</Text>
            </View>
            <Stars rating={review.rating} />
            <Text style={s.body}>{review.text}</Text>
            {review.photo && (
              <Image source={{ uri: review.photo }} style={local.photo} />
            )}
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                Alert.alert(
                  'Delete review?',
                  'This review will be removed from this device.',
                  [
                    { text: 'Keep', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => {
                        update(current => ({
                          ...current,
                          reviews: current.reviews.filter(
                            r => r.id !== review.id,
                          ),
                        })).catch(() =>
                          Alert.alert('Unable to save', 'Please try again.'),
                        );
                      },
                    },
                  ],
                )
              }
              style={local.delete}
            >
              <Text style={local.deleteText}>Delete review</Text>
            </Pressable>
          </View>
        ))}
      </Content>
      <Sheet visible={profileOpen} onClose={() => setProfileOpen(false)}>
        <Text style={s.title}>Your Local Profile</Text>
        <Text style={s.body}>
          Choose the name shown on your reviews. This profile is stored on this
          device.
        </Text>
        <Field
          label="Your name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          autoComplete="name"
          maxLength={80}
        />
        <Button
          title="Save Profile"
          disabled={!name.trim()}
          onPress={async () => {
            await update(current => ({
              ...current,
              profile: { name: name.trim() },
            }));
            setProfileOpen(false);
          }}
        />
        {state.profile && (
          <Button
            title="Sign Out of Local Profile"
            variant="outline"
            onPress={async () => {
              await update(current => ({ ...current, profile: null }));
              setName('');
              setProfileOpen(false);
            }}
          />
        )}
      </Sheet>
    </Screen>
  );
}
const local = StyleSheet.create({
  hero: { width: '100%', aspectRatio: 390 / 200 },
  stars: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  starButton: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  average: { fontSize: 44, color: colors.goldLight, fontWeight: '700' },
  ratingCopy: { flex: 1, gap: 4 },
  photo: { width: '100%', aspectRatio: 1.5, borderRadius: 7 },
  removePhoto: { position: 'absolute', top: 8, right: 8 },
  error: { color: '#FF8791' },
  author: { flex: 1, fontWeight: '600' },
  date: { fontSize: 11, color: colors.muted },
  delete: { minHeight: 44, justifyContent: 'center', alignItems: 'flex-end' },
  deleteText: { color: '#D88D86', fontSize: 12 },
});
