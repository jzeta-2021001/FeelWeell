import { Clock, Wind, Brain, Leaf, Heart, Zap, Dumbbell, CheckCircle2, Bookmark, BookmarkCheck } from 'lucide-react';

export const TYPE_CONFIG = {
    'RESPIRACIÓN': { icon: Wind, color: '#1565c0', bg: '#e3f2fd', label: 'Respiración' },
    'MEDITACIÓN': { icon: Brain, color: '#7b1fa2', bg: '#f3e5f5', label: 'Meditación' },
    'YOGA': { icon: Leaf, color: '#2e7d52', bg: '#e8f5e9', label: 'Yoga' },
    'RELAJACIÓN': { icon: Heart, color: '#c62828', bg: '#fce4ec', label: 'Relajación' },
    'MINDFULNESS': { icon: Zap, color: '#6d72d8', bg: '#edefff', label: 'Mindfulness' },
    'ESTIRAMIENTO': { icon: Dumbbell, color: '#e65100', bg: '#fff3e0', label: 'Estiramiento' },
};

const getDifficulty = (duration) => {
    if (duration <= 8) return { label: 'Fácil', color: 'text-[#2e7d52]' };
    if (duration <= 15) return { label: 'Intermedio', color: 'text-[#e65100]' };
    return { label: 'Avanzado', color: 'text-[#c62828]' };
};

export const UserExerciseCard = ({ exercise, onOpen, onSave }) => {
    const { isCompleted, isSaved } = exercise;
    const cfg = TYPE_CONFIG[exercise.type] ?? TYPE_CONFIG['MINDFULNESS'];
    const TypeIcon = cfg.icon;
    const diff = getDifficulty(exercise.duration);

    return (
        <div className={`bg-white rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-[0_6px_20px_rgba(90,85,140,0.10)] ${isCompleted ? 'border-[#a5d6a7]' : 'border-[#e5e7f0]'}`}>
            {/* Imagen */}
            <div className='relative w-full h-36 flex items-center justify-center overflow-hidden' style={{ background: cfg.bg + '66' }}>
                {exercise.photoUrl
                    ? <img src={exercise.photoUrl} alt={exercise.title} className='w-full h-full object-cover' />
                    : <TypeIcon size={40} style={{ color: cfg.color, opacity: 0.35 }} />
                }
                {isCompleted && (
                    <div className='absolute top-2 right-2 bg-[#2e7d52] text-white rounded-full p-1'>
                        <CheckCircle2 size={14} />
                    </div>
                )}
            </div>

            {/* Cuerpo */}
            <div className='flex flex-col gap-2 p-4 flex-1'>
                <h3 className='m-0 text-[14px] font-black text-[#2f3348] leading-snug'>{exercise.title}</h3>

                <div className='flex gap-1.5 flex-wrap'>
                    <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold' style={{ background: cfg.bg, color: cfg.color }}>
                        <TypeIcon size={10} /> {cfg.label}
                    </span>
                    <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#f0f0f0] text-[#555]'>
                        <Clock size={10} /> {exercise.duration} min
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#fafafa] ${diff.color}`}>
                        {diff.label}
                    </span>
                </div>

                <p className='m-0 text-[12px] text-fw-gray leading-relaxed line-clamp-2'>
                    {exercise.description}
                </p>
            </div>

            {/* Acciones */}
            <div className='flex gap-2 px-4 pb-4'>
                <button
                    onClick={() => onOpen(exercise)}
                    className={`flex-1 h-9 rounded-xl text-[13px] font-bold border-none cursor-pointer transition-colors
                        ${isCompleted
                            ? 'bg-[#e8f5e9] text-[#2e7d52] hover:bg-[#c8e6c9]'
                            : 'bg-fw-purple text-white hover:bg-fw-purple-light'
                        }`}
                >
                    {isCompleted ? 'Ver ejercicio' : 'Iniciar'}
                </button>
                <button
                    onClick={() => onSave(exercise._id, isSaved)}
                    title={isSaved ? 'Ya guardado' : 'Guardar para después'}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl border-none cursor-pointer transition-colors
                        ${isSaved
                            ? 'bg-fw-purple-bg text-fw-purple'
                            : 'bg-[#f5f5f5] text-[#bbb] hover:bg-fw-purple-bg hover:text-fw-purple'
                        }`}
                >
                    {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                </button>
            </div>
        </div>
    );
};