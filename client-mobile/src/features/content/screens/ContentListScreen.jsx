// src/features/content/screens/ContentListScreen.jsx
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
import { useContent } from '../hooks/useContent';

const CATEGORIES = [
  'Todas',
  'ESTRÉS',
  'DEPRESIÓN',
  'DESARROLLO PERSONAL',
  'ANSIEDAD',
  'BIENESTAR GENERAL',
];

const CATEGORY_LABELS = {
  Todas: 'Todas',
  'ESTRÉS': 'Estrés',
  'DEPRESIÓN': 'Depresión',
  'DESARROLLO PERSONAL': 'Desarrollo Personal',
  'ANSIEDAD': 'Ansiedad',
  'BIENESTAR GENERAL': 'Bienestar General',
};

const TYPE_ICON = {
  VIDEO: 'play-circle',
  'ARTÍCULO': 'article',
  RECURSO: 'menu-book',
};

const TYPE_COLOR = {
  VIDEO: COLORS.secondary,
  'ARTÍCULO': COLORS.primary,
  RECURSO: '#4caf50',
};

export default function ContentListScreen() {
  const navigation = useNavigation();
  const { loading, contents, fetchContent, fetchContentByCategory } = useContent();
  const [activeCategory, setActiveCategory] = useState('Todas');

  const loadContent = useCallback(
    async (cat) => {
      if (cat === 'Todas') {
        await fetchContent();
      } else {
        await fetchContentByCategory(cat);
      }
    },
    [fetchContent, fetchContentByCategory]
  );

  useEffect(() => {
    loadContent('Todas');
  }, []);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    loadContent(cat);
  };

  const renderItem = ({ item }) => {
    const icon = TYPE_ICON[item.type] || 'article';
    const color = TYPE_COLOR[item.type] || COLORS.primary;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ContentDetail', { contentId: item._id })}
        activeOpacity={0.8}
      >
        <Card style={styles.card}>
          {item.photoUrl ? (
            <Image source={{ uri: item.photoUrl }} style={styles.cardImage} />
          ) : (
            <View style={[styles.cardImage, styles.imagePlaceholder]}>
              <MaterialIcons name={icon} size={36} color={COLORS.primaryLight} />
            </View>
          )}
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
            <View style={[styles.typeBadge, { backgroundColor: color }]}>
              <MaterialIcons name={icon} size={12} color="#ffffff" />
              <Text style={styles.typeBadgeText}>{item.type}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>Contenido educativo</Text>

      {/* Chips de categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => handleCategory(cat)}
            >
              <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                {CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading && contents.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={contents}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={() => loadContent(activeCategory)}
          ListEmptyComponent={
            <EmptyState
              icon="menu-book"
              title="Sin contenido"
              subtitle="No hay contenido disponible en esta categoría."
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
  card: {
    marginBottom: SPACING.sm,
    padding: 0,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  imagePlaceholder: {
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  typeBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: '#ffffff',
  },
});
