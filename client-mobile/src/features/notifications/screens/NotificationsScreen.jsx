// client-mobile/src/features/notifications/screens/NotificationsScreen.jsx
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, EmptyState, SeverityBadge } from '../../../shared/components/common/Common';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../../shared/constants/theme';
import useNotifications from '../hooks/useNotifications';

const NOTIFICATION_ICONS = {
  MOOD_REMINDER: 'self-improvement',
  EXERCISE_REMINDER: 'spa',
  STREAK_ALERT: 'local-fire-department',
  GENERAL: 'notifications',
};

const NOTIFICATION_LABELS = {
  MOOD_REMINDER: 'Recordatorios de ánimo',
  EXERCISE_REMINDER: 'Recordatorios de ejercicios',
  STREAK_ALERT: 'Alertas de racha',
  GENERAL: 'Notificaciones generales',
};

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const {
    notifications,
    preferences,
    loading,
    fetchNotifications,
    markAsRead,
    fetchPreferences,
    updatePreferences,
    toggleType,
  } = useNotifications();

  const [reminderTime, setReminderTime] = useState('20:00');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, [fetchNotifications, fetchPreferences]);

  useEffect(() => {
    if (preferences) {
      if (preferences.reminderTime) setReminderTime(preferences.reminderTime);
      if (typeof preferences.pushEnabled === 'boolean') setPushEnabled(preferences.pushEnabled);
    }
  }, [preferences]);

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    try {
      await updatePreferences({ reminderTime, pushEnabled });
      Alert.alert('Preferencias guardadas', 'Tus preferencias de notificaciones han sido actualizadas.');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSavingPrefs(false);
    }
  };

  const renderNotificationItem = ({ item }) => {
    const iconName = NOTIFICATION_ICONS[item.type] || 'notifications';
    const isUnread = !item.read;
    const notificationId = item._id || item.id;

    return (
      <TouchableOpacity
        onPress={() => {
          if (isUnread && notificationId) {
            markAsRead(notificationId);
          }
        }}
        activeOpacity={0.8}
      >
        <Card style={[styles.card, isUnread && styles.unreadCard]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <MaterialIcons name={iconName} size={22} color={COLORS.primary} />
            </View>
            <View style={styles.cardHeaderRight}>
              {!!item.severity && <SeverityBadge severity={item.severity} />}
              {isUnread && <View style={styles.unreadDot} />}
            </View>
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardMessage}>{item.message}</Text>
          <Text style={styles.cardDate}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }) : 'Recientemente'}
          </Text>
        </Card>
      </TouchableOpacity>
    );
  };

  const activeTypes = preferences?.activeTypes || [
    'MOOD_REMINDER',
    'EXERCISE_REMINDER',
    'STREAK_ALERT',
    'GENERAL',
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchNotifications} tintColor={COLORS.primary} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Centro de Notificaciones</Text>
      </View>

      {/* Lista de Notificaciones */}
      {notifications.length === 0 ? (
        <EmptyState
          icon="notifications-none"
          title="Sin notificaciones"
          subtitle="No tienes notificaciones por el momento."
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id || item.id || Math.random().toString()}
          renderItem={renderNotificationItem}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Sección Preferencias */}
      <View style={styles.prefsSection}>
        <Text style={styles.sectionTitle}>Preferencias de notificaciones</Text>
        <Card style={styles.prefsCard}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Notificaciones push</Text>
              <Text style={styles.switchSublabel}>Recibir avisos en tu dispositivo</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={pushEnabled ? COLORS.primary : '#ffffff'}
            />
          </View>

          <View style={styles.divider} />

          <Text style={styles.inputLabel}>Hora del recordatorio diario (HH:mm)</Text>
          <TextInput
            style={styles.timeInput}
            value={reminderTime}
            onChangeText={setReminderTime}
            placeholder="20:00"
            keyboardType="numbers-and-punctuation"
            maxLength={5}
          />

          <View style={styles.divider} />

          <Text style={styles.subSectionTitle}>Tipos de notificaciones activos:</Text>
          {['MOOD_REMINDER', 'EXERCISE_REMINDER', 'STREAK_ALERT', 'GENERAL'].map((type) => {
            const isActive = activeTypes.includes(type);
            return (
              <View key={type} style={styles.typeRow}>
                <Text style={styles.typeLabel}>{NOTIFICATION_LABELS[type] || type}</Text>
                <Switch
                  value={isActive}
                  onValueChange={(val) => toggleType(type, val)}
                  trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                  thumbColor={isActive ? COLORS.primary : '#ffffff'}
                />
              </View>
            );
          })}

          <TouchableOpacity
            style={[styles.savePrefsButton, savingPrefs && styles.savePrefsDisabled]}
            onPress={handleSavePreferences}
            disabled={savingPrefs}
          >
            <Text style={styles.savePrefsText}>
              {savingPrefs ? 'Guardando...' : 'Guardar preferencias'}
            </Text>
          </TouchableOpacity>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  listContent: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.sm,
  },
  unreadCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  cardMessage: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  cardDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  prefsSection: {
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  prefsCard: {
    padding: SPACING.md,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTextContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  switchSublabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  timeInput: {
    backgroundColor: COLORS.inputBg,
    borderColor: COLORS.inputBorder,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    width: 100,
  },
  subSectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  typeLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  savePrefsButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  savePrefsDisabled: {
    backgroundColor: COLORS.primaryBg,
  },
  savePrefsText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
});
