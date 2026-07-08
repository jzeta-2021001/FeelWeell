import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { axiosHealthy } from '../../../shared/apis/api';
import toast from 'react-hot-toast';

export const ChallengeModal = ({ isOpen, onClose, challenge, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'RELAJACIÓN', // Valor por defecto sugerido
        targetProfile: 'ANSIOSO', // Valor por defecto sugerido
        duration: 5,
        instructions: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Efecto para popular el formulario cuando se edita un reto existente
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
            // Limpieza del formulario para creación
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
        // Parsear duración a número para evitar conflictos de tipado en BD
        setFormData(prev => ({ ...prev, [name]: name === 'duration' ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (challenge && challenge._id) {
                // Flujo PUT: Actualización
                const res = await axiosHealthy.put(`/exercises/${challenge._id}`, formData);
                if (res.data.success) {
                    toast.success('Reto actualizado correctamente');
                    onSuccess();
                    onClose();
                }
            } else {
                // Flujo POST: Creación
                const res = await axiosHealthy.post('/exercises', formData);
                if (res.data.success) {
                    toast.success('Reto creado exitosamente');
                    onSuccess();
                    onClose();
                }
            }
        } catch (error) {
            toast.error(challenge ? 'Error al actualizar el reto' : 'Error al crear el reto');
            console.error("Desviación en el submit del modal:", error);
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
                    <button onClick={onClose} className="text-[#9b9fb8] hover:text-[#d14b6d] transition-colors bg-transparent border-none cursor-pointer">
                        <X size={20} />
                    </button>
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
                                className="w-full border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#6d72d8] transition-colors resize-none" placeholder="Impacto esperado en el usuario..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-extrabold text-[#505570] mb-1.5">Perfil Objetivo</label>
                                <select required name="targetProfile" value={formData.targetProfile} onChange={handleChange}
                                    className="w-full border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#6d72d8] transition-colors bg-white">
                                    <option value="ANSIOSO">ANSIOSO (Pico de estrés)</option>
                                    <option value="DEPRESIVO">DEPRESIVO (Baja energía)</option>
                                    <option value="EQUILIBRADO">EQUILIBRADO (Mantenimiento)</option>
                                    <option value="RESILIENTE">RESILIENTE (Crecimiento)</option>
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
                                className="w-full border-[1.5px] border-[#e5e7f0] rounded-[10px] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#6d72d8] transition-colors resize-none" placeholder="1. Primer paso...&#10;2. Segundo paso..." />
                        </div>
                    </form>
                </div>

                <div className="px-6 py-4 border-t border-[#e5e7f0] bg-gray-50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} disabled={submitting}
                        className="px-5 py-2.5 text-[#7b8094] font-bold text-sm rounded-xl border border-[#e5e7f0] hover:bg-gray-100 transition-colors cursor-pointer bg-white">
                        Cancelar
                    </button>
                    <button type="submit" form="challenge-form" disabled={submitting}
                        className="px-5 py-2.5 bg-[#6d72d8] text-white font-bold text-sm rounded-xl hover:bg-[#5a5fc4] transition-colors cursor-pointer border-none disabled:opacity-70">
                        {submitting ? 'Procesando...' : 'Guardar Parámetros'}
                    </button>
                </div>
            </div>
        </div>
    );
};