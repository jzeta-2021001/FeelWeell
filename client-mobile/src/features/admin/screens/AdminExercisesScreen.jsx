// src/features/admin/screens/AdminExercisesScreen.jsx
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import Input from '../../../shared/components/common/Input';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../../shared/constants/theme';
import healthyClient from '../../../shared/api/healthyClient';

const EMPTY_FORM = {
    title: '',
    description: '',
    type: 'RELAJACIÓN',
    targetProfile: 'ANSIOSO',
    duration: '5',
    instructions: '',
};

export default function AdminExercisesScreen({ route }) {
    const sectionTitle = route?.params?.sectionTitle || 'Ejercicios';

    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const fetchExercises = useCallback(async () => {
        setLoading(true);
        try {
            const response = await healthyClient.get('/exercises');
            setExercises(response.data?.data ?? []);
        } catch (err) {
            Alert.alert('Error', 'No se pudo cargar el catálogo');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises]);

    const openCreate = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditingId(item._id);
        setForm({
            title: item.title || '',
            description: item.description || '',
            type: item.type || 'RELAJACIÓN',
            targetProfile: item.targetProfile || 'ANSIOSO',
            duration: String(item.duration ?? 5),
            instructions: item.instructions || '',
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.title.trim()) {
            Alert.alert('Falta información', 'El título es obligatorio');
            return;
        }
        setSaving(true);
        const payload = {
            title: form.title,
            description: form.description,
            type: form.type,
            targetProfile: form.targetProfile,
            duration: Number(form.duration) || 0,
            instructions: form.instructions,
        };
        try {
            if (editingId) {
                await healthyClient.put(`/exercises/${editingId}`, payload);
            } else {
                await healthyClient.post('/exercises', payload);
            }
            setModalOpen(false);
            fetchExercises();
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'No se pudo guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (item) => {
        Alert.alert('Eliminar', `¿Eliminar "${item.title}"? Esta acción no se puede deshacer.`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await healthyClient.delete(`/exercises/${item._id}`);
                        setExercises((prev) => prev.filter((e) => e._id !== item._id));
                    } catch (err) {
                        Alert.alert('Error', 'No se pudo eliminar');
                    }
                },
            },
        ]);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <View style={styles.flex}>
            <FlatList
                contentContainerStyle={styles.list}
                data={exercises}
                keyExtractor={(item) => item._id}
                onRefresh={fetchExercises}
                refreshing={loading}
                ListEmptyComponent={
                    <EmptyState icon="fitness-center" title={`Sin registros en ${sectionTitle}`} />
                }
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.title}>{item.title}</Text>
                            <View style={styles.actionsRow}>
                                <TouchableOpacity onPress={() => openEdit(item)}>
                                    <MaterialIcons name="edit" size={18} color={COLORS.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item)}>
                                    <MaterialIcons name="delete-outline" size={18} color={COLORS.error} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.description} numberOfLines={2}>
                            {item.description}
                        </Text>
                        <View style={styles.tagsRow}>
                            <Text style={styles.tag}>{item.type || 'TIPO'}</Text>
                            <Text style={[styles.tag, styles.tagAlt]}>{item.targetProfile || 'GENERAL'}</Text>
                            <Text style={styles.tag}>{item.duration} min</Text>
                        </View>
                    </Card>
                )}
                ItemSeparatorComponent={() => <View style={{ height: SPACING.md }} />}
            />

            <TouchableOpacity style={styles.fab} onPress={openCreate}>
                <MaterialIcons name="add" size={26} color="#fff" />
            </TouchableOpacity>

            <Modal visible={modalOpen} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalTitle}>
                                {editingId ? 'Editar' : 'Nuevo'} en {sectionTitle}
                            </Text>
                            <Input
                                label="Título"
                                value={form.title}
                                onChangeText={(v) => setForm((f) => ({ ...f, title: v }))}
                            />
                            <Input
                                label="Descripción"
                                value={form.description}
                                onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
                                multiline
                            />
                            <Input
                                label="Tipo (ej. RELAJACIÓN)"
                                value={form.type}
                                onChangeText={(v) => setForm((f) => ({ ...f, type: v }))}
                            />
                            <Input
                                label="Perfil objetivo (ej. ANSIOSO)"
                                value={form.targetProfile}
                                onChangeText={(v) => setForm((f) => ({ ...f, targetProfile: v }))}
                            />
                            <Input
                                label="Duración (minutos)"
                                value={form.duration}
                                onChangeText={(v) => setForm((f) => ({ ...f, duration: v }))}
                                keyboardType="numeric"
                            />
                            <Input
                                label="Instrucciones"
                                value={form.instructions}
                                onChangeText={(v) => setForm((f) => ({ ...f, instructions: v }))}
                                multiline
                            />

                            <Button title="Guardar" onPress={handleSave} loading={saving} style={{ marginTop: SPACING.md }} />
                            <Button
                                title="Cancelar"
                                variant="secondary"
                                onPress={() => setModalOpen(false)}
                                style={{ marginTop: SPACING.sm }}
                            />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: COLORS.background },
    list: { padding: SPACING.lg, paddingBottom: 100 },
    card: { gap: SPACING.xs },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: FONT_SIZE.md, fontWeight: '800', color: COLORS.text, flex: 1, paddingRight: SPACING.sm },
    description: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontWeight: '500' },
    actionsRow: { flexDirection: 'row', gap: SPACING.md },
    tagsRow: { flexDirection: 'row', gap: SPACING.xs, marginTop: SPACING.xs, flexWrap: 'wrap' },
    tag: {
        fontSize: FONT_SIZE.xs,
        fontWeight: '700',
        color: COLORS.primary,
        backgroundColor: COLORS.primaryBg,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.sm,
    },
    tagAlt: { color: COLORS.secondary, backgroundColor: '#fff0f4' },
    fab: {
        position: 'absolute',
        right: SPACING.lg,
        bottom: SPACING.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        maxHeight: '85%',
    },
    modalTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '900',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
});