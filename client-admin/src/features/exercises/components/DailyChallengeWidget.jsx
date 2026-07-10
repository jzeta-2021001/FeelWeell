import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { axiosHealthy } from '../../../shared/apis/api'; 
import { useAuthStore } from '../../auth/store/authStore';

// Función estandarizada para obtener la fecha local correcta con ceros a la izquierda
const getLocalTodayString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const DailyChallengeWidget = ({ currentMood = 'ANSIOSO' }) => {
    const user = useAuthStore((s) => s.user);
    const [challenge, setChallenge] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [completed, setCompleted] = useState(false);

    // Generar llave de caché estandarizada
    const todayStr = getLocalTodayString();
    const storageKey = `fw_challenge_completed_${user?.id || user?._id}_${todayStr}`;

    useEffect(() => {
        // Validar caché al montar el componente
        const isCompleted = localStorage.getItem(storageKey) === 'true';
        if (isCompleted) {
            setCompleted(true);
            window.dispatchEvent(new Event('challengeCompleted'));
        }

        const fetchChallenge = async () => {
            try {
                const response = await axiosHealthy.get(`/exercises/daily-challenge?mood=${currentMood}`);
                if (response.data && response.data.success) {
                    setChallenge(response.data.data);
                }
            } catch (error) {
                console.error("Desviación operativa al cargar el reto diario:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChallenge();
    }, [currentMood, storageKey]);

    const handleComplete = () => {
        setCompleted(true);
        localStorage.setItem(storageKey, 'true'); // Guardar en caché persistente
        window.dispatchEvent(new Event('challengeCompleted')); // Notificar al menú lateral en tiempo real
    };

    if (isLoading) {
        return (
            <div className="w-full h-24 flex items-center justify-center bg-white rounded-[14px] border border-[#e5e7f0] shadow-sm animate-pulse mb-6">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="w-full p-4 mb-6 bg-white rounded-[14px] border border-[#e5e7f0] shadow-sm text-center text-[#7b8094] font-bold">
                No hay retos disponibles para tu estado de ánimo actual.
            </div>
        );
    }

    return (
        <div className="w-full flex items-center justify-between p-5 mb-6 bg-white rounded-[14px] shadow-sm border border-[#e5e7f0] transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f0f1ff] flex items-center justify-center text-[#6d72d8]">
                    <Clock size={24} />
                </div>
                <div>
                    <h4 className="m-0 text-[15px] font-black text-[#2f3348]">{challenge.title}</h4>
                    <p className="m-0 text-[13px] font-bold text-[#7b8094] mt-1">{challenge.description}</p>
                    {challenge.duration && (
                        <span className="inline-block mt-2 text-[11px] font-black px-2.5 py-1 bg-[#fff0f4] text-[#d14b6d] rounded-md">
                            Duración: {challenge.duration} min
                        </span>
                    )}
                </div>
            </div>
            
            <button 
                onClick={handleComplete}
                disabled={completed}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-[14px] font-bold text-[13px] transition-colors border-none cursor-pointer ${
                    completed 
                    ? 'bg-[#e5ffe5] text-[#2ebd59]' 
                    : 'bg-[#6d72d8] text-white hover:bg-[#5a5fc4]'
                }`}
            >
                {completed ? (
                    <><CheckCircle size={18} /> ¡Completado!</>
                ) : (
                    'Comenzar Reto'
                )}
            </button>
        </div>
    );
};