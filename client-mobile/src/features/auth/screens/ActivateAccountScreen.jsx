// src/features/auth/screens/ActivateAccountScreen.jsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme';

export default function ActivateAccountScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="mark-email-unread" size={72} color={COLORS.primary} />
      <Text style={styles.title}>Revisa tu correo</Text>
      <Text style={styles.subtitle}>
        Te enviamos un enlace de activación a tu correo electrónico. Ábrelo desde tu
        navegador para activar tu cuenta antes de iniciar sesión.
      </Text>

      <Button
        title="Volver al inicio"
        variant="primary"
        onPress={() => navigation.navigate('Login')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  button: {
    width: '100%',
  },
});
