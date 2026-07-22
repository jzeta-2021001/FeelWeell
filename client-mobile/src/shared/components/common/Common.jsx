// src/shared/components/common/Common.jsx
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

export function LoadingSpinner({ style }) {
  return (
    <View style={[styles.spinnerWrapper, style]}>
      <ActivityIndicator color={COLORS.primary} size="large" />
    </View>
  );
}

export function EmptyState({ icon = 'info-outline', title, subtitle }) {
  return (
    <View style={styles.emptyWrapper}>
      <MaterialIcons name={icon} size={48} color={COLORS.textMuted} />
      {!!title && <Text style={styles.emptyTitle}>{title}</Text>}
      {!!subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const SEVERITY_COLORS = {
  INFO: COLORS.primaryLight,
  ADVERTENCIA: COLORS.warning,
  CRÍTICO: COLORS.critical,
};

export function SeverityBadge({ severity }) {
  const color = SEVERITY_COLORS[severity] || COLORS.primaryLight;
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{severity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  emptyTitle: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.card,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: '#ffffff',
  },
});
