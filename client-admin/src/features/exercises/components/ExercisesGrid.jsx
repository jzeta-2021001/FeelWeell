import { ExerciseCard } from './ExerciseCard.jsx';

export const ExercisesGrid = ({ exercises, loading, onEdit, onDelete, canManage }) => {
    if (loading && exercises.length === 0) {
        return (
            <div className='bg-white border border-[#e5e7f0] rounded-lg px-4 py-12 text-center text-fw-gray/60 font-bold'>
                Cargando ejercicios...
            </div>
        );
    }
    
    if (exercises.length === 0) {
        return (
            <div className='bg-white border border-[#e5e7f0] rounded-lg px-4 py-12 text-center text-fw-gray/60 font-bold'>
                No hay ejercicios para mostrar.
            </div>
        );
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {exercises.map((exercise) => (
                <ExerciseCard
                    key={exercise._id}
                    exercise={exercise}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    canManage={canManage}
                />
            ))}
        </div>
    );
};