// src/features/admin/screens/AdminHomeScreen.jsx
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../../../shared/constants/theme';
import { useAuthStore } from '../../../shared/store/authStore';
import { getAccessibleSections } from '../../../shared/constants/roles';

const ROLE_LABELS = {
    ADMIN_ROLE: 'Administrador general',
    ADMIN_USERS_ROLE: 'Administrador de usuarios',
    ADMIN_HEALTHY_ROLE: 'Administrador de bienestar',
    ADMIN_MOODTRACKING_ROLE: 'Administrador de mood tracking',
};

export default function AdminHomeScreen() {
    const navigation = useNavigation();
    const user = useAuthStore((state) => state.user);
    const sections = getAccessibleSections(user?.role);

    const fullName = [user?.firstName, user?.surname].filter(Boolean).join(' ') || 'Administrador';
    const roleLabel = ROLE_LABELS[user?.role] || user?.role || '';

    return (
        <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
            <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.greeting}>Hola, {fullName}</Text>
                    <Text style={styles.roleBadge}>{roleLabel}</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('AdminProfile')}
                >
                    <MaterialIcons name="account-circle" size={30} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Tus áreas de administración</Text>

            <View style={styles.grid}>
                {sections.map((section) => (
                    <TouchableOpacity
                        key={section.key}
                        style={styles.card}
                        onPress={() => navigation.navigate(section.route)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardIcon}>
                            <MaterialIcons name={section.icon} size={22} color={COLORS.primary} />
                        </View>
                        <Text style={styles.cardLabel}>{section.label}</Text>
                        <Text style={styles.cardDescription}>{section.description}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {sections.length === 0 && (
                <Text style={styles.emptyText}>
                    Tu rol no tiene secciones de administración asignadas todavía.
                </Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        padding: SPACING.lg,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    greeting: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '900',
        color: COLORS.text,
    },
    roleBadge: {
        marginTop: 2,
        fontSize: FONT_SIZE.sm,
        fontWeight: '700',
        color: COLORS.primaryLight,
    },
    profileButton: {
        padding: 4,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '800',
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
    },
    card: {
        width: '47%',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        ...SHADOWS.card,
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    cardLabel: {
        fontSize: FONT_SIZE.md,
        fontWeight: '800',
        color: COLORS.text,
    },
    cardDescription: {
        marginTop: 2,
        fontSize: FONT_SIZE.xs,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    emptyText: {
        marginTop: SPACING.xl,
        textAlign: 'center',
        color: COLORS.textMuted,
        fontWeight: '600',
    },
});