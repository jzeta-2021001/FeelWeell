// src/features/admin/screens/AdminUsersScreen.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../../shared/constants/theme';
import authClient from '../../../shared/api/authClient';

export default function AdminUsersScreen() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await authClient.get('/auth/users');
            setUsers(response.data?.data ?? response.data ?? []);
        } catch (err) {
            Alert.alert('Error', 'No se pudo cargar la lista de usuarios');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleToggleStatus = async (user) => {
        setBusyId(user._id);
        try {
            await authClient.patch(`/api/users/${user._id}/toggle-status`);
            setUsers((prev) =>
                prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u))
            );
        } catch (err) {
            Alert.alert('Error', 'No se pudo cambiar el estado del usuario');
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = (user) => {
        Alert.alert(
            'Eliminar usuario',
            `¿Eliminar a ${user.firstName || user.username}? Esta acción no se puede deshacer.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        setBusyId(user._id);
                        try {
                            await authClient.delete(`/api/users/${user._id}`);
                            setUsers((prev) => prev.filter((u) => u._id !== user._id));
                        } catch (err) {
                            Alert.alert('Error', 'No se pudo eliminar el usuario');
                        } finally {
                            setBusyId(null);
                        }
                    },
                },
            ]
        );
    };

    if (loading) return <LoadingSpinner />;

    return (
        <FlatList
            style={styles.flex}
            contentContainerStyle={styles.list}
            data={users}
            keyExtractor={(item) => item._id}
            onRefresh={fetchUsers}
            refreshing={loading}
            ListEmptyComponent={<EmptyState icon="people-outline" title="Sin usuarios registrados" />}
            renderItem={({ item }) => (
                <Card style={styles.card}>
                    <View style={styles.rowBetween}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>
                                {[item.firstName, item.surname].filter(Boolean).join(' ') || item.username}
                            </Text>
                            <Text style={styles.meta}>@{item.username} · {item.role}</Text>
                            <Text style={styles.meta}>{item.email}</Text>
                        </View>
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: item.isActive ? COLORS.success : COLORS.textMuted },
                            ]}
                        >
                            <Text style={styles.statusText}>{item.isActive ? 'Activo' : 'Inactivo'}</Text>
                        </View>
                    </View>

                    <View style={styles.actionsRow}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            disabled={busyId === item._id}
                            onPress={() => handleToggleStatus(item)}
                        >
                            <MaterialIcons
                                name={item.isActive ? 'toggle-off' : 'toggle-on'}
                                size={18}
                                color={COLORS.primary}
                            />
                            <Text style={styles.actionText}>{item.isActive ? 'Desactivar' : 'Activar'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            disabled={busyId === item._id}
                            onPress={() => handleDelete(item)}
                        >
                            <MaterialIcons name="delete-outline" size={18} color={COLORS.error} />
                            <Text style={[styles.actionText, { color: COLORS.error }]}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            )}
            ItemSeparatorComponent={() => <View style={{ height: SPACING.md }} />}
        />
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: COLORS.background },
    list: { padding: SPACING.lg },
    card: { gap: SPACING.sm },
    rowBetween: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    name: { fontSize: FONT_SIZE.md, fontWeight: '800', color: COLORS.text },
    meta: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 },
    statusBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.sm,
    },
    statusText: { color: '#fff', fontSize: FONT_SIZE.xs, fontWeight: '800' },
    actionsRow: { flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.xs },
    actionButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    actionText: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
});