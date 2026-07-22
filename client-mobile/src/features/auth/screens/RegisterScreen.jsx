// src/features/auth/screens/RegisterScreen.jsx
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

const TERMS_TEXT = `Al registrarte en FeelWeell, aceptas los siguientes términos:

1. Uso de Inteligencia Artificial: FeelWeell utiliza inteligencia artificial (IA) para brindarte apoyo emocional personalizado, sugerencias de bienestar y análisis de tu estado de ánimo. Al registrarte, autorizas el uso de tus datos de bienestar para mejorar estas experiencias dentro de la plataforma.

2. Privacidad y datos: Tu información personal y registros emocionales son tratados con estricta confidencialidad. No compartimos tu información con terceros sin tu consentimiento, salvo cuando sea requerido por ley.

3. No reemplaza atención profesional: Las recomendaciones generadas por la IA de FeelWeell son de carácter orientativo y no sustituyen la atención de un profesional de salud mental.

4. Uso responsable: Te comprometes a utilizar la plataforma de forma responsable y veraz en los registros que realizas.

5. Menores de edad: El uso de FeelWeell está destinado a todas las edades, sin embargo, los menores de 18 años deben contar con la supervisión de un adulto responsable al utilizar la plataforma.`;

export default function RegisterScreen({ navigation }) {
  const { handleRegister, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      surname: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values) => {
    if (!acceptedTerms) {
      setPendingData(values);
      setShowTerms(true);
      return;
    }
    submitRegistration(values);
  };

  const submitRegistration = async (values) => {
    const payload = { ...values, acceptTerms: true };
    const result = await handleRegister(payload);
    if (result.success) {
      Alert.alert(
        'Cuenta creada',
        'Cuenta creada. Revisa tu correo para activarla antes de iniciar sesión.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    }
  };

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    setShowTerms(false);
    if (pendingData) {
      submitRegistration(pendingData);
      setPendingData(null);
    }
  };

  const handleRejectTerms = () => {
    setShowTerms(false);
    setPendingData(null);
    Alert.alert('Aviso', 'Debes aceptar los términos y condiciones para registrarte.');
  };

  const renderInput = (name, placeholder, rules, secure = false) => (
    <View style={styles.inputGroup} key={name}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, secure && { paddingRight: 48 }]}
              placeholder={placeholder}
              placeholderTextColor="#c7c6ee"
              secureTextEntry={secure && !showPassword}
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
            />
            {secure && (
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {errors[name] && <Text style={styles.errorText}>{errors[name].message}</Text>}
    </View>
  );

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
            <Image
              source={require('../../../../assets/FeellWeellLogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Registrate</Text>
            <Text style={styles.subtitle}>Ingresa los datos que se te piden</Text>
            
            <View style={{ alignItems: 'center', marginTop: 15 }}>
              <Image 
                source={require('../../../../assets/tiyu.jpeg')} 
                style={{ width: 90, height: 90, borderRadius: 45, marginBottom: 8, borderWidth: 2, borderColor: '#bfc3fb' }} 
              />
              <Text style={{ fontSize: 13, color: '#707070', fontWeight: 'bold' }}>¡Tiyú te ayudará!</Text>
            </View>
          </View>

          <View style={styles.form}>
            {renderInput('firstName', 'Nombres', { required: 'El nombre es obligatorio', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
            {renderInput('surname', 'Apellidos', { required: 'El apellido es obligatorio', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
            {renderInput('username', 'Usuario', { required: 'El usuario es obligatorio', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
            {renderInput('email', 'Correo electrónico', { required: 'El correo es obligatorio', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' } })}
            {renderInput('password', 'Contraseña', { required: 'La contraseña es obligatoria', minLength: { value: 8, message: 'Mínimo 8 caracteres' } }, true)}

            {!!error && <Text style={[styles.errorText, { textAlign: 'center' }]}>{error}</Text>}

            {acceptedTerms && (
              <Text style={styles.successText}>✓ Términos y condiciones aceptados</Text>
            )}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Creando...' : 'Crear cuenta'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Términos */}
      <Modal visible={showTerms} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Términos y Condiciones</Text>
              <Text style={styles.modalSubtitle}>Léelos antes de crear tu cuenta</Text>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.termsText}>{TERMS_TEXT}</Text>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptTerms}>
                <Text style={styles.acceptButtonText}>Acepto los términos y condiciones</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={handleRejectTerms}>
                <Text style={styles.rejectButtonText}>No acepto — no puedo registrarme</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 40,
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
  logo: {
    width: 130,
    height: 110,
    marginBottom: 8,
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
    gap: 24,
  },
  inputGroup: {
    gap: 4,
  },
  inputWrapper: {
    position: 'relative',
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
    paddingLeft: 12,
  },
  successText: {
    color: '#23845a',
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#6f6f6f',
  },
  loginLink: {
    fontSize: 18,
    fontWeight: '900',
    color: '#bdbdff',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7f0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2f3348',
  },
  modalSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9b9fb8',
    marginTop: 4,
  },
  modalBody: {
    padding: 24,
  },
  termsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#505570',
    lineHeight: 20,
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7f0',
    gap: 12,
  },
  acceptButton: {
    height: 48,
    backgroundColor: '#bfc3fb',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  rejectButton: {
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7f0',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#9b9fb8',
    fontSize: 16,
    fontWeight: '900',
  },
});
