import { useEffect, useMemo, useState } from 'react';
import { useUserExerciseStore } from '../store/userExerciseStore.js';

const EXERCISE_TYPES = ['RESPIRACIÓN', 'MEDITACIÓN', 'YOGA', 'RELAJACIÓN', 'MINDFULNESS', 'ESTIRAMIENTO'];

export const useUserExercises = () => {
    const {
        exercises,
        recommended,
        progress,
        loading,
        progressLoading,
        fetchExercises,
        fetchRecommended,
        fetchProgress,
        completeExercise,
        saveExercise,
    } = useUserExerciseStore();

    const [typeFilter, setTypeFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchExercises();
        fetchRecommended();
        fetchProgress();
    }, [fetchExercises, fetchRecommended, fetchProgress]);

    const filteredExercises = useMemo(() => {
        const q = search.trim().toLowerCase();
        return exercises.filter((ex) => {
            const matchType = typeFilter === 'ALL' || ex.type === typeFilter;
            const matchSearch = !q || ex.title.toLowerCase().includes(q);
            return matchType && matchSearch;
        });
    }, [exercises, typeFilter, search]);

    // IDs completados y guardados a partir del progreso
    const completedIds = useMemo(() => {
        return new Set((progress?.completed ?? []).map((p) => p.exercise?._id ?? p.exercise));
    }, [progress]);

    const savedIds = useMemo(() => {
        return new Set((progress?.saved ?? []).map((p) => p.exercise?._id ?? p.exercise));
    }, [progress]);

    return {
        exercises: filteredExercises,
        recommended,
        progress,
        loading,
        progressLoading,
        typeFilter,
        setTypeFilter,
        search,
        setSearch,
        completeExercise,
        saveExercise,
        completedIds,
        savedIds,
        EXERCISE_TYPES,
    };
};