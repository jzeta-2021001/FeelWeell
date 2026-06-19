import { X, Clock, CheckCircle2, Bookmark, BookmarkCheck, Wind, Brain, Leaf, Heart, Zap, Dumbbell } from 'lucide-react';

const TYPE_CONFIG = {
    'RESPIRACIÓN': { icon: Wind, color: '#1565c0', bg: '#e3f2fd' },
    'MEDITACIÓN': { icon: Brain, color: '#7b1fa2', bg: '#f3e5f5' },
    'YOGA': { icon: Leaf, color: '#2e7d52', bg: '#e8f5e9' },
    'RELAJACIÓN': { icon: Heart, color: '#c62828', bg: '#fce4ec' },
    'MINDFULNESS': { icon: Zap, color: '#6d72d8', bg: '#edefff' },
    'ESTIRAMIENTO': { icon: Dumbbell, color: '#e65100', bg: '#fff3e0' },
};

export const UserExerciseModal = ({ exercise, isCompleted, isSaved, onComplete, onSave, onClose, completing }) => {
    if (!exercise) return null;

    const cfg = TYPE_CONFIG[exercise.type] ?? TYPE_CONFIG['MINDFULNESS'];
    const TypeIcon = cfg.icon;

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn'
            onClick={handleBackdrop}
        >
            <div className='bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fadeInScale'>
                {/* Header con imagen */}
                <div className='relative w-full h-48 flex items-center justify-center overflow-hidden' style={{ background: cfg.bg }}>
                    {exercise.photoUrl ? (
                        <img src={exercise.photoUrl} alt={exercise.title} className='w-full h-full object-cover' />
                    ) : (
                        <TypeIcon size={64} style={{ color: cfg.color, opacity: 0.5 }} />
                    )}
                    <button
                        onClick={onClose}
                        className='absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border-none cursor-pointer text-[#555] hover:bg-white transition-colors'
                    >
                        <X size={16} />
                    </button>
                    {isCompleted && (
                        <div className='absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#2e7d52] text-white text-xs font-bold px-3 py-1.5 rounded-full'>
                            <CheckCircle2 size={13} /> Completado
                        </div>
                    )}
                </div>

                {/* Contenido scrollable */}
                <div className='flex flex-col gap-4 p-6 overflow-y-auto'>
                    <div>
                        <div className='flex gap-2 mb-2 flex-wrap'>
                            <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold' style={{ background: cfg.bg, color: cfg.color }}>
                                <TypeIcon size={11} /> {exercise.type}
                            </span>
                            <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f0f0f0] text-[#555]'>
                                <Clock size={11} /> {exercise.duration} min
                            </span>
                        </div>
                        <h2 className='m-0 text-xl font-black text-[#2f3348]'>{exercise.title}</h2>
                        <p className='m-0 mt-2 text-sm text-fw-gray font-medium leading-relaxed'>{exercise.description}</p>
                    </div>

                    {exercise.instructions && (
                        <div className='bg-fw-purple-bg/50 rounded-2xl p-4'>
                            <p className='m-0 text-xs font-extrabold text-fw-purple uppercase tracking-widest mb-2'>Instrucciones</p>
                            <p className='m-0 text-sm text-[#4a4f6b] font-medium leading-relaxed whitespace-pre-line'>{exercise.instructions}</p>
                        </div>
                    )}
                </div>

                {/* Footer acciones */}
                <div className='flex gap-3 p-5 pt-0 border-t border-[#f0f0f5] mt-1'>
                    <button
                        onClick={() => onSave(exercise._id)}
                        className={`w-11 h-11 flex items-center justify-center rounded-xl border-none cursor-pointer transition-colors shrink-0 ${isSaved ? 'bg-fw-purple-bg text-fw-purple' : 'bg-[#f5f5f5] text-[#aaa] hover:bg-fw-purple-bg hover:text-fw-purple'}`}
                        title={isSaved ? 'Guardado' : 'Guardar para después'}
                    >
                        {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                    <button
                        onClick={() => onComplete(exercise._id)}
                        disabled={isCompleted || completing}
                        className={`flex-1 h-11 rounded-xl font-bold text-sm border-none cursor-pointer transition-colors flex items-center justify-center gap-2 ${isCompleted ? 'bg-[#e8f5e9] text-[#2e7d52] cursor-default' : 'bg-fw-purple text-white hover:bg-fw-purple-light disabled:opacity-60'}`}
                    >
                        {completing ? (
                            <span className='w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block' />
                        ) : isCompleted ? (
                            <><CheckCircle2 size={16} /> Completado</>
                        ) : (
                            <><CheckCircle2 size={16} /> Marcar como completado</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};