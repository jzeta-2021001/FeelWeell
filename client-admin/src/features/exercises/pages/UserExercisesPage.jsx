import { useState } from 'react';
import { Dumbbell, Bookmark, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserExercises } from '../hooks/useUserExercises.js';
import { UserExerciseCard } from '../components/UserExerciseCard.jsx';
import { UserExerciseModal } from '../components/UserExerciseModal.jsx';
import { UserProgressStats } from '../components/UserProgressStats.jsx';
import { UserExercisesFilters } from '../components/UserExercisesFilters.jsx';
import { RecommendedExerciseBanner } from '../components/RecommendedExerciseBanner.jsx';

const TABS = [
    { key: 'all', label: 'Todos', icon: LayoutGrid },
    { key: 'saved', label: 'Guardados', icon: Bookmark },
];

const EmptyState = ({ icon: Icon, title, subtitle }) => (
    <div className='flex flex-col items-center justify-center gap-2 py-12 text-center'>
        <div className='w-12 h-12 bg-fw-purple-bg rounded-2xl flex items-center justify-center'>
            <Icon size={22} className='text-fw-purple-light' />
        </div>
        <p className='m-0 text-sm font-bold text-fw-gray'>{title}</p>
        {subtitle && <p className='m-0 text-xs text-[#bbb]'>{subtitle}</p>}
    </div>
);

export const UserExercisesPage = () => {
    const {
        filteredExercises,
        savedExercises,
        recommended,
        progress,
        loading,
        progressLoading,
        typeFilter,
        setTypeFilter,
        search,
        setSearch,
        activeTab,
        setActiveTab,
        completeExercise,
        toggleSaveExercise,
        completedIds,
        savedIds,
    } = useUserExercises();

    const [activeExercise, setActiveExercise] = useState(null);
    const [completing, setCompleting] = useState(false);

    const handleOpen = (exercise) => setActiveExercise(exercise);
    const handleClose = () => setActiveExercise(null);

    const handleComplete = async (exerciseId) => {
        if (completedIds.has(exerciseId)) return;
        setCompleting(true);
        const result = await completeExercise(exerciseId);
        setCompleting(false);
        if (result.success) {
            toast.success('¡Ejercicio completado! 🎉');
            // Actualizar ejercicio activo en el modal
            setActiveExercise((prev) => prev ? { ...prev, isCompleted: true } : null);
        } else {
            toast.error(result.error || 'No se pudo completar el ejercicio');
        }
    };

    const handleSave = async (exerciseId, isSaved) => {
        if (isSaved) {
            toast('Ya está guardado para después', { icon: '🔖' });
            return;
        }
       const exerciseTitle =
           [...filteredExercises, ...savedExercises, ...recommended].find((ex) => ex._id === exerciseId)?.title ?? '';
        const result = await toggleSaveExercise(exerciseId, isSaved, exerciseTitle);
        if (result.success) {
            toast.success('Guardado para después');
            setActiveExercise((prev) => prev?._id === exerciseId ? { ...prev, isSaved: true } : prev);
        } else {
            toast.error(result.error || 'No se pudo guardar');
        }
    };

    const totalExercises = filteredExercises.length;
    const totalCompleted = progress?.summary?.totalCompleted ?? 0;
    const progressPercent = totalExercises > 0 ? Math.min((totalCompleted / totalExercises) * 100, 100) : 0;

    return (
        <div className='flex flex-col gap-5'>

            {/* ── Header ── */}
            <div className='rounded-2xl p-5' style={{ background: 'linear-gradient(135deg,#c5c8f2 0%,#d4d0ff 50%,#b9c9f5 100%)' }}>
                <div className='flex items-center gap-3 mb-4'>
                    <div className='w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center'>
                        <Dumbbell size={20} className='text-[#3d3a8c]' />
                    </div>
                    <div>
                        <h1 className='m-0 text-lg font-black text-[#2f3348]'>Ejercicios de Bienestar</h1>
                        <p className='m-0 text-xs font-semibold text-[#4a4f6b]'>Herramientas para tu salud emocional</p>
                    </div>
                </div>

                {/* Barra de progreso — cuántos ejercicios completé del total visible */}
                <div className='bg-white/30 rounded-xl p-3'>
                    <div className='flex items-center justify-between mb-1.5'>
                        <span className='text-xs font-extrabold text-[#3d3a8c]'>Tu progreso</span>
                        <span className='text-xs font-bold text-[#4a4f6b]'>
                            {totalCompleted} de {totalExercises} completados
                        </span>
                    </div>
                    <div className='w-full bg-white/40 rounded-full h-2'>
                        <div className='bg-fw-purple h-2 rounded-full transition-all duration-700'
                            style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
            </div>

            {/* ── Stats ── */}
            <UserProgressStats progress={progress} loading={progressLoading} />

            {/* ── Recomendado ── */}
            {recommended.length > 0 && (
                <RecommendedExerciseBanner
                    recommended={recommended}
                    completedIds={completedIds}
                    onOpen={handleOpen}
                />
            )}

            {/* ── Tabs ── */}
            <div className='flex gap-1 bg-[#f0f0f8] p-1 rounded-xl w-fit'>
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-xs font-extrabold border-none cursor-pointer transition-all
                            ${activeTab === key
                                ? 'bg-white text-fw-purple shadow-sm'
                                : 'bg-transparent text-fw-gray hover:text-fw-purple'
                            }`}
                    >
                        <Icon size={13} /> {label}
                        {key === 'saved' && savedExercises.length > 0 && (
                            <span className='ml-0.5 bg-fw-purple text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center'>
                                {savedExercises.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Contenido según tab ── */}
            {activeTab === 'all' && (
                <>
                    <UserExercisesFilters
                        search={search}
                        onSearch={setSearch}
                        typeFilter={typeFilter}
                        onTypeChange={setTypeFilter}
                    />

                    {loading ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className='bg-white border border-[#e5e7f0] rounded-2xl overflow-hidden animate-pulse'>
                                    <div className='h-36 bg-[#f0f0f0]' />
                                    <div className='p-4 flex flex-col gap-2'>
                                        <div className='h-4 bg-[#e5e7f0] rounded w-3/4' />
                                        <div className='h-3 bg-[#f0f0f0] rounded w-1/2' />
                                        <div className='h-3 bg-[#f0f0f0] rounded w-full' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredExercises.length === 0 ? (
                        <EmptyState
                            icon={Dumbbell}
                            title='No hay ejercicios disponibles'
                            subtitle='Prueba con otro filtro o búsqueda'
                        />
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {filteredExercises.map((exercise) => (
                                <UserExerciseCard
                                    key={exercise._id}
                                    exercise={exercise}
                                    onOpen={handleOpen}
                                    onSave={handleSave}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'saved' && (
                savedExercises.length === 0 ? (
                    <EmptyState
                        icon={Bookmark}
                        title='No tienes ejercicios guardados'
                        subtitle='Pulsa el ícono de marcador en cualquier ejercicio para guardarlo aquí'
                    />
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {savedExercises.map((exercise) => (
                            <UserExerciseCard
                                key={exercise._id}
                                exercise={exercise}
                                onOpen={handleOpen}
                                onSave={handleSave}
                            />
                        ))}
                    </div>
                )
            )}

            {/* ── Modal de detalle ── */}
            {activeExercise && (
                <UserExerciseModal
                    exercise={activeExercise}
                    onComplete={handleComplete}
                    onSave={handleSave}
                    onClose={handleClose}
                    completing={completing}
                />
            )}
        </div>
    );
};