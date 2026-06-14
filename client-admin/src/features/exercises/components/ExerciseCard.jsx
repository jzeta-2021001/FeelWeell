import { Clock, Dumbbell } from 'lucide-react';

const PROFILE_STYLES = {
    EQUILIBRADO: { label: 'Equilibrado', cls: 'bg-[#e8f5e9] text-[#2e7d52]' },
    RESILIENTE: { label: 'Resiliente', cls: 'bg-fw-purple-bg text-fw-purple' },
    ANSIOSO: { label: 'Ansioso', cls: 'bg-fw-purple-light text-white' },
    DEPRESIVO: { label: 'Depresivo', cls: 'bg-fw-pink/10 text-fw-pink' },
};

export const ExerciseCard = ({ exercise, onEdit, onDelete, canManage }) => {
    const profileStyle = PROFILE_STYLES[exercise.targetProfile] || PROFILE_STYLES.EQUILIBRADO;

    return (
        <div className='bg-white border border-[#e5e7f0] rounded-[16px] overflow-hidden flex flex-col hover:shadow-[0_8px_24px_rgba(90,85,140,0.08)] transition-shadow'>
            <div className='w-full h-40 bg-fw-purple-bg/40 flex items-center justify-center overflow-hidden'>
                {exercise.photoUrl ? (
                    <img src={exercise.photoUrl} alt={exercise.title} className='w-full h-full object-cover' />
                ) : (
                    <Dumbbell size={32} className='text-fw-purple-light' />
                )}
            </div>

            <div className='flex flex-col gap-2.5 p-4 flex-1'>
                <h3 className='m-0 text-[15px] font-black text-[#2f3348] leading-tight'>{exercise.title}</h3>

                <div className='flex gap-2 flex-wrap'>
                    <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-fw-purple-bg text-fw-purple'>
                        {exercise.type}
                    </span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold ${profileStyle.cls}`}>
                        {profileStyle.label}
                    </span>
                    <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#e3f2fd] text-[#1565c0]'>
                        <Clock size={11} /> {exercise.duration} min
                    </span>
                </div>

                <p className='m-0 text-[13px] text-fw-gray font-semibold leading-relaxed line-clamp-3'>
                    {exercise.description}
                </p>

                <div className="mt-1 rounded-xl p-3">
                    <span className="block text-xs font-black uppercase tracking-wide text-fw-purple mb-1">
                        Instrucciones
                    </span>

                    <p className="m-0 text-[13px] text-fw-gray font-semibold leading-relaxed">
                        {exercise.instructions}
                    </p>
                </div>
            </div>

            {canManage && (
                <div className='flex gap-2 px-4 pb-4'>
                    <button
                        onClick={() => onEdit(exercise)}
                        className='flex-1 h-9 border-none rounded-lg text-[13px] font-bold cursor-pointer bg-fw-purple-bg text-fw-purple hover:bg-fw-purple hover:text-white transition-colors'
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(exercise)}
                        className='flex-1 h-9 border-none rounded-lg text-[13px] font-bold cursor-pointer bg-fw-pink/10 text-fw-pink hover:bg-fw-pink hover:text-white transition-colors'
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};