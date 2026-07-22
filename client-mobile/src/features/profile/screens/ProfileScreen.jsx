// client-mobile/src/features/profile/screens/ProfileScreen.jsx
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../../shared/constants/theme';
import { useAuthStore } from '../../../shared/store/authStore';
import { useProfile } from '../hooks/useProfile';
import { useHomeSummary } from '../../home/hooks/useHomeSummary';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { loading, updateProfile } = useProfile();
  const { unreadCount } = useHomeSummary(user?._id);

  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      surname: user?.surname || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const getInitials = () => {
    const fn = user?.firstName ? user.firstName[0] : '';
    const sn = user?.surname ? user.surname[0] : '';
    return (fn + sn).toUpperCase() || 'U';
  };

  const onSaveProfile = async (data) => {
    try {
      await updateProfile(data);
      Alert.alert('Perfil actualizado', 'Tus datos han sido guardados correctamente.');
      setIsEditing(false);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleCancelEdit = () => {
    reset({
      firstName: user?.firstName || '',
      surname: user?.surname || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert('¿Cerrar sesión?', '¿Estás seguro de que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{getInitials()}</Text>
        </View>
        <Text style={styles.fullName}>
          {user?.firstName} {user?.surname}
        </Text>
        <Text style={styles.username}>@{user?.username || 'usuario'}</Text>
      </View>

      {/* Información / Edición de Perfil */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Datos personales</Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editLink}>Editar perfil</Text>
            </TouchableOpacity>
          )}
        </View>

        {!isEditing ? (
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>{user?.firstName || '-'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Apellido</Text>
              <Text style={styles.infoValue}>{user?.surname || '-'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Correo electrónico</Text>
              <Text style={styles.infoValue}>{user?.email || '-'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{user?.phone || '-'}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.form}>
            <Controller
              control={control}
              name="firstName"
              rules={{ required: 'El nombre es obligatorio' }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Nombre"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Tu nombre"
                  error={errors.firstName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="surname"
              rules={{ required: 'El apellido es obligatorio' }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Apellido"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Tu apellido"
                  error={errors.surname?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{ required: 'El correo es obligatorio' }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Correo electrónico"
                  value={value}
                  onChangeText={onChange}
                  placeholder="correo@ejemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Teléfono"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Número de teléfono"
                  keyboardType="phone-pad"
                  error={errors.phone?.message}
                />
              )}
            />

            <View style={styles.buttonRow}>
              <Button
                title="Cancelar"
                variant="secondary"
                onPress={handleCancelEdit}
                disabled={loading}
                style={styles.btnFlex}
              />
              <Button
                title="Guardar cambios"
                variant="primary"
                onPress={handleSubmit(onSaveProfile)}
                loading={loading}
                style={styles.btnFlex}
              />
            </View>
          </View>
        )}
      </Card>

      {/* Accesos Rápidos */}
      <Text style={styles.sectionTitle}>Accesos y Ajustes</Text>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Notifications')}
      >
        <View style={styles.menuLeft}>
          <MaterialIcons name="notifications" size={24} color={COLORS.primary} />
          <Text style={styles.menuTitle}>Notificaciones</Text>
        </View>
        <View style={styles.menuRight}>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
          <MaterialIcons name="chevron-right" size={24} color={COLORS.textMuted} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('ChangePassword')}
      >
        <View style={styles.menuLeft}>
          <MaterialIcons name="lock" size={24} color={COLORS.primary} />
          <Text style={styles.menuTitle}>Cambiar contraseña</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.textMuted} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Ejercicios', { screen: 'ExerciseProgress' })}
      >
        <View style={styles.menuLeft}>
          <MaterialIcons name="show-chart" size={24} color={COLORS.primary} />
          <Text style={styles.menuTitle}>Mi progreso de bienestar</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.textMuted} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => navigation.navigate('Ánimo', { screen: 'MoodHistory' })}
      >
        <View style={styles.menuLeft}>
          <MaterialIcons name="history" size={24} color={COLORS.primary} />
          <Text style={styles.menuTitle}>Mi historial emocional</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.textMuted} />
      </TouchableOpacity>

      {/* Botón Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={20} color={COLORS.secondary} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
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
    paddingBottom: SPACING.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  fullName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  username: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  editLink: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  infoList: {
    gap: SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  form: {
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
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  btnFlex: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  menuTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  badge: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surfaceAlt,
    borderColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    marginTop: SPACING.lg,
  },
  logoutText: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
});
