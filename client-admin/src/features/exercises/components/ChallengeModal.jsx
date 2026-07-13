import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { axiosHealthy } from '../../../shared/apis/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../auth/store/authStore';

export const ChallengeModal = ({ isOpen, onClose, challenge, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'RELAJACIÓN',
        targetProfile: 'ANSIOSO',
        duration: 5,
        instructions: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (challenge) {
            setFormData({
                title: challenge.title || '',
                description: challenge.description || '',
                type: challenge.type || 'RELAJACIÓN',
                targetProfile: challenge.targetProfile || 'ANSIOSO',
                duration: challenge.duration || 5,
                instructions: challenge.instructions || ''
            });
        } else {
            // Reset al abrir para crear nuevo
            setFormData({
                title: '',
                description: '',
                type: 'RELAJACIÓN',
                targetProfile: 'ANSIOSO',
                duration: 5,
                instructions: ''
            });
        }
    }, [challenge, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'duration' ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const token = useAuthStore.getState().token;
        const config = { 
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            } 
        };

        try {
            // Enviamos solo los datos necesarios, asegurando que sean del tipo correcto
            const payload = {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                targetProfile: formData.targetProfile,
                duration: Number(formData.duration),
                instructions: formData.instructions
            };

            if (challenge && challenge._id) {
                const res = await axiosHealthy.put(`/exercises/${challenge._id}`, payload, config);
                if (res.data.success) {
                    toast.success('Reto actualizado correctamente');
                    onSuccess();
                    onClose();
                }
            } else {
                const res = await axiosHealthy.post('/exercises', payload, config);
                if (res.data.success) {
                    toast.success('Reto creado exitosamente');
                    onSuccess();
                    onClose();
                }
            }
        } catch (error) {
            console.error("Error completo en submit:", error.response?.data);
            
            // Si el backend responde, mostramos el error técnico
            const serverMsg = error.response?.data?.message || 'Error desconocido';
            const validationErrors = error.response?.data?.errors ? ` (${error.response.data.errors[0].message})` : '';
            
            toast.error(`Error al guardar: ${serverMsg}${validationErrors}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-[#e5e7f0]">
                    <h2 className="text-[#2f3348] text-lg font-black m-0">
                        {challenge ? 'Editar Reto Existente' : 'Configurar Nuevo Reto'}
                    </h2>
                    <button onClick={onClose} className="text-[#9b9fb8] cursor-pointer"><X size={20} /></button>
                </div>
                <div className="overflow-y-auto p-6 custom-scrollbar">
                    <form id="challenge-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-extrabold text-[#505570] mb-1.5">Título Operativo</label>
                            <input required type="text" name="title" value={formData.title} onChange={handleChange}
                                className="w-full border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#6d72d8] transition-colors" placeholder="Ej. Caminata táctica de 5 min" />
                        </div>
                        <div>
                            <label className="block text-sm font-extrabold text-[#505570] mb-1.5">Descripción de Valor</label>
                            <textarea required name="description" value={formData.description} onChange={handleChange} rows="2"
                                className="w-full border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#6d72d8] transition-colors resize-none" placeholder="Impacto esperado..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-extrabold text-[#505570] mb-1.5">Perfil Objetivo</label>
                                <select required name="targetProfile" value={formData.targetProfile} onChange={handleChange}
                                    className="w-full border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#6d72d8] transition-colors bg-white">
                                    <option value="ANSIOSO">ANSIOSO</option>
                                    <option value="DEPRESIVO">DEPRESIVO</option>
                                    <option value="EQUILIBRADO">EQUILIBRADO</option>
                                    <option value="RESILIENTE">RESILIENTE</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-extrabold text-[#505570] mb-1.5">Duración (minutos)</label>
                                <input required type="number" min="1" name="duration" value={formData.duration} onChange={handleChange}
                                    className="w-full border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#6d72d8] transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-extrabold text-[#505570] mb-1.5">Categoría (Tipo)</label>
                            <input required type="text" name="type" value={formData.type} onChange={handleChange}
                                className="w-full border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#6d72d8] transition-colors" placeholder="Ej. RELAJACIÓN, MINDFULNESS" />
                        </div>
                        <div>
                            <label className="block text-sm font-extrabold text-[#505570] mb-1.5">Protocolo de Instrucciones</label>
                            <textarea required name="instructions" value={formData.instructions} onChange={handleChange} rows="3"
                                className="w-full border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#6d72d8] transition-colors resize-none" placeholder="1. Paso uno..." />
                        </div>
                    </form>
                </div>
                <div className="px-6 py-4 border-t border-[#e5e7f0] flex justify-end gap-3 bg-gray-50">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-[#7b8094] font-bold text-sm rounded-xl border border-[#e5e7f0] bg-white cursor-pointer">Cancelar</button>
                    <button type="submit" form="challenge-form" disabled={submitting}
                        className="px-5 py-2.5 bg-[#6d72d8] text-white font-bold text-sm rounded-xl border-none cursor-pointer">{submitting ? 'Procesando...' : 'Guardar Parámetros'}</button>
                </div>
            </div>
        </div>
    );
};