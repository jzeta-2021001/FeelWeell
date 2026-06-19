import { Clock, Dumbbell, Wind, Brain, Leaf, Heart, Zap, CheckCircle2, Bookmark, BookmarkCheck, PlayCircle } from 'lucide-react';

const TYPE_CONFIG = {
    'RESPIRACIÓN': { icon: Wind, color: 'bg-[#e3f2fd] text-[#1565c0]', label: 'Respiración' },
    'MEDITACIÓN': { icon: Brain, color: 'bg-[#f3e5f5] text-[#7b1fa2]', label: 'Meditación' },
    'YOGA': { icon: Leaf, color: 'bg-[#e8f5e9] text-[#2e7d52]', label: 'Yoga' },
    'RELAJACIÓN': { icon: Heart, color: 'bg-[#fce4ec] text-[#c62828]', label: 'Relajación' },
    'MINDFULNESS': { icon: Zap, color: 'bg-fw-purple-bg text-fw-purple', label: 'Mindfulness' },
    'ESTIRAMIENTO': { icon: Dumbbell, color: 'bg-[#fff3e0] text-[#e65100]', label: 'Estiramiento' },
};

const DIFFICULTY_MAP = {
    1: { label: 'Fácil', color: 'text-[#2e7d52]' },
    2: { label: 'Intermedio', color: 'text-[#e65100]' },
    3: { label: 'Avanzado', color: 'text-[#c62828]' },
};

const getDifficulty = (duration) => {
    if (duration <= 8) return DIFFICULTY_MAP[1];
    if (duration <= 15) return DIFFICULTY_MAP[2];
    return DIFFICULTY_MAP[3];
};

export const UserExerciseCard = ({ exercise, isCompleted, isSaved, onStart, onSave }) => {
    const cfg = TYPE_CONFIG[exercise.type] ?? TYPE_CONFIG['MINDFULNESS'];
    const TypeIcon = cfg.icon;
    const diff = getDifficulty(exercise.duration);

    return (
        <div className={`bg-white border rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-[0_8px_24px_rgba(90,85,140,0.10)] ${isCompleted ? 'border-[#a5d6a7]' : 'border-[#e5e7f0]'}`}>
            {/* Imagen / placeholder */}
            <div className='relative w-full h-36 bg-fw-purple-bg/40 flex items-center justify-center overflow-hidden'>
                {exercise.photoUrl ? (
                    <img src={exercise.photoUrl} alt={exercise.title} className='w-full h-full object-cover' />
                ) : (
                    <TypeIcon size={36} className='text-fw-purple-light opacity-60' />
                )}
                {isCompleted && (
                    <div className='absolute top-2 right-2 bg-[#2e7d52] text-white rounded-full p-1'>
                        <CheckCircle2 size={16} />
                    </div>
                )}
            </div>

            {/* Cuerpo */}
            <div className='flex flex-col gap-2 p-4 flex-1'>
                <h3 className='m-0 text-[15px] font-black text-[#2f3348] leading-tight'>{exercise.title}</h3>

                <div className='flex gap-1.5 flex-wrap'>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${cfg.color}`}>
                        <TypeIcon size={11} /> {cfg.label}
                    </span>
                    <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f0f0f0] text-[#555]'>
                        <Clock size={11} /> {exercise.duration} min
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#f9f9f9] ${diff.color}`}>
                        {diff.label}
                    </span>
                </div>

                <p className='m-0 text-[13px] text-fw-gray font-semibold leading-relaxed line-clamp-2'>
                    {exercise.description}
                </p>
            </div>

            {/* Acciones */}
            <div className='flex gap-2 px-4 pb-4'>
                <button
                    onClick={() => onStart(exercise)}
                    className={`flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl text-[13px] font-bold cursor-pointer border-none transition-colors ${isCompleted ? 'bg-[#e8f5e9] text-[#2e7d52] hover:bg-[#c8e6c9]' : 'bg-fw-purple text-white hover:bg-fw-purple-light'}`}
                >
                    <PlayCircle size={15} />
                    {isCompleted ? 'Ver ejercicio' : 'Iniciar'}
                </button>
                <button
                    onClick={() => onSave(exercise._id)}
                    title={isSaved ? 'Guardado' : 'Guardar para después'}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl border-none cursor-pointer transition-colors ${isSaved ? 'bg-fw-purple-bg text-fw-purple' : 'bg-[#f5f5f5] text-[#aaa] hover:bg-fw-purple-bg hover:text-fw-purple'}`}
                >
                    {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                </button>
            </div>
        </div>
    );
};