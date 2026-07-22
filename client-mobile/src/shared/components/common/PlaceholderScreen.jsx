// src/shared/components/common/PlaceholderScreen.jsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_SIZE } from '../../constants/theme';

// Pantalla placeholder genérica: se usa mientras el resto de features
// (Ánimo, Ejercicios, Tiyú, Perfil, Contenido) se implementan en prompts posteriores.
export default function PlaceholderScreen({ route, title }) {
  const screenTitle = title || route?.name || 'Próximamente';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{screenTitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    fontWeight: '600',
  },
});
