import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserExercises } from '../hooks/useUserExercises.js';
import { UserExerciseCard } from '../components/UserExerciseCard.jsx';
import { UserExerciseModal } from '../components/UserExerciseModal.jsx';
import { UserProgressStats } from '../components/UserProgressStats.jsx';
import { UserExercisesFilters } from '../components/UserExercisesFilters.jsx';
import { RecommendedExerciseBanner } from '../components/RecommendedExerciseBanner.jsx';

export const UserExercisesPage = () => {
    const {
        exercises,
        recommended,
        progress,
        loading,
        progressLoading,
        typeFilter,
        setTypeFilter,
        search,
        setSearch,
        completeExercise,
        saveExercise,
        completedIds,
        savedIds,
    } = useUserExercises();

    const [activeExercise, setActiveExercise] = useState(null);
    const [completing, setCompleting] = useState(false);

    const handleStart = (exercise) => setActiveExercise(exercise);
    const handleClose = () => setActiveExercise(null);

    const handleComplete = async (exerciseId) => {
        if (completedIds.has(exerciseId)) return;
        setCompleting(true);
        const result = await completeExercise(exerciseId);
        setCompleting(false);
        if (result.success) {
            toast.success('¡Ejercicio completado! 🎉');
        } else {
            toast.error(result.error || 'No se pudo completar el ejercicio');
        }
    };

    const handleSave = async (exerciseId) => {
        const result = await saveExercise(exerciseId);
        if (result.success) {
            toast.success(savedIds.has(exerciseId) ? 'Ejercicio actualizado' : 'Guardado para después');
        } else {
            toast.error(result.error || 'No se pudo guardar el ejercicio');
        }
    };

    const todayCompleted = progress?.summary?.totalCompleted ?? 0;
    const totalExercises = exercises.length;

    return (
        <div className='flex flex-col gap-6'>
            {/* Header */}
            <div className='rounded-2xl p-6' style={{ background: 'linear-gradient(135deg,#c5c8f2 0%,#d8d4ff 50%,#b9c9f5 100%)' }}>
                <div className='flex items-center gap-3 mb-1'>
                    <div className='w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center'>
                        <Dumbbell size={20} className='text-[#3d3a8c]' />
                    </div>
                    <div>
                        <h1 className='m-0 text-xl font-black text-[#2f3348]'>Ejercicios de Bienestar</h1>
                        <p className='m-0 text-xs font-semibold text-[#4a4f6b]'>Herramientas para tu salud emocional</p>
                    </div>
                </div>

                {/* Barra de progreso del día */}
                <div className='mt-4 bg-white/30 rounded-xl p-3'>
                    <div className='flex items-center justify-between mb-1.5'>
                        <span className='text-xs font-extrabold text-[#3d3a8c]'>Progreso de hoy</span>
                        <span className='text-xs font-bold text-[#4a4f6b]'>{todayCompleted} completados</span>
                    </div>
                    <div className='w-full bg-white/40 rounded-full h-2'>
                        <div
                            className='bg-fw-purple h-2 rounded-full transition-all duration-700'
                            style={{ width: totalExercises > 0 ? `${Math.min((todayCompleted / totalExercises) * 100, 100)}%` : '0%' }}
                        />
                    </div>
                </div>
            </div>

            {/* Stats de progreso */}
            <UserProgressStats progress={progress} loading={progressLoading} />

            {/* Recomendados */}
            {recommended.length > 0 && (
                <RecommendedExerciseBanner
                    recommended={recommended}
                    completedIds={completedIds}
                    savedIds={savedIds}
                    onStart={handleStart}
                    onSave={handleSave}
                />
            )}

            {/* Filtros */}
            <UserExercisesFilters
                search={search}
                onSearch={setSearch}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
            />

            {/* Grilla de ejercicios */}
            <div>
                <p className='m-0 text-sm font-extrabold text-[#505570] mb-3'>Todos los ejercicios</p>
                {loading ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className='bg-white border border-[#e5e7f0] rounded-2xl overflow-hidden animate-pulse'>
                                <div className='h-36 bg-[#f0f0f0]' />
                                <div className='p-4 flex flex-col gap-2'>
                                    <div className='h-4 bg-[#e5e7f0] rounded w-3/4' />
                                    <div className='h-3 bg-[#f0f0f0] rounded w-1/2' />
                                    <div className='h-3 bg-[#f0f0f0] rounded w-full' />
                                    <div className='h-3 bg-[#f0f0f0] rounded w-5/6' />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : exercises.length === 0 ? (
                    <div className='flex flex-col items-center justify-center gap-3 py-16 text-center'>
                        <div className='w-14 h-14 bg-fw-purple-bg rounded-2xl flex items-center justify-center'>
                            <Dumbbell size={24} className='text-fw-purple-light' />
                        </div>
                        <p className='m-0 text-sm font-bold text-fw-gray'>No hay ejercicios disponibles</p>
                        <p className='m-0 text-xs text-[#aaa]'>Prueba con otro filtro o búsqueda</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {exercises.map((exercise) => (
                            <UserExerciseCard
                                key={exercise._id}
                                exercise={exercise}
                                isCompleted={completedIds.has(exercise._id)}
                                isSaved={savedIds.has(exercise._id)}
                                onStart={handleStart}
                                onSave={handleSave}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de detalle */}
            {activeExercise && (
                <UserExerciseModal
                    exercise={activeExercise}
                    isCompleted={completedIds.has(activeExercise._id)}
                    isSaved={savedIds.has(activeExercise._id)}
                    onComplete={handleComplete}
                    onSave={handleSave}
                    onClose={handleClose}
                    completing={completing}
                />
            )}
        </div>
    );
};