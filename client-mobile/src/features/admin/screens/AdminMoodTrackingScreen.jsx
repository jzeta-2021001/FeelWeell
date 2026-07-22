// src/features/admin/screens/AdminMotivationalScreen.jsx
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
// Servicio .NET de refuerzo positivo: sus rutas cuelgan de /api/... directamente.
import dailyPositiveClient from '../../../shared/api/dailyPositiveClient';

const EMPTY_FORM = { content: '', author: '', category: 'motivacion' };

export default function AdminMotivationalScreen() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        try {
            const response = await dailyPositiveClient.get('/api/admin/messages');
            setMessages(response.data?.data ?? []);
        } catch (err) {
            Alert.alert('Error', 'No se pudo cargar el catálogo de mensajes');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const openCreate = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setModalOpen(true);
    };

    const openEdit = (message) => {
        setEditingId(message.idMotivation);
        setForm({
            content: message.content || '',
            author: message.author || '',
            category: message.category || 'motivacion',
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.content.trim()) {
            Alert.alert('Falta información', 'El mensaje no puede estar vacío');
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                await dailyPositiveClient.patch(`/api/admin/messages/${editingId}`, form);
            } else {
                await dailyPositiveClient.post('/api/admin/messages', { ...form, isActive: true });
            }
            setModalOpen(false);
            fetchMessages();
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'No se pudo guardar el mensaje');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (message) => {
        Alert.alert('Desactivar mensaje', '¿Excluir este mensaje de la rotación diaria?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Desactivar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await dailyPositiveClient.delete(`/api/admin/messages/${message.idMotivation}`);
                        setMessages((prev) => prev.filter((m) => m.idMotivation !== message.idMotivation));
                    } catch (err) {
                        Alert.alert('Error', 'No se pudo desactivar el mensaje');
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
                data={messages}
                keyExtractor={(item) => String(item.idMotivation)}
                onRefresh={fetchMessages}
                refreshing={loading}
                ListEmptyComponent={<EmptyState icon="favorite-border" title="Sin mensajes registrados" />}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.content} numberOfLines={3}>
                                "{item.content}"
                            </Text>
                            <View style={styles.actionsRow}>
                                <TouchableOpacity onPress={() => openEdit(item)}>
                                    <MaterialIcons name="edit" size={18} color={COLORS.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item)}>
                                    <MaterialIcons name="delete-outline" size={18} color={COLORS.error} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.author}>— {item.author || 'Anónimo'}</Text>
                        <Text style={styles.tag}>{item.category}</Text>
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
                            <Text style={styles.modalTitle}>{editingId ? 'Editar mensaje' : 'Nuevo mensaje'}</Text>
                            <Input
                                label="Mensaje"
                                value={form.content}
                                onChangeText={(v) => setForm((f) => ({ ...f, content: v }))}
                                multiline
                            />
                            <Input
                                label="Autor"
                                value={form.author}
                                onChangeText={(v) => setForm((f) => ({ ...f, author: v }))}
                            />
                            <Input
                                label="Categoría"
                                value={form.category}
                                onChangeText={(v) => setForm((f) => ({ ...f, category: v }))}
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
    rowBetween: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    content: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, flex: 1, paddingRight: SPACING.sm, fontStyle: 'italic' },
    author: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontWeight: '600', marginTop: 2 },
    actionsRow: { flexDirection: 'row', gap: SPACING.md },
    tag: {
        alignSelf: 'flex-start',
        marginTop: SPACING.xs,
        fontSize: FONT_SIZE.xs,
        fontWeight: '700',
        color: COLORS.primary,
        backgroundColor: COLORS.primaryBg,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.sm,
    },
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
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalCard: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        maxHeight: '85%',
    },
    modalTitle: { fontSize: FONT_SIZE.lg, fontWeight: '900', color: COLORS.text, marginBottom: SPACING.md },
});