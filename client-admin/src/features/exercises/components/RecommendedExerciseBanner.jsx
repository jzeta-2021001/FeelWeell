import { Sparkles, PlayCircle } from 'lucide-react';

export const RecommendedExerciseBanner = ({ recommended, completedIds, savedIds, onStart, onSave }) => {
    if (!recommended || recommended.length === 0) return null;

    // Mostrar solo el primero no completado como destacado
    const featured = recommended.find((ex) => !completedIds.has(ex._id)) ?? recommended[0];

    return (
        <div className='rounded-2xl overflow-hidden border border-[#d4d0ff]' style={{ background: 'linear-gradient(135deg,#f0eaff 0%,#e8ecff 100%)' }}>
            <div className='p-5'>
                <div className='flex items-center gap-2 mb-3'>
                    <Sparkles size={15} className='text-fw-purple' />
                    <span className='text-xs font-extrabold text-fw-purple uppercase tracking-widest'>Recomendado para ti</span>
                </div>

                <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1 min-w-0'>
                        <h3 className='m-0 text-[15px] font-black text-[#2f3348] leading-snug mb-1'>{featured.title}</h3>
                        <p className='m-0 text-xs text-fw-gray font-semibold line-clamp-2 leading-relaxed'>{featured.description}</p>
                        <div className='flex gap-1.5 mt-2.5'>
                            <span className='inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/70 text-fw-purple'>
                                {featured.type}
                            </span>
                            <span className='inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/70 text-[#555]'>
                                {featured.duration} min
                            </span>
                        </div>
                    </div>

                    {featured.photoUrl && (
                        <img src={featured.photoUrl} alt={featured.title}
                            className='w-20 h-20 rounded-xl object-cover shrink-0 border-2 border-white/60' />
                    )}
                </div>

                <button
                    onClick={() => onStart(featured)}
                    className='mt-4 w-full h-10 bg-fw-purple text-white rounded-xl font-bold text-sm border-none cursor-pointer hover:bg-fw-purple-light transition-colors flex items-center justify-center gap-2'
                >
                    <PlayCircle size={15} /> Comenzar ahora
                </button>
            </div>
        </div>
    );
};