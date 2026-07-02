import { Sparkles, Clock, ChevronRight } from 'lucide-react';
import { TYPE_CONFIG } from './UserExerciseCard.jsx';

export const RecommendedExerciseBanner = ({ recommended, completedIds, onOpen }) => {
    if (!recommended || recommended.length === 0) return null;

    // Primer ejercicio no completado como destacado
    const featured = recommended.find((ex) => !completedIds.has(ex._id)) ?? recommended[0];
    const cfg = TYPE_CONFIG[featured.type] ?? TYPE_CONFIG['MINDFULNESS'];
    const TypeIcon = cfg.icon;

    return (
        <div className='rounded-2xl overflow-hidden border border-[#d4d0ff]'
            style={{ background: 'linear-gradient(135deg,#ede9ff 0%,#e4e8ff 100%)' }}>
            <div className='p-4'>
                <div className='flex items-center gap-1.5 mb-3'>
                    <Sparkles size={13} className='text-fw-purple' />
                    <span className='text-[10px] font-extrabold text-fw-purple uppercase tracking-widest'>
                        Recomendado para ti
                    </span>
                </div>

                <div className='flex items-center gap-3'>
                    {/* Icono / imagen */}
                    <div className='w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center'
                        style={{ background: cfg.bg }}>
                        {featured.photoUrl
                            ? <img src={featured.photoUrl} alt={featured.title} className='w-full h-full object-cover' />
                            : <TypeIcon size={28} style={{ color: cfg.color, opacity: 0.6 }} />
                        }
                    </div>

                    {/* Info */}
                    <div className='flex-1 min-w-0'>
                        <h3 className='m-0 text-[14px] font-black text-[#2f3348] leading-snug truncate'>
                            {featured.title}
                        </h3>
                        <div className='flex gap-2 mt-1'>
                            <span className='text-[11px] font-bold px-2 py-0.5 rounded-full' style={{ background: cfg.bg, color: cfg.color }}>
                                {cfg.label}
                            </span>
                            <span className='inline-flex items-center gap-1 text-[11px] font-bold text-fw-gray'>
                                <Clock size={10} /> {featured.duration} min
                            </span>
                        </div>
                    </div>

                    {/* Botón */}
                    <button
                        onClick={() => onOpen({ ...featured, isCompleted: completedIds.has(featured._id), isSaved: false })}
                        className='shrink-0 w-9 h-9 rounded-xl bg-fw-purple text-white flex items-center justify-center border-none cursor-pointer hover:bg-fw-purple-light transition-colors'
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};