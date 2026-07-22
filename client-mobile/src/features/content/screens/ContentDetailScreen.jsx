// src/features/content/screens/ContentDetailScreen.jsx
import React, { useEffect } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LoadingSpinner } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../../shared/constants/theme';
import { useContent } from '../hooks/useContent';

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

const CATEGORY_COLORS = {
  'ESTRÉS': COLORS.warning,
  'DEPRESIÓN': COLORS.secondary,
  'DESARROLLO PERSONAL': COLORS.primary,
  'ANSIEDAD': '#9362d9',
  'BIENESTAR GENERAL': '#4caf50',
};

export default function ContentDetailScreen({ route }) {
  const { contentId } = route.params || {};
  const { loading, error, content, fetchContentById } = useContent();

  useEffect(() => {
    if (contentId) fetchContentById(contentId);
  }, [contentId]);

  const handleOpenLink = async () => {
    if (!content?.url) return;
    const supported = await Linking.canOpenURL(content.url);
    if (supported) {
      await Linking.openURL(content.url);
    } else {
      Alert.alert('Error', 'No se puede abrir el enlace.');
    }
  };

  if (loading && !content) {
    return <LoadingSpinner />;
  }

  if (!content) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'No se pudo cargar el contenido.'}</Text>
      </View>
    );
  }

  const typeIcon = TYPE_ICON[content.type] || 'article';
  const typeColor = TYPE_COLOR[content.type] || COLORS.primary;
  const categoryColor = CATEGORY_COLORS[content.category] || COLORS.primary;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Imagen */}
      {content.photoUrl ? (
        <Image source={{ uri: content.photoUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <MaterialIcons name={typeIcon} size={60} color={COLORS.primaryLight} />
        </View>
      )}

      {/* Badges */}
      <View style={styles.badgesRow}>
        <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
          <MaterialIcons name={typeIcon} size={12} color="#ffffff" />
          <Text style={styles.badgeText}>{content.type}</Text>
        </View>
        {!!content.category && (
          <View style={[styles.typeBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.badgeText}>{content.category}</Text>
          </View>
        )}
      </View>

      {/* Título */}
      <Text style={styles.title}>{content.title}</Text>

      {/* Descripción */}
      {!!content.description && (
        <Text style={styles.description}>{content.description}</Text>
      )}

      {/* Botón abrir enlace (VIDEO / RECURSO con url) */}
      {(content.type === 'VIDEO' || content.type === 'RECURSO') && !!content.url && (
        <Button
          title="Abrir enlace"
          onPress={handleOpenLink}
          variant="primary"
          style={styles.linkButton}
        />
      )}

      {/* Cuerpo del artículo */}
      {content.type === 'ARTÍCULO' && !!content.body && (
        <Text style={styles.body}>{content.body}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
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
  image: {
    width: '100%',
    height: 240,
  },
  imagePlaceholder: {
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    flexWrap: 'wrap',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: '#ffffff',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.lg,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  linkButton: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  body: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    lineHeight: 26,
  },
});
