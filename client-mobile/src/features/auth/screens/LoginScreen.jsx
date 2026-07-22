// src/features/auth/screens/LoginScreen.jsx
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen({ navigation }) {
  const { handleLogin, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const onSubmit = async (values) => {
    await handleLogin(values);
  };

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Image
                source={require('../../../../assets/FeellWeellLogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>FeelWeell</Text>
              <Text style={styles.subtitle}>Tu espacio de bienestar emocional</Text>

              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Image
                  source={require('../../../../assets/tiyu.jpeg')}
                  style={{ width: 84, height: 84, borderRadius: 42, marginBottom: 6, borderWidth: 2, borderColor: '#bfc3fb' }}
                />
                <Text style={{ fontSize: 13, color: '#707070', fontWeight: 'bold' }}>¡Tiyú te da la bienvenida!</Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo o usuario</Text>
                <Controller
                  control={control}
                  name="username"
                  rules={{ required: 'El correo o usuario es obligatorio' }}
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        value={value}
                        onChangeText={onChange}
                      />
                    </View>
                  )}
                />
                {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <Controller
                  control={control}
                  name="password"
                  rules={{ required: 'La contraseña es obligatoria' }}
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={[styles.input, { paddingRight: 48 }]}
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
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
              </View>

              {!!error && <Text style={[styles.errorText, { marginBottom: 0 }]}>{error}</Text>}

              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotLink}>
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Iniciando...' : 'Iniciar sesión'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Regístrate aquí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#cfd1ff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#f3f3f3',
    borderRadius: 36,
    paddingHorizontal: 22,
    paddingVertical: 28,
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
    marginBottom: 22,
  },
  logo: {
    width: 110,
    height: 92,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#c7c6ff',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6f6f6f',
    marginTop: 2,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '800',
    color: '#707070',
    paddingLeft: 8,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 26,
    paddingHorizontal: 26,
    fontSize: 15,
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
  },
  forgotLink: {
    marginTop: 6,
    alignItems: 'center',
  },
  forgotText: {
    color: '#bdbdff',
    fontSize: 15,
    fontWeight: '900',
  },
  submitButton: {
    height: 52,
    backgroundColor: '#bfc3fb',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 18,
    marginHorizontal: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#d9e0ee',
  },
  dividerText: {
    color: '#777777',
    fontWeight: '900',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#6f6f6f',
  },
  registerLink: {
    fontSize: 16,
    fontWeight: '900',
    color: '#bdbdff',
  },
});