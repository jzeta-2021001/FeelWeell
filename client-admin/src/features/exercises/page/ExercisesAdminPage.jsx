import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useExerciseStore } from '../store/exerciseStore.js';
import { useSaveExercise } from '../hooks/useSaveExercise.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { ExercisesHeader } from '../components/ExercisesHeader.jsx';
import { ExercisesFilters } from '../components/ExercisesFilters.jsx';
import { ExercisesGrid } from '../components/ExercisesGrid.jsx';
import { ExerciseModal } from '../components/ExerciseModal.jsx';
import { ConfirmModal } from '../../users/components/ConfirmModal.jsx';

export const ExercisesAdminPage = () => {
    const { exercises, loading, getExercises, deleteExercise } = useExerciseStore();
    const { saveExercise } = useSaveExercise();
    const authUser = useAuthStore((s) => s.user);
    const canManage = authUser?.role === 'ADMIN_HEALTHY_ROLE';
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [profileFilter, setProfileFilter] = useState('ALL');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => { getExercises(); }, [getExercises]);

    const filteredExercises = useMemo(() => {
        const q = search.trim().toLowerCase();
        return exercises.filter((ex) => {
            const matchSearch = !q || (ex.title || '').toLowerCase().includes(q);
            const matchType = typeFilter === 'ALL' || ex.type === typeFilter;
            const matchProfile = profileFilter === 'ALL' || ex.targetProfile === profileFilter;
            return matchSearch && matchType && matchProfile;
        });
    }, [exercises, search, typeFilter, profileFilter]);

    const handleSearchChange = (e) => setSearch(e.target.value);
    const handleTypeChange = (e) => setTypeFilter(e.target.value);
    const handleProfileChange = (e) => setProfileFilter(e.target.value);

    const handleNewExercise = () => {
        setEditTarget(null);
        setModalOpen(true);
    };

    const handleEdit = (exercise) => {
        setEditTarget(exercise);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditTarget(null);
    };

    const handleSave = async (data) => {
        const result = await saveExercise(data, editTarget?._id);
        if (result?.success) {
            toast.success(editTarget ? 'Ejercicio actualizado correctamente' : 'Ejercicio creado correctamente');
            return { success: true };
        }
        toast.error(result?.error || 'Ocurrió un error al guardar el ejercicio');
        return { success: false };
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        const result = await deleteExercise(deleteTarget._id);
        result.success
            ? toast.success('Ejercicio eliminado correctamente')
            : toast.error(result.error || 'Error al eliminar el ejercicio');
        setDeleteTarget(null);
    };

    return (
        <div className='flex flex-col gap-5'>
            <ExercisesHeader onNewExercise={handleNewExercise} canManage={canManage} />

            <ExercisesFilters
                search={search}
                onSearchChange={handleSearchChange}
                typeFilter={typeFilter}
                onTypeChange={handleTypeChange}
                profileFilter={profileFilter}
                onProfileChange={handleProfileChange}
            />

            <ExercisesGrid
                exercises={filteredExercises}
                loading={loading}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                canManage={canManage}
            />

            {canManage && (
                <ExerciseModal
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    exercise={editTarget}
                    loading={loading}
                />
            )}

            {canManage && deleteTarget && (
                <ConfirmModal
                    title='Eliminar ejercicio'
                    description={`¿Eliminar el ejercicio "${deleteTarget.title}"? Esta acción no se puede deshacer.`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
};