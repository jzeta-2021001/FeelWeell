// src/features/questionnaire/screens/InitialQuestionnaireScreen.jsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LoadingSpinner } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../../shared/constants/theme';
import { useQuestionnaire } from '../hooks/useQuestionnaire';

const PROFILE_CONFIG = {
  ALEGRE: { label: 'Alegre', emoji: '😊', color: COLORS.success },
  NEUTRAL: { label: 'Neutral', emoji: '😐', color: COLORS.primary },
  PROBLEMA_DE_ANSIEDAD: { label: 'Ansiedad', emoji: '😰', color: COLORS.warning },
  PROBLEMA_DE_TRISTEZA: { label: 'Tristeza', emoji: '😢', color: COLORS.secondary },
  SIN_PERFIL: { label: 'Sin perfil', emoji: '❓', color: COLORS.textMuted },
};

export default function InitialQuestionnaireScreen({ onComplete }) {
  const { loading, error, profile, questions, submitResult, fetchProfile, fetchQuestionnaire, submitAnswers } =
    useQuestionnaire();

  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState('loading'); // 'loading' | 'questions' | 'result'
  const [resultProfile, setResultProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const profileData = await fetchProfile();
      if (profileData?.completedQuestionnaire) {
        onComplete?.();
        return;
      }
      await fetchQuestionnaire();
      setPhase('questions');
    })();
  }, []);

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.questionId] !== undefined);

  const handleSubmit = async () => {
    const answersArray = questions.map((q) => ({
      questionId: q.questionId,
      answer: answers[q.questionId],
    }));
    const result = await submitAnswers(answersArray);
    if (result) {
      setResultProfile(result.emotionalProfile || result.data?.emotionalProfile || 'SIN_PERFIL');
      setPhase('result');
    } else {
      Alert.alert('Error', 'No se pudo enviar el cuestionario. Intenta de nuevo.');
    }
  };

  const handleStart = () => {
    onComplete?.();
  };

  if (phase === 'loading' || (loading && phase === 'questions' && questions.length === 0)) {
    return <LoadingSpinner />;
  }

  if (phase === 'result') {
    const config = PROFILE_CONFIG[resultProfile] || PROFILE_CONFIG.SIN_PERFIL;
    return (
      <View style={styles.resultScreen}>
        <Text style={styles.resultEmoji}>{config.emoji}</Text>
        <Text style={[styles.resultLabel, { color: config.color }]}>{config.label}</Text>
        <Text style={styles.resultMessage}>
          Este es tu punto de partida. FeelWeel se adapta a ti.
        </Text>
        <Button title="Empezar" onPress={handleStart} variant="primary" style={styles.startButton} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <MaterialIcons name="psychology" size={36} color={COLORS.primary} />
        <Text style={styles.headerTitle}>Cuestionario inicial</Text>
      </View>
      <Text style={styles.headerSubtitle}>
        Responde estas preguntas para que FeelWeel pueda acompañarte mejor.
      </Text>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      {questions.map((q, idx) => (
        <View key={q.questionId} style={styles.questionBlock}>
          <Text style={styles.questionNumber}>Pregunta {idx + 1}</Text>
          <Text style={styles.questionText}>{q.text}</Text>
          <View style={styles.optionsRow}>
            {(q.options || []).map((opt) => {
              const selected = answers[q.questionId] === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionChip, selected && styles.optionChipSelected]}
                  onPress={() => setAnswers((prev) => ({ ...prev, [q.questionId]: opt.value }))}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <Button
        title="Continuar"
        onPress={handleSubmit}
        variant="primary"
        loading={loading}
        disabled={!allAnswered || loading}
        style={styles.submitButton}
      />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xl,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZE.sm,
  },
  questionBlock: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  questionNumber: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  questionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.primaryBg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  optionLabelSelected: {
    color: '#ffffff',
  },
  submitButton: {
    marginTop: SPACING.lg,
  },
  // Result
  resultScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  resultEmoji: {
    fontSize: 72,
    marginBottom: SPACING.md,
  },
  resultLabel: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  resultMessage: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  startButton: {
    width: '100%',
  },
});
