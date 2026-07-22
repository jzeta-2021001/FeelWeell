// src/features/home/screens/HomeScreen.jsx
import React, { useEffect, useRef } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '../../../shared/components/common/Common';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../../shared/constants/theme';
import { useAuthStore } from '../../../shared/store/authStore';
import { useHomeSummary } from '../hooks/useHomeSummary';
import useNotificationChecks from '../../notifications/hooks/useNotificationChecks';
import { TiyuMascot } from '../../../shared/components/ui/TiyuMascot';

const QUICK_ACCESS = [
  {
    key: 'mood',
    title: 'Registrar mi ánimo',
    subtitle: '¿Cómo te sientes ahora?',
    icon: 'self-improvement',
    navigate: (navigation) => navigation.navigate('Ánimo', { screen: 'MoodScreen' }),
  },
  {
    key: 'exercises',
    title: 'Ejercicios de bienestar',
    subtitle: 'Respiración, meditación y más',
    icon: 'spa',
    navigate: (navigation) => navigation.navigate('Ejercicios', { screen: 'ExercisesList' }),
  },
  {
    key: 'chat',
    title: 'Habla con Tiyú',
    subtitle: 'Tu espacio de apoyo emocional',
    icon: 'forum',
    navigate: (navigation) => navigation.navigate('Tiyú'),
  },
  {
    key: 'content',
    title: 'Contenido educativo',
    subtitle: 'Artículos y videos de bienestar',
    icon: 'menu-book',
    navigate: (navigation) => navigation.navigate('ContentList'),
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const justLoggedIn = useAuthStore((state) => state.justLoggedIn);
  const clearJustLoggedIn = useAuthStore((state) => state.clearJustLoggedIn);
  const { dailyMessage, streak, dailyChallenge, unreadCount, loading, refresh, todayMood } =
    useHomeSummary(user?._id);

  useNotificationChecks({ todayMood, streak });

  const tiyuRef = useRef(null);

  // Tiyú saluda automáticamente justo después de un login exitoso.
  useEffect(() => {
    if (justLoggedIn) {
      tiyuRef.current?.sayHello();
      clearJustLoggedIn();
    }
  }, [justLoggedIn, clearJustLoggedIn]);

  const currentStreak = streak?.currentStreak || 0;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={COLORS.primary} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {user?.firstName || ''} 👋</Text>
        <TouchableOpacity
          style={styles.bellButton}
          onPress={() => navigation.navigate('Perfil', { screen: 'Notifications' })}
        >
          <MaterialIcons name="notifications" size={26} color={COLORS.text} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        ¿Cómo te <Text style={styles.titleAccent}>sientes</Text> hoy?
      </Text>

      {/* Hero: Tiyú + mensaje del día */}
      <Card style={[styles.card, styles.heroCard]}>
        <View style={styles.tiyuWrapper}>
          <TiyuMascot ref={tiyuRef} size={72} />
        </View>
        <View style={styles.heroTextWrapper}>
          <Text style={styles.heroLabel}>Inspiración del día</Text>
          {dailyMessage?.content ? (
            <Text style={styles.motivationText}>"{dailyMessage.content}"</Text>
          ) : (
            <Text style={styles.motivationText}>
              Tiyú te acompaña hoy. Cuéntale cómo te sientes cuando quieras.
            </Text>
          )}
        </View>
      </Card>

      {/* Tarjeta de racha */}
      <Card style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <MaterialIcons
              name="local-fire-department"
              size={24}
              color={currentStreak > 0 ? COLORS.secondary : COLORS.textMuted}
            />
            <Text style={styles.streakText}>
              {currentStreak > 0 ? `${currentStreak} días seguidos` : 'Empieza tu racha hoy'}
            </Text>
          </View>
        </View>
        <View style={styles.streakTrack}>
          <View
            style={[
              styles.streakFill,
              { width: `${Math.min((currentStreak / 7) * 100, 100)}%` },
            ]}
          />
        </View>
      </Card>

      {/* Reto diario */}
      {!!dailyChallenge && (
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Reto diario</Text>
          <Text style={styles.challengeName}>{dailyChallenge.name}</Text>
          <Text style={styles.challengeMeta}>
            {dailyChallenge.type} · {dailyChallenge.duration} min
          </Text>
          <TouchableOpacity
            style={styles.challengeButton}
            onPress={() =>
              navigation.navigate('Ejercicios', {
                screen: 'ExerciseDetail',
                params: { exerciseId: dailyChallenge._id },
              })
            }
          >
            <Text style={styles.challengeButtonText}>Ver reto</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* Accesos rápidos */}
      <Text style={styles.sectionTitle}>Accesos rápidos</Text>
      <View style={styles.quickAccessGrid}>
        {QUICK_ACCESS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.quickCard}
            onPress={() => item.navigate(navigation)}
          >
            <View style={styles.quickIconWrapper}>
              <MaterialIcons name={item.icon} size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.quickTitle}>{item.title}</Text>
            <Text style={styles.quickSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.footer}>Recuerda: cuidarte también es avanzar. 💜</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  bellButton: {
    padding: SPACING.xs,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  titleAccent: {
    color: COLORS.primary,
  },
  card: {
    marginBottom: SPACING.md,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tiyuWrapper: {
    width: 84,
    height: 84,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroTextWrapper: {
    flex: 1,
  },
  heroLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    color: COLORS.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  motivationText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  streakTrack: {
    marginTop: SPACING.sm,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primaryBg,
    overflow: 'hidden',
  },
  streakFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
  },
  cardLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  challengeName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  challengeMeta: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
    marginBottom: SPACING.sm,
  },
  challengeButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  challengeButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  quickCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  quickSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs / 2,
  },
  footer: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});