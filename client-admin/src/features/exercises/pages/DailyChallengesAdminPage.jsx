import React, { useState, useEffect } from 'react';
import { Target, Plus, Edit2, Trash2 } from 'lucide-react';
import { axiosHealthy } from '../../../shared/apis/api';
import toast from 'react-hot-toast';
import { ChallengeModal } from '../components/ChallengeModal';

export const DailyChallengesAdminPage = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para control del Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState(null);

    const fetchChallenges = async () => {
        try {
            const res = await axiosHealthy.get('/exercises');
            if (res.data.success) {
                setChallenges(res.data.data);
            }
        } catch (error) {
            toast.error("Error operativo al cargar la base de datos");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    // Acción Delete
    const handleDelete = async (id) => {
        if (!window.confirm('¿Confirmas la eliminación permanente de este reto? Esta acción no se puede deshacer.')) return;
        try {
            const res = await axiosHealthy.delete(`/exercises/${id}`);
            if (res.data.success) {
                toast.success('Reto eliminado del ecosistema');
                fetchChallenges(); // Recargar datos post-eliminación
            }
        } catch (error) {
            toast.error('Error al procesar la eliminación');
        }
    };

    // Apertura del modal en modo POST
    const openCreateModal = () => {
        setSelectedChallenge(null);
        setIsModalOpen(true);
    };

    // Apertura del modal en modo PUT
    const openEditModal = (challenge) => {
        setSelectedChallenge(challenge);
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-8 text-center text-[#6d72d8] font-bold animate-pulse">Sincronizando infraestructura...</div>;

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6d72d8] to-[#4a4fbf] flex items-center justify-center text-white shadow-md">
                        <Target size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[#2f3348] m-0">Gestión de Retos Diarios</h1>
                        <p className="text-sm font-bold text-[#7b8094] m-0 mt-1">
                            Panel ejecutivo de administración y configuración de dinámicas de bienestar.
                        </p>
                    </div>
                </div>
                
                {/* INYECCIÓN: Botón Create */}
                <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#6d72d8] hover:bg-[#5a5fc4] text-white font-bold rounded-xl transition-colors shadow-sm cursor-pointer border-none"
                >
                    <Plus size={18} /> Nuevo Reto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                    <div key={challenge._id} className="bg-white p-5 rounded-2xl border border-[#e5e7f0] shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-[#6d72d8] font-black text-lg m-0 pr-2">{challenge.title}</h3>
                            
                            {/* INYECCIÓN: Controles Update/Delete */}
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => openEditModal(challenge)} className="text-[#7b8094] hover:text-[#6d72d8] cursor-pointer bg-transparent border-none p-1 transition-colors" title="Modificar Parámetros">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(challenge._id)} className="text-[#7b8094] hover:text-[#d14b6d] cursor-pointer bg-transparent border-none p-1 transition-colors" title="Eliminar Registro">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        
                        <p className="text-[#505570] font-medium text-sm mb-4 line-clamp-3 flex-1">{challenge.description}</p>
                        
                        <div className="flex justify-between items-center text-xs font-bold mt-auto pt-4 border-t border-gray-100">
                            <span className="bg-[#f0f1ff] text-[#6d72d8] px-2.5 py-1 rounded-md">{challenge.type || 'RETO'}</span>
                            <span className="bg-[#fff0f4] text-[#d14b6d] px-2.5 py-1 rounded-md">{challenge.targetProfile || 'GENERAL'}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            {challenges.length === 0 && (
                <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300 mt-6">
                    <p className="text-gray-500 font-bold">Sin datos operativos. Registre un nuevo reto para iniciar.</p>
                </div>
            )}

            {/* Renderizado Condicional del Modal */}
            <ChallengeModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                challenge={selectedChallenge} 
                onSuccess={fetchChallenges} 
            />
        </div>
    );
};