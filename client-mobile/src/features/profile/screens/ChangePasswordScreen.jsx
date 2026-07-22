// client-mobile/src/features/profile/screens/ChangePasswordScreen.jsx
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../../shared/constants/theme';
import { useProfile } from '../hooks/useProfile';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { loading, changePassword } = useProfile();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      Alert.alert('Contraseña actualizada', 'Tu contraseña ha sido cambiada con éxito.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        <Text style={styles.backText}>Volver al perfil</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Cambiar contraseña</Text>
      <Text style={styles.subtitle}>
        Introduce tu contraseña actual y la nueva contraseña que deseas utilizar.
      </Text>

      <Card style={styles.card}>
        <Controller
          control={control}
          name="currentPassword"
          rules={{ required: 'Introduce tu contraseña actual' }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Contraseña actual"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              placeholder="••••••••"
              error={errors.currentPassword?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="newPassword"
          rules={{
            required: 'Introduce la nueva contraseña',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Nueva contraseña"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              placeholder="••••••••"
              error={errors.newPassword?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Confirma la nueva contraseña',
            validate: (value) => value === newPassword || 'Las contraseñas no coinciden',
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Confirmar nueva contraseña"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
            />
          )}
        />

        <Button
          title="Cambiar contraseña"
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={{ marginTop: SPACING.sm }}
        />
      </Card>
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
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  backText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  card: {
    gap: SPACING.xs,
  },
  inputLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderColor: COLORS.inputBorder,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.primaryBg,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
});
