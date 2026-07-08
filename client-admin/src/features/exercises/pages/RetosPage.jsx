import React from 'react';
import { DailyChallengeWidget } from '../components/DailyChallengeWidget';
import { useAuthStore } from '../../auth/store/authStore';

export const RetosPage = () => {
    // Obtenemos el mood directamente del estado global de Zustand
    const user = useAuthStore((s) => s.user);

    return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-[#6d72d8] m-0 mb-2">Tus Retos Pendientes</h1>
                <p className="text-[#7b8094] font-bold m-0">
                    Completa tu actividad asignada del día para mantener tu racha activa y mejorar tu balance emocional.
                </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-[20px] shadow-sm border border-[#e5e7f0]">
                {/* Renderizamos el widget como elemento principal de la vista */}
                <DailyChallengeWidget currentMood={user?.mood || 'ANSIOSO'} />
            </div>
        </div>
    );
};