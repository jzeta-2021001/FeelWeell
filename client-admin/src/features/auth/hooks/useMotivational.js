import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
    getAllMessages, 
    createMessage, 
    updateMessage, 
    deleteMessage 
} from '../../../shared/apis/motivational.js';

export const useMotivational = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        content: '',
        author: '',
        category: 'motivacion',
        isActive: true
    });

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await getAllMessages();
            if (response?.data?.success && Array.isArray(response.data.data)) {
                setMessages(response.data.data);
            } else {
                setMessages([]);
            }
        } catch (error) {
            toast.error('Error al sincronizar el catálogo.');
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleOpenModal = (message = null) => {
        if (message) {
            setEditingId(message.idMotivation);
            setFormData({
                content: message.content || '',
                author: message.author || '',
                category: message.category || 'motivacion',
                isActive: message.isActive
            });
        } else {
            setEditingId(null);
            setFormData({ content: '', author: '', category: 'motivacion', isActive: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateMessage(editingId, formData);
                toast.success('Registro actualizado exitosamente.');
            } else {
                await createMessage(formData);
                toast.success('Nuevo mensaje inyectado.');
            }
            handleCloseModal();
            fetchMessages();
        } catch (error) {
            toast.error('Fallo en la operación.');
        }
    };

    const executeDelete = async (id) => {
        try {
            await deleteMessage(id);
            toast.success('Mensaje desactivado correctamente.');
            fetchMessages();
        } catch (error) {
            toast.error('Error al procesar la baja.');
        }
    };

    return {
        messages, loading, isModalOpen, editingId, formData,
        setFormData, handleOpenModal, handleCloseModal, handleSubmit, executeDelete
    };
};