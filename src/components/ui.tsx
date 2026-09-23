import React, { Children, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, styles as s } from '../theme';
import { Icon, IconName } from './Icon';
import { Entrance } from './Entrance';
import { useResponsive } from '../hooks/useResponsive';

export function Button({
  title,
  onPress,
  variant = 'gold',
  disabled = false,
  icon,
}: {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: 'gold' | 'red' | 'outline';
  disabled?: boolean;
  icon?: IconName;
}) {
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (busy || disabled) {
      return;
    }
    setBusy(true);
    try {
      await onPress();
    } catch (error) {
      Alert.alert(
        'Unable to save',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };
  const foreground =
    variant === 'gold'
      ? '#160D08'
      : variant === 'red'
      ? colors.text
      : colors.gold;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || busy }}
      disabled={disabled || busy}
      onPress={run}
      style={({ pressed }) => [
        local.button,
        variant === 'outline' && local.outline,
        { opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
      ]}
    >
      <LinearGradient
        colors={
          variant === 'gold'
            ? ['#F3C453', '#E6AA2D']
            : variant === 'red'
            ? ['#C72B37', '#AD1B29']
            : [colors.background, colors.background]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {busy ? (
        <ActivityIndicator color={foreground} />
      ) : (
        <>
          {icon && <Icon name={icon} size={19} color={foreground} />}
          <Text style={[local.buttonText, { color: foreground }]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
export function IconButton({
  name,
  label,
  onPress,
  filled = false,
  color = colors.gold,
}: {
  name: IconName;
  label: string;
  onPress: () => void;
  filled?: boolean;
  color?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={local.iconButton}
    >
      <Icon name={name} filled={filled} color={color} />
    </Pressable>
  );
}
function flattenContent(children: React.ReactNode): React.ReactNode[] {
  return Children.toArray(children).flatMap(child =>
    React.isValidElement<{ children?: React.ReactNode }>(child) &&
    child.type === React.Fragment
      ? flattenContent(child.props.children)
      : [child],
  );
}
export function Content({ children }: { children: React.ReactNode }) {
  const { contentStyle } = useResponsive();
  return (
    <View style={[s.content, contentStyle]}>
      {flattenContent(children).map((child, index) =>
        React.isValidElement(child) && child.type === Sheet ? (
          child
        ) : (
          <Entrance
            key={`${index}-${React.isValidElement(child) ? child.key : ''}`}
            delay={index * 45}
            direction={index === 0 ? 'down' : 'up'}
          >
            {child}
          </Entrance>
        ),
      )}
    </View>
  );
}
export function Screen({
  children,
  padded = true,
}: {
  children: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={s.fill}>
      <KeyboardAvoidingView
        style={s.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={local.unpadded}
        >
          {padded ? <Content>{children}</Content> : children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function Field({
  label,
  ...props
}: TextInputProps & { label?: string }) {
  return (
    <View style={local.field}>
      {label && <Text style={local.fieldLabel}>{label}</Text>}
      <TextInput
        placeholderTextColor="#78645B"
        selectionColor={colors.gold}
        {...props}
        accessibilityLabel={
          props.accessibilityLabel ?? label ?? props.placeholder
        }
        style={[s.input, props.multiline && local.multiline, props.style]}
      />
    </View>
  );
}
export function Heading({
  title,
  back,
  right,
}: {
  title: string;
  back?: () => void;
  right?: React.ReactNode;
}) {
  const { compact } = useResponsive();
  return (
    <View style={s.between}>
      <View style={[s.row, local.heading]}>
        {back && <IconButton name="back" label="Go back" onPress={back} />}
        <Text style={[s.title, local.heading, compact && local.compactTitle]}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}
export function Empty({
  title,
  text,
  icon = 'review',
}: {
  title: string;
  text: string;
  icon?: IconName;
}) {
  return (
    <View style={[s.card, local.empty]}>
      <Icon name={icon} size={36} />
      <Text style={s.subtitle}>{title}</Text>
      <Text style={[s.body, local.center]}>{text}</Text>
    </View>
  );
}
export function Sheet({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { compact } = useResponsive();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={local.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={local.modalKeyboard}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={local.modalScroll}
          >
            <Entrance
              direction="up"
              style={[
                s.card,
                s.pad,
                local.modalCard,
                compact && local.compactModal,
              ]}
            >
              <View style={local.close}>
                <IconButton
                  name="close"
                  label="Close dialog"
                  onPress={onClose}
                />
              </View>
              {children}
            </Entrance>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
export function Quantity({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (delta: number) => Promise<void>;
  label: string;
}) {
  const change = (delta: number) => {
    onChange(delta).catch(() =>
      Alert.alert('Unable to save', 'Please try again.'),
    );
  };
  return (
    <View style={local.quantity}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Remove one ${label}`}
        disabled={!value}
        onPress={() => change(-1)}
        style={local.step}
      >
        <Icon
          name="minus"
          size={15}
          color={value ? colors.muted : colors.border}
        />
      </Pressable>
      <Text style={s.text}>{value}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Add one ${label}`}
        disabled={value >= 99}
        onPress={() => change(1)}
        style={local.step}
      >
        <Icon name="plus" size={15} />
      </Pressable>
    </View>
  );
}
const local = StyleSheet.create({
  button: {
    minHeight: 51,
    flexShrink: 0,
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  compactTitle: { fontSize: 24 },
  compactModal: { padding: 16, gap: 16 },
  buttonText: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  outline: { borderWidth: 1, borderColor: colors.gold },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  field: { gap: 8, flexGrow: 1, minWidth: 0 },
  fieldLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: colors.muted,
    textTransform: 'uppercase',
  },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
  unpadded: { flexGrow: 1 },
  heading: { flex: 1 },
  empty: { padding: 28, alignItems: 'center', gap: 12 },
  center: { textAlign: 'center' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'center',
  },
  modalKeyboard: { flex: 1 },
  modalScroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  modalCard: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    padding: 24,
    gap: 20,
  },
  close: { alignItems: 'flex-end' },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    gap: 8,
  },
  step: {
    minWidth: 42,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
