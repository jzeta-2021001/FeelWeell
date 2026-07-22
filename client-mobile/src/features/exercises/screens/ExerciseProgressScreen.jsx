// src/features/exercises/screens/ExerciseProgressScreen.jsx
import React, { useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../../shared/constants/theme';
import { useExercises } from '../hooks/useExercises';

export default function ExerciseProgressScreen() {
  const navigation = useNavigation();
  const { loading, progress, fetchUserProgress } = useExercises();

  useEffect(() => {
    fetchUserProgress();
  }, []);

  if (loading && !progress) {
    return <LoadingSpinner />;
  }

  const completed = progress?.completed || [];
  const saved = progress?.saved || [];
  const totalCompleted = progress?.totalCompleted ?? completed.length;

  const renderExerciseItem = ({ item, fromSaved }) => (
    <TouchableOpacity
      style={styles.exerciseRow}
      onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item._id || item.exerciseId })}
      activeOpacity={0.8}
    >
      <View style={styles.exerciseIconBox}>
        <MaterialIcons name="spa" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName} numberOfLines={1}>
          {item.title || item.exerciseTitle || 'Ejercicio'}
        </Text>
        {item.completedAt && !fromSaved && (
          <Text style={styles.exerciseMeta}>
            {new Date(item.completedAt).toLocaleDateString('es-GT', {
              day: 'numeric',
              month: 'short',
            })}
          </Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  const hasNoProgress = completed.length === 0 && saved.length === 0;

  if (hasNoProgress) {
    return (
      <EmptyState
        icon="spa"
        title="Sin progreso todavía"
        subtitle="Completa o guarda ejercicios para verlos aquí."
      />
    );
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshing={loading}
      onRefresh={fetchUserProgress}
      data={[]}
      keyExtractor={() => 'header'}
      renderItem={null}
      ListHeaderComponent={
        <>
          <Text style={styles.screenTitle}>Mi progreso</Text>

          {/* Completados */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="check-circle" size={22} color={COLORS.success} />
              <Text style={styles.sectionTitle}>Completados</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{totalCompleted}</Text>
              </View>
            </View>
            {completed.length === 0 ? (
              <Text style={styles.emptyMsg}>Aún no has completado ningún ejercicio.</Text>
            ) : (
              completed.slice(0, 10).map((item, idx) => (
                <View key={item._id || idx}>
                  {renderExerciseItem({ item, fromSaved: false })}
                </View>
              ))
            )}
          </Card>

          {/* Guardados */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="bookmark" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Guardados para después</Text>
            </View>
            {saved.length === 0 ? (
              <Text style={styles.emptyMsg}>No tienes ejercicios guardados.</Text>
            ) : (
              saved.map((item, idx) => (
                <View key={item._id || idx}>
                  {renderExerciseItem({ item, fromSaved: true })}
                </View>
              ))
            )}
          </Card>
        </>
      }
    />
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
  section: {
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  countBadge: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  countText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  exerciseIconBox: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  exerciseMeta: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  emptyMsg: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: SPACING.sm,
  },
});
