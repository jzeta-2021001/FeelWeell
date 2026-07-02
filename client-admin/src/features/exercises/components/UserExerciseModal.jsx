import { X, Clock, CheckCircle2, Bookmark, BookmarkCheck } from 'lucide-react';
import { TYPE_CONFIG } from './UserExerciseCard.jsx';

export const UserExerciseModal = ({ exercise, onComplete, onSave, onClose, completing }) => {
    if (!exercise) return null;

    const { isCompleted, isSaved } = exercise;
    const cfg = TYPE_CONFIG[exercise.type] ?? TYPE_CONFIG['MINDFULNESS'];
    const TypeIcon = cfg.icon;

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn'
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className='bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[88vh] overflow-hidden animate-fadeInScale'>

                {/* Hero */}
                <div className='relative w-full h-44 flex items-center justify-center shrink-0 overflow-hidden'
                    style={{ background: `linear-gradient(135deg, ${cfg.bg}, ${cfg.bg}aa)` }}>
                    {exercise.photoUrl
                        ? <img src={exercise.photoUrl} alt={exercise.title} className='w-full h-full object-cover' />
                        : <TypeIcon size={72} style={{ color: cfg.color, opacity: 0.25 }} />
                    }
                    <button onClick={onClose}
                        className='absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border-none cursor-pointer text-[#555] hover:bg-white transition-colors'>
                        <X size={15} />
                    </button>
                    {isCompleted && (
                        <div className='absolute bottom-3 left-4 flex items-center gap-1.5 bg-[#2e7d52] text-white text-xs font-bold px-3 py-1.5 rounded-full'>
                            <CheckCircle2 size={12} /> Completado
                        </div>
                    )}
                </div>

                {/* Contenido scrollable */}
                <div className='flex flex-col gap-4 p-5 overflow-y-auto'>
                    {/* Chips + título */}
                    <div>
                        <div className='flex gap-2 mb-2 flex-wrap'>
                            <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold'
                                style={{ background: cfg.bg, color: cfg.color }}>
                                <TypeIcon size={11} /> {cfg.label}
                            </span>
                            <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f0f0f0] text-[#555]'>
                                <Clock size={11} /> {exercise.duration} min
                            </span>
                        </div>
                        <h2 className='m-0 text-[18px] font-black text-[#2f3348] leading-snug'>{exercise.title}</h2>
                        <p className='m-0 mt-1.5 text-sm text-fw-gray leading-relaxed'>{exercise.description}</p>
                    </div>

                    {/* Instrucciones */}
                    {exercise.instructions && (
                        <div className='rounded-2xl p-4' style={{ background: cfg.bg + '55' }}>
                            <p className='m-0 text-[10px] font-extrabold uppercase tracking-widest mb-2' style={{ color: cfg.color }}>
                                Instrucciones
                            </p>
                            <p className='m-0 text-sm text-[#4a4f6b] font-medium leading-relaxed whitespace-pre-line'>
                                {exercise.instructions}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='flex gap-3 p-4 border-t border-[#f0f0f5] shrink-0'>
                    {/* Guardar para después */}
                    <button
                        onClick={() => onSave(exercise._id, isSaved)}
                        title={isSaved ? 'Ya guardado para después' : 'Guardar para después'}
                        className={`h-11 px-4 flex items-center gap-2 rounded-xl border-none cursor-pointer transition-colors text-sm font-bold shrink-0
                            ${isSaved
                                ? 'bg-fw-purple-bg text-fw-purple'
                                : 'bg-[#f5f5f5] text-[#888] hover:bg-fw-purple-bg hover:text-fw-purple'
                            }`}
                    >
                        {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                        {isSaved ? 'Guardado' : 'Guardar'}
                    </button>

                    {/* Completar */}
                    <button
                        onClick={() => !isCompleted && onComplete(exercise._id)}
                        disabled={isCompleted || completing}
                        className={`flex-1 h-11 rounded-xl font-bold text-sm border-none transition-colors flex items-center justify-center gap-2
                            ${isCompleted
                                ? 'bg-[#e8f5e9] text-[#2e7d52] cursor-default'
                                : 'bg-fw-purple text-white hover:bg-fw-purple-light cursor-pointer disabled:opacity-60'
                            }`}
                    >
                        {completing
                            ? <span className='w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin' />
                            : isCompleted
                                ? <><CheckCircle2 size={15} /> ¡Completado!</>
                                : <><CheckCircle2 size={15} /> Marcar como completado</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};