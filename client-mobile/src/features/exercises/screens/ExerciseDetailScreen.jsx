// src/features/exercises/screens/ExerciseDetailScreen.jsx
import React, { useEffect } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LoadingSpinner } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../../shared/constants/theme';
import { useExercises } from '../hooks/useExercises';
import { useStreak } from '../../mood/hooks/useStreak';
import useNotifications from '../../notifications/hooks/useNotifications';

const TYPE_COLORS = {
  'RESPIRACIÓN': COLORS.primary,
  'MEDITACIÓN': COLORS.secondary,
  'YOGA': '#4caf50',
  'RELAJACIÓN': '#42a5f5',
  'MINDFULNESS': '#9362d9',
  'ESTIRAMIENTO': '#ff9800',
};

export default function ExerciseDetailScreen({ route }) {
  const { exerciseId, fromDailyChallenge } = route.params || {};
  const { loading, error, exercise, fetchExerciseById, completeExercise, saveExerciseForLater } =
    useExercises();
  const { updateStreak } = useStreak();
  const { scheduleExerciseReminder } = useNotifications();

  useEffect(() => {
    if (exerciseId) fetchExerciseById(exerciseId);
  }, [exerciseId]);

  const handleComplete = async () => {
    const result = await completeExercise(exerciseId);
    if (result) {
      await updateStreak();
      Alert.alert('¡Bien hecho! 🎉', 'Has completado este ejercicio. ¡Sigue así!');
    } else {
      Alert.alert('Error', error || 'No se pudo registrar el progreso.');
    }
  };

  const handleSave = async () => {
    const result = await saveExerciseForLater(exerciseId);
    if (result) {
      if (exercise) {
        scheduleExerciseReminder(exerciseId, exercise.title);
      }
      Alert.alert('Guardado', 'Ejercicio guardado para después.');
    } else {
      Alert.alert('Error', error || 'No se pudo guardar el ejercicio.');
    }
  };

  if (loading && !exercise) {
    return <LoadingSpinner />;
  }

  if (!exercise) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'No se pudo cargar el ejercicio.'}</Text>
      </View>
    );
  }

  const typeColor = TYPE_COLORS[exercise.type] || COLORS.primary;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Etiqueta de reto diario */}
      {!!fromDailyChallenge && (
        <View style={styles.challengeLabel}>
          <MaterialIcons name="emoji-events" size={16} color={COLORS.secondary} />
          <Text style={styles.challengeLabelText}>Reto de hoy</Text>
        </View>
      )}

      {/* Imagen */}
      {exercise.photoUrl ? (
        <Image source={{ uri: exercise.photoUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <MaterialIcons name="spa" size={60} color={COLORS.primaryLight} />
        </View>
      )}

      {/* Badge de tipo */}
      <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
        <Text style={styles.typeBadgeText}>{exercise.type}</Text>
      </View>

      {/* Título */}
      <Text style={styles.title}>{exercise.title}</Text>

      {/* Duración */}
      <View style={styles.durationRow}>
        <MaterialIcons name="schedule" size={18} color={COLORS.textMuted} />
        <Text style={styles.durationText}>{exercise.duration} min</Text>
      </View>

      {/* Descripción */}
      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.description}>{exercise.description}</Text>

      {/* Instrucciones */}
      {!!exercise.instructions && (
        <>
          <Text style={styles.sectionTitle}>Instrucciones</Text>
          <Text style={styles.instructions}>{exercise.instructions}</Text>
        </>
      )}

      {/* Botones */}
      <View style={styles.buttonsRow}>
        <Button
          title="Marcar como completado"
          onPress={handleComplete}
          variant="primary"
          loading={loading}
          style={styles.btnFlex}
        />
        <Button
          title="Guardar para después"
          onPress={handleSave}
          variant="secondary"
          loading={loading}
          style={styles.btnFlex}
        />
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
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
  },
  challengeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surfaceAlt,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.md,
  },
  challengeLabelText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  imagePlaceholder: {
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  typeBadgeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: '#ffffff',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  durationText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textMuted,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  instructions: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  buttonsRow: {
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  btnFlex: {
    width: '100%',
  },
});
