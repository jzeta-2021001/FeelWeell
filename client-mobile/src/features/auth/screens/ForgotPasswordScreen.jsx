// src/features/auth/screens/ForgotPasswordScreen.jsx
import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

export default function ForgotPasswordScreen({ navigation }) {
  const { handleForgotPassword, loading, error } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (values) => {
    const result = await handleForgotPassword(values.email);
    if (result.success) {
      Alert.alert(
        'Correo enviado',
        result.message || 'Se ha enviado un enlace a tu correo.',
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
            <Text style={styles.title}>Recuperar</Text>
            <Text style={styles.subtitle}>Ingresa tu correo electrónico</Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              rules={{ required: 'El correo es obligatorio' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#c7c6ee"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Enviando...' : 'Enviar correo'}
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
    marginTop: 16,
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
