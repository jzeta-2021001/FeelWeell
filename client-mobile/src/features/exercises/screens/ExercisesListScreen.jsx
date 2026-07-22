// src/features/exercises/screens/ExercisesListScreen.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../../shared/constants/theme';
import { useExercises } from '../hooks/useExercises';

const TYPE_COLORS = {
  'RESPIRACIÓN': COLORS.primary,
  'MEDITACIÓN': COLORS.secondary,
  'YOGA': '#4caf50',
  'RELAJACIÓN': '#42a5f5',
  'MINDFULNESS': '#9362d9',
  'ESTIRAMIENTO': '#ff9800',
};

const TYPE_FILTERS = ['Todos', 'RESPIRACIÓN', 'MEDITACIÓN', 'YOGA', 'RELAJACIÓN', 'MINDFULNESS', 'ESTIRAMIENTO'];
const TYPE_LABELS = {
  Todos: 'Todos',
  RESPIRACIÓN: 'Respiración',
  MEDITACIÓN: 'Meditación',
  YOGA: 'Yoga',
  RELAJACIÓN: 'Relajación',
  MINDFULNESS: 'Mindfulness',
  ESTIRAMIENTO: 'Estiramiento',
};

export default function ExercisesListScreen() {
  const navigation = useNavigation();
  const { loading, exercises, recommended, fetchExercises, fetchRecommended } = useExercises();
  const [activeFilter, setActiveFilter] = useState('Todos');

  const loadData = useCallback(async () => {
    await Promise.all([
      fetchRecommended(),
      fetchExercises(activeFilter === 'Todos' ? undefined : activeFilter),
    ]);
  }, [activeFilter, fetchExercises, fetchRecommended]);

  useEffect(() => {
    loadData();
  }, []);

  const handleFilter = (type) => {
    setActiveFilter(type);
    fetchExercises(type === 'Todos' ? undefined : type);
  };

  const renderExercise = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item._id })}
      activeOpacity={0.8}
    >
      <Card style={styles.exerciseCard}>
        {item.photoUrl ? (
          <Image source={{ uri: item.photoUrl }} style={styles.exerciseImage} />
        ) : (
          <View style={[styles.exerciseImage, styles.exerciseImagePlaceholder]}>
            <MaterialIcons name="spa" size={36} color={COLORS.primaryLight} />
          </View>
        )}
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.exerciseMeta}>
            <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[item.type] || COLORS.primary }]}>
              <Text style={styles.typeBadgeText}>{item.type}</Text>
            </View>
            <View style={styles.durationRow}>
              <MaterialIcons name="schedule" size={14} color={COLORS.textMuted} />
              <Text style={styles.durationText}>{item.duration} min</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderRecommended = () => {
    if (!recommended || recommended.length === 0) return null;
    return (
      <View style={styles.recommendedSection}>
        <Text style={styles.sectionTitle}>Recomendado para ti</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendedRow}>
          {recommended.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.recommendedCard}
              onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item._id })}
              activeOpacity={0.8}
            >
              {item.photoUrl ? (
                <Image source={{ uri: item.photoUrl }} style={styles.recommendedImage} />
              ) : (
                <View style={[styles.recommendedImage, styles.exerciseImagePlaceholder]}>
                  <MaterialIcons name="spa" size={28} color={COLORS.primaryLight} />
                </View>
              )}
              <Text style={styles.recommendedTitle} numberOfLines={2}>{item.title}</Text>
              <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[item.type] || COLORS.primary, alignSelf: 'flex-start' }]}>
                <Text style={styles.typeBadgeText}>{item.type}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Ejercicios</Text>

      {renderRecommended()}

      {/* Filtros de tipo */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {TYPE_FILTERS.map((type) => {
          const active = activeFilter === type;
          return (
            <TouchableOpacity
              key={type}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => handleFilter(type)}
            >
              <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                {TYPE_LABELS[type]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading && exercises.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item._id}
          renderItem={renderExercise}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={() => fetchExercises(activeFilter === 'Todos' ? undefined : activeFilter)}
          ListEmptyComponent={
            <EmptyState
              icon="spa"
              title="Sin ejercicios"
              subtitle="No hay ejercicios para este filtro."
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  recommendedSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  recommendedRow: {
    gap: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  recommendedCard: {
    width: 160,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    ...SHADOWS.card,
  },
  recommendedImage: {
    width: '100%',
    height: 90,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
  recommendedTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  filtersRow: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.primaryBg,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  filterLabelActive: {
    color: '#ffffff',
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  exerciseCard: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  exerciseImage: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
  },
  exerciseImagePlaceholder: {
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  exerciseTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  typeBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: '#ffffff',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  durationText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
});
