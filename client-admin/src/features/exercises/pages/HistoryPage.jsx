import React, { useState, useEffect } from 'react';
import { Activity, Smile, Dumbbell, Calendar, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../auth/store/authStore.js';

// Mapeo ejecutivo de emociones
const MOOD_EMOJIS = {
    'FELIZ': '😄', 'TRISTE': '😢', 'ENOJADO': '😠', 'ANSIOSO': '😰', 
    'CALMADO': '😌', 'EMOCIONADO': '🤩', 'NEUTRAL': '😐', 'ABRUMADO': '😵',
    'DESMOTIVADO': '🫠', 'ESPERANZADO': '🥹'
};

export const HistoryPage = () => {
    const token = useAuthStore((s) => s.token);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistoryData = async () => {
            if (!token) return;
            setIsLoading(true);
            
            try {
                const headers = { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                const [moodRes, exerciseRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_MOOD_URL}/moodTracking/mood/history`, { headers }).catch(() => ({ json: () => ({ data: [] }) })),
                    fetch(`${import.meta.env.VITE_HEALTHY_URL}/exercises/user/progress`, { headers }).catch(() => ({ json: () => ({ data: { completed: [] } }) }))
                ]);

                const moodJson = await moodRes.json();
                const exerciseJson = await exerciseRes.json();

                // Asegurar que sean arrays (protección contra respuestas inesperadas del backend)
                const rawMoods = Array.isArray(moodJson.data) ? moodJson.data : [];
                
                // Validación para la estructura de los ejercicios
                let rawExercises = [];
                if (Array.isArray(exerciseJson.data)) {
                    rawExercises = exerciseJson.data;
                } else if (exerciseJson.data && Array.isArray(exerciseJson.data.completed)) {
                    rawExercises = exerciseJson.data.completed;
                }

                const normalizedEvents = [];

                // 1. Transformar registros emocionales
                rawMoods.forEach(m => {
                    // Fallback seguro: busca date, luego createdAt, luego usa la fecha actual
                    const dateVal = m.date || m.createdAt || new Date().toISOString();
                    
                    normalizedEvents.push({
                        id: `mood_${m._id || Math.random()}`,
                        type: 'MOOD',
                        timestamp: new Date(dateVal),
                        title: 'Registro de Estado de Ánimo',
                        emotion: m.emotion || 'NEUTRAL',
                        intensity: m.intensity || 0,
                        note: m.note || '',
                        icon: Smile,
                        color: 'bg-[#f0f1ff] text-[#6d72d8]'
                    });
                });

                // 2. Transformar registros de retos/ejercicios completados
                rawExercises.forEach(e => {
                    const exerciseData = e.exercise || e; 
                    if (!exerciseData || !exerciseData._id) return;
                    
                    // Fallback seguro de fechas
                    const dateVal = e.completedAt || e.createdAt || new Date().toISOString();

                    normalizedEvents.push({
                        id: `ex_${exerciseData._id}_${dateVal}`,
                        type: 'EXERCISE',
                        timestamp: new Date(dateVal),
                        title: 'Reto Completado',
                        exerciseTitle: exerciseData.title || 'Reto de Bienestar',
                        duration: exerciseData.duration || 0,
                        icon: Dumbbell,
                        color: 'bg-[#e5ffe5] text-[#2ebd59]'
                    });
                });

                // 3. FILTRO DE SEGURIDAD CRÍTICO: 
                // Elimina eventos mal formados o con "Invalid Date"
                const validEvents = normalizedEvents.filter(
                    event => event && event.timestamp && !isNaN(event.timestamp.getTime())
                );

                // 4. Ordenamiento Cronológico (Más reciente primero)
                validEvents.sort((a, b) => b.timestamp - a.timestamp);
                setEvents(validEvents);

            } catch (error) {
                console.error("Desviación operativa al procesar el historial:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistoryData();
    }, [token]);

    // Agrupación Analítica por Fechas con protección
    const groupedEvents = events.reduce((groups, event) => {
        // Doble validación: Evitar estrellar el renderizado
        if (!event || !event.timestamp || isNaN(event.timestamp.getTime())) return groups;

        const dateStr = event.timestamp.toLocaleDateString('es-ES', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
        
        if (!groups[dateStr]) {
            groups[dateStr] = [];
        }
        groups[dateStr].push(event);
        return groups;
    }, {});

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-pulse pt-5 px-4 md:px-0">
                <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gray-200 rounded-[14px]"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto pb-10 pt-5 px-4 md:px-0">
            <header className="mb-10 flex items-center gap-3">
                <Activity size={32} className="text-[#6d72d8]" />
                <div>
                    <h1 className="text-3xl font-black text-[#2f3348] m-0">Historial de Actividad</h1>
                    <p className="text-[#7b8094] font-bold mt-1 text-sm">Tu progreso y evolución emocional en FeelWeell.</p>
                </div>
            </header>

            {events.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-[20px] shadow-sm border border-[#e5e7f0]">
                    <Calendar size={48} className="mx-auto text-[#d1d4e3] mb-4" />
                    <h3 className="text-lg font-bold text-[#2f3348]">No hay actividad registrada aún</h3>
                    <p className="text-[#7b8094]">Comienza a registrar tu estado de ánimo o completa retos diarios para ver tu historial aquí.</p>
                </div>
            ) : (
                <div className="relative border-l-2 border-[#e5e7f0] ml-4 md:ml-6 space-y-10">
                    {Object.entries(groupedEvents).map(([date, dayEvents]) => (
                        <div key={date} className="relative">
                            {/* Marcador de Fecha */}
                            <div className="absolute -left-[25px] md:-left-[27px] top-0 bg-white p-1.5 rounded-full border-2 border-[#e5e7f0]">
                                <Calendar size={16} className="text-[#a0a5b9]" />
                            </div>
                            <h2 className="text-[16px] font-black text-[#8b91ef] capitalize ml-6 mb-5 pl-2 pt-1">
                                {date}
                            </h2>

                            {/* Tarjetas de Eventos */}
                            <div className="flex flex-col gap-4 ml-6">
                                {dayEvents.map((event) => (
                                    <div key={event.id} className="bg-white p-5 rounded-[16px] shadow-sm border border-[#f0f1ff] hover:shadow-md transition-shadow relative overflow-hidden group">
                                        
                                        {/* Barra decorativa lateral */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${event.type === 'MOOD' ? 'bg-[#6d72d8]' : 'bg-[#2ebd59]'}`}></div>

                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 ${event.color}`}>
                                                <event.icon size={24} />
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[12px] font-black text-[#a0a5b9] uppercase tracking-wider">
                                                        {event.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {event.type === 'EXERCISE' && (
                                                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#2ebd59] bg-[#e5ffe5] px-2 py-0.5 rounded-full">
                                                            <CheckCircle size={12} /> Superado
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-[16px] font-black text-[#2f3348] m-0 mb-2">
                                                    {event.title}
                                                </h3>

                                                {event.type === 'MOOD' ? (
                                                    <div className="bg-[#f8f9ff] p-3 rounded-[10px]">
                                                        <p className="m-0 font-bold text-[#4a4fbf] flex items-center gap-2">
                                                            <span className="text-xl">{MOOD_EMOJIS[event.emotion?.toUpperCase()] || '✨'}</span>
                                                            Te sentiste {event.emotion?.toLowerCase() || 'neutral'} 
                                                            <span className="bg-white px-2 py-0.5 rounded text-[11px] ml-2 shadow-sm whitespace-nowrap">
                                                                Intensidad: {event.intensity}/10
                                                            </span>
                                                        </p>
                                                        {event.note && (
                                                            <p className="m-0 mt-2 text-sm text-[#7b8094] italic border-l-2 border-[#d1d4e3] pl-2">
                                                                "{event.note}"
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <p className="m-0 font-bold text-[#4a4fbf] bg-[#f8f9ff] px-3 py-2 rounded-[8px] flex-1">
                                                            {event.exerciseTitle}
                                                        </p>
                                                        {event.duration > 0 && (
                                                            <span className="text-[12px] font-black text-[#d14b6d] bg-[#fff0f4] px-3 py-2 rounded-[8px] shrink-0">
                                                                {event.duration} min
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};