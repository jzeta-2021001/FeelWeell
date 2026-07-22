// src/features/auth/screens/ResetPasswordScreen.jsx
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

export default function ResetPasswordScreen({ navigation }) {
  const { handleResetPassword, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { token: '', newPassword: '', confirmPassword: '' } });

  const newPassword = watch('newPassword');

  const onSubmit = async (values) => {
    const result = await handleResetPassword(values.token, values.newPassword);
    if (result.success) {
      Alert.alert(
        'Contraseña actualizada',
        'Tu contraseña ha sido actualizada con éxito.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Nueva clave</Text>
            <Text style={styles.subtitle}>Escribe tu nueva contraseña</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="token"
              rules={{ required: 'El código es obligatorio' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Código recibido por correo"
                    placeholderTextColor="#c7c6ee"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
            {errors.token && <Text style={styles.errorText}>{errors.token.message}</Text>}

            <Controller
              control={control}
              name="newPassword"
              rules={{ required: 'La contraseña es obligatoria', minLength: { value: 8, message: 'Mínimo 8 caracteres' } }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, { paddingRight: 48 }]}
                    placeholder="Nueva contraseña"
                    placeholderTextColor="#c7c6ee"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}

            <Controller
              control={control}
              name="confirmPassword"
              rules={{ required: 'Confirma tu contraseña', validate: v => v === newPassword || 'Las contraseñas no coinciden' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, { paddingRight: 48 }]}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor="#c7c6ee"
                    secureTextEntry={!showConfirm}
                    value={value}
                    onChangeText={onChange}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirm(!showConfirm)}
                  >
                    <MaterialIcons name={showConfirm ? 'visibility-off' : 'visibility'} size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Guardando...' : 'Cambiar contraseña'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backLink}>
            <Text style={styles.backText}>Volver al login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#cfd1ff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#f3f3f3',
    borderRadius: 36,
    paddingHorizontal: 24,
    paddingVertical: 36,
    shadowColor: '#5a558c',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.12,
    shadowRadius: 70,
    elevation: 10,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#c7c6ff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#8a8a8a',
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    justifyContent: 'center',
    position: 'relative',
  },
  input: {
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    paddingHorizontal: 28,
    fontSize: 16,
    fontWeight: '700',
    color: '#5f5f5f',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    height: '100%',
    justifyContent: 'center',
  },
  errorText: {
    color: '#d14b6d',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  submitButton: {
    height: 56,
    backgroundColor: '#bfc3fb',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  backLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  backText: {
    color: '#bdbdff',
    fontSize: 17,
    fontWeight: '900',
  },
});
