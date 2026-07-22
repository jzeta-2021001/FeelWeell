// src/features/admin/screens/AdminProfileScreen.jsx
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../../shared/constants/theme';
import { useAuthStore } from '../../../shared/store/authStore';

export default function AdminProfileScreen() {
    const navigation = useNavigation();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const fullName = [user?.firstName, user?.surname].filter(Boolean).join(' ') || 'Administrador';
    const initials = `${user?.firstName?.[0] ?? ''}${user?.surname?.[0] ?? ''}`.toUpperCase() || 'FW';

    const handleLogout = () => {
        Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
        ]);
    };

    return (
        <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
            <View style={styles.avatarWrapper}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <Text style={styles.name}>{fullName}</Text>
                <Text style={styles.role}>{user?.role}</Text>
            </View>

            <Card style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <MaterialIcons name="email" size={18} color={COLORS.textMuted} />
                    <Text style={styles.infoText}>{user?.email || 'Sin correo registrado'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MaterialIcons name="person" size={18} color={COLORS.textMuted} />
                    <Text style={styles.infoText}>@{user?.username || 'sin-usuario'}</Text>
                </View>
            </Card>

            <Button
                title="Cambiar contraseña"
                variant="secondary"
                onPress={() => navigation.navigate('AdminChangePassword')}
                style={{ marginTop: SPACING.lg }}
            />

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <MaterialIcons name="logout" size={18} color={COLORS.error} />
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: COLORS.background },
    container: { padding: SPACING.lg },
    avatarWrapper: { alignItems: 'center', marginBottom: SPACING.lg },
    avatar: {
        width: 76,
        height: 76,
        borderRadius: 38,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        marginBottom: SPACING.sm,
    },
    avatarText: { color: '#fff', fontSize: FONT_SIZE.xxl, fontWeight: '900' },
    name: { fontSize: FONT_SIZE.lg, fontWeight: '900', color: COLORS.text },
    role: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primaryLight, marginTop: 2 },
    infoCard: { gap: SPACING.sm },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    infoText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, fontWeight: '600' },
    logoutButton: {
        marginTop: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        height: 52,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    logoutText: { color: COLORS.error, fontWeight: '800', fontSize: FONT_SIZE.md },
});