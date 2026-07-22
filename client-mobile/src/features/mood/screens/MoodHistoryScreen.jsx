// src/features/mood/screens/MoodHistoryScreen.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../../shared/constants/theme';
import { useMood } from '../hooks/useMood';

const EMOTION_EMOJI = {
  FELIZ: '😄', TRISTE: '😢', ANSIOSO: '😰', CALMADO: '😌',
  ENOJADO: '😠', EMOCIONADO: '🤩', FRUSTRADO: '😤', NEUTRAL: '😐',
  ABRUMADO: '😵', ESPERANZADO: '🌤️', AGOTADO: '🥱', AGRADECIDO: '🙏',
};

const FILTERS = [
  { label: 'Últimos 7 días', days: 7 },
  { label: 'Últimos 30 días', days: 30 },
  { label: 'Todo', days: null },
];

function buildDateParams(days) {
  if (!days) return {};
  const to = new Date().toISOString();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  return { from: fromDate.toISOString(), to };
}

export default function MoodHistoryScreen() {
  const { loading, moodHistory, fetchMoodHistory } = useMood();
  const [activeFilter, setActiveFilter] = useState(0);

  const loadHistory = useCallback(
    async (filterIdx) => {
      const params = buildDateParams(FILTERS[filterIdx].days);
      await fetchMoodHistory(params);
    },
    [fetchMoodHistory]
  );

  useEffect(() => {
    loadHistory(activeFilter);
  }, []);

  const handleFilter = (idx) => {
    setActiveFilter(idx);
    loadHistory(idx);
  };

  const renderItem = ({ item }) => {
    const emoji = EMOTION_EMOJI[item.emotion] || '😐';
    const date = item.date ? new Date(item.date).toLocaleDateString('es-GT', {
      day: 'numeric', month: 'short', year: 'numeric',
    }) : '';

    return (
      <View style={styles.entry}>
        <Text style={styles.entryEmoji}>{emoji}</Text>
        <View style={styles.entryInfo}>
          <Text style={styles.entryEmotion}>
            {item.emotion.charAt(0) + item.emotion.slice(1).toLowerCase()}
          </Text>
          <Text style={styles.entryMeta}>Intensidad: {item.intensity}/10 · {date}</Text>
          {!!item.note && <Text style={styles.entryNote}>{item.note}</Text>}
        </View>
      </View>
    );
  };

  if (loading && moodHistory.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Historial de ánimo</Text>

      {/* Filtros */}
      <View style={styles.filterRow}>
        {FILTERS.map((f, idx) => (
          <TouchableOpacity
            key={f.label}
            style={[styles.filterChip, activeFilter === idx && styles.filterChipActive]}
            onPress={() => handleFilter(idx)}
          >
            <Text style={[styles.filterLabel, activeFilter === idx && styles.filterLabelActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={moodHistory}
        keyExtractor={(item, idx) => item._id || String(idx)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={() => loadHistory(activeFilter)}
        ListEmptyComponent={
          <EmptyState
            icon="mood"
            title="Sin registros"
            subtitle="Aún no tienes entradas en este período."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
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
  entry: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  entryEmoji: {
    fontSize: 36,
    marginRight: SPACING.md,
  },
  entryInfo: {
    flex: 1,
  },
  entryEmotion: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  entryMeta: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  entryNote: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
});
