// client-mobile/src/features/chat/components/ChatSuggestions.jsx
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SPACING } from '../../../shared/constants/theme';

const SUGGESTIONS = [
  'Hoy me siento un poco ansioso/a',
  'Quiero contarte cómo me fue hoy',
  '¿Qué puedo hacer para relajarme?',
  'Necesito hablar de algo que me preocupa',
];

export default function ChatSuggestions({ onSelectSuggestion }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {SUGGESTIONS.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.chip}
          onPress={() => onSelectSuggestion(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.chipText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  chip: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7f0',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: SPACING.xs,
  },
  chipText: {
    fontSize: 13,
    color: '#505570',
    fontWeight: '700',
  },
});
