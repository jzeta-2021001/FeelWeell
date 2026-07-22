// src/features/mood/screens/MoodScreen.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../../shared/constants/theme';
import { useAuthStore } from '../../../shared/store/authStore';
import { useMood } from '../hooks/useMood';
import { useStreak } from '../hooks/useStreak';

const EMOTION_OPTIONS = [
  { value: 'FELIZ', emoji: '😄' },
  { value: 'TRISTE', emoji: '😢' },
  { value: 'ANSIOSO', emoji: '😰' },
  { value: 'CALMADO', emoji: '😌' },
  { value: 'ENOJADO', emoji: '😠' },
  { value: 'EMOCIONADO', emoji: '🤩' },
  { value: 'FRUSTRADO', emoji: '😤' },
  { value: 'NEUTRAL', emoji: '😐' },
  { value: 'ABRUMADO', emoji: '😵' },
  { value: 'ESPERANZADO', emoji: '🌤️' },
  { value: 'AGOTADO', emoji: '🥱' },
  { value: 'AGRADECIDO', emoji: '🙏' },
];

const EMOTION_LABEL = EMOTION_OPTIONS.reduce((acc, e) => {
  acc[e.value] = e;
  return acc;
}, {});

const INTENSITY_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function MoodScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const { loading: moodLoading, todayMood, fetchTodayMood, registerMood } = useMood();
  const { streak, fetchStreak, updateStreak } = useStreak();

  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    await Promise.all([fetchTodayMood(), fetchStreak()]);
  }, [fetchTodayMood, fetchStreak]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRegister = async () => {
    if (!selectedEmotion) return;
    setSaving(true);
    const result = await registerMood({
      emotion: selectedEmotion,
      intensity,
      ...(note.trim() ? { note: note.trim() } : {}),
    });
    setSaving(false);

    if (result?.conflict) {
      // 409: ya registrado hoy
      await fetchTodayMood();
      return;
    }

    if (result) {
      await updateStreak();
      Alert.alert('¡Gracias!', '¡Gracias por compartir cómo te sientes!');
      await fetchTodayMood();
    }
  };

  const currentStreak = streak?.currentStreak || 0;
  const maxStreak = streak?.maxStreak || 0;

  if (moodLoading && !todayMood) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.screenTitle}>Estado de ánimo</Text>

      {/* Racha */}
      <Card style={styles.streakCard}>
        <View style={styles.streakRow}>
          <MaterialIcons
            name="local-fire-department"
            size={28}
            color={currentStreak > 0 ? COLORS.secondary : COLORS.textMuted}
          />
          <View style={styles.streakInfo}>
            <Text style={styles.streakMain}>
              {currentStreak > 0 ? `${currentStreak} 🔥` : '0'}
            </Text>
            <Text style={styles.streakSub}>
              {currentStreak > 0 ? 'días seguidos' : 'Empieza tu racha hoy'}
            </Text>
          </View>
          <View style={styles.maxStreakBadge}>
            <Text style={styles.maxStreakLabel}>Máxima</Text>
            <Text style={styles.maxStreakValue}>{maxStreak}</Text>
          </View>
        </View>
      </Card>

      {/* Si ya registró hoy */}
      {todayMood?.registered ? (
        <Card style={styles.todayCard}>
          <View style={styles.todayRow}>
            <Text style={styles.todayEmoji}>
              {EMOTION_LABEL[todayMood.data?.emotion]?.emoji || '😐'}
            </Text>
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.todayEmotion}>{todayMood.data?.emotion || '—'}</Text>
              <Text style={styles.todayIntensity}>Intensidad: {todayMood.data?.intensity}/10</Text>
              {!!todayMood.data?.note && (
                <Text style={styles.todayNote}>{todayMood.data.note}</Text>
              )}
            </View>
          </View>
          <Text style={styles.alreadyMsg}>Ya registraste cómo te sientes hoy. ¡Vuelve mañana!</Text>
        </Card>
      ) : (
        <>
          {/* Form de registro */}
          <Text style={styles.sectionTitle}>¿Cómo te sientes ahora?</Text>

          {/* Grid de emociones */}
          <View style={styles.emotionGrid}>
            {EMOTION_OPTIONS.map((opt) => {
              const selected = selectedEmotion === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.emotionChip, selected && styles.emotionChipSelected]}
                  onPress={() => setSelectedEmotion(opt.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.emotionEmoji}>{opt.emoji}</Text>
                  <Text style={[styles.emotionLabel, selected && styles.emotionLabelSelected]}>
                    {opt.value.charAt(0) + opt.value.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Intensidad */}
          <Text style={styles.sectionTitle}>Intensidad: {intensity}/10</Text>
          <View style={styles.intensityRow}>
            {INTENSITY_VALUES.map((v) => {
              const sel = intensity === v;
              return (
                <TouchableOpacity
                  key={v}
                  style={[styles.intensityBtn, sel && styles.intensityBtnSelected]}
                  onPress={() => setIntensity(v)}
                >
                  <Text style={[styles.intensityText, sel && styles.intensityTextSelected]}>
                    {v}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Nota */}
          <Text style={styles.sectionTitle}>Nota (opcional)</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="¿Algo más que quieras compartir?"
            placeholderTextColor={COLORS.textMuted}
            multiline
            maxLength={500}
            numberOfLines={4}
          />
          <Text style={styles.charCount}>{note.length}/500</Text>

          <Button
            title="Guardar"
            onPress={handleRegister}
            variant="primary"
            loading={saving}
            disabled={!selectedEmotion || saving}
            style={styles.saveButton}
          />
        </>
      )}

      {/* Botón ver historial */}
      <TouchableOpacity
        style={styles.historyBtn}
        onPress={() => navigation.navigate('MoodHistory')}
      >
        <MaterialIcons name="history" size={18} color={COLORS.primary} />
        <Text style={styles.historyBtnText}>Ver historial</Text>
      </TouchableOpacity>
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
  screenTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  streakCard: {
    marginBottom: SPACING.lg,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  streakInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  streakMain: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  streakSub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  maxStreakBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  maxStreakLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  maxStreakValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  todayCard: {
    marginBottom: SPACING.md,
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  todayEmoji: {
    fontSize: 48,
  },
  todayEmotion: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  todayIntensity: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  todayNote: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  alreadyMsg: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  emotionChip: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '22%',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  emotionChipSelected: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primary,
  },
  emotionEmoji: {
    fontSize: 26,
  },
  emotionLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  emotionLabelSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  intensityRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
  },
  intensityBtn: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  intensityBtnSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  intensityText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  intensityTextSelected: {
    color: '#ffffff',
  },
  noteInput: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: SPACING.xs,
  },
  charCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'right',
    marginBottom: SPACING.md,
  },
  saveButton: {
    marginTop: SPACING.sm,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.lg,
    padding: SPACING.sm,
  },
  historyBtnText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
