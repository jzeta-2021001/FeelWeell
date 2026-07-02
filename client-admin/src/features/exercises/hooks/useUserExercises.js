import { useEffect, useMemo, useState } from 'react';
import { useUserExerciseStore } from '../store/userExerciseStore.js';

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
        toggleSaveExercise,
    } = useUserExerciseStore();

    const [typeFilter, setTypeFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'saved'

    useEffect(() => {
        fetchExercises();
        fetchRecommended();
        fetchProgress();
    }, [fetchExercises, fetchRecommended, fetchProgress]);

    // Sets de IDs para lookups O(1)
    const completedIds = useMemo(() => {
        return new Set(
            (progress?.completed ?? []).map((p) => p.exercise?._id ?? p.exercise)
        );
    }, [progress]);

    const savedIds = useMemo(() => {
        return new Set(
            (progress?.saved ?? []).map((p) => p.exercise?._id ?? p.exercise)
        );
    }, [progress]);

    // Ejercicios completos enriquecidos con estado del usuario
    const enrichedExercises = useMemo(() => {
        return exercises.map((ex) => ({
            ...ex,
            isCompleted: completedIds.has(ex._id),
            isSaved: savedIds.has(ex._id),
        }));
    }, [exercises, completedIds, savedIds]);

    // Filtrado para pestaña "Todos"
    const filteredExercises = useMemo(() => {
        const q = search.trim().toLowerCase();
        return enrichedExercises.filter((ex) => {
            const matchType = typeFilter === 'ALL' || ex.type === typeFilter;
            const matchSearch = !q || ex.title.toLowerCase().includes(q);
            return matchType && matchSearch;
        });
    }, [enrichedExercises, typeFilter, search]);

    // Ejercicios guardados para después (con datos completos cruzando con exercises)
    const savedExercises = useMemo(() => {
        const savedList = progress?.saved ?? [];
        return savedList
            .map((p) => {
                const id = p.exercise?._id ?? p.exercise;
                const full = exercises.find((ex) => ex._id === id);
                return full
                    ? { ...full, isCompleted: completedIds.has(full._id), isSaved: true, savedAt: p.savedAt }
                    : null;
            })
            .filter(Boolean);
    }, [progress, exercises, completedIds]);

    // Ejercicios completados con datos completos
    const completedExercises = useMemo(() => {
        const completedList = progress?.completed ?? [];
        return completedList
            .map((p) => {
                const id = p.exercise?._id ?? p.exercise;
                const full = exercises.find((ex) => ex._id === id);
                return full
                    ? { ...full, isCompleted: true, isSaved: savedIds.has(full._id), completedAt: p.completedAt }
                    : null;
            })
            .filter(Boolean);
    }, [progress, exercises, savedIds]);

    return {
        // Datos
        filteredExercises,
        savedExercises,
        completedExercises,
        recommended,
        progress,
        // Estados
        loading,
        progressLoading,
        // Filtros
        typeFilter,
        setTypeFilter,
        search,
        setSearch,
        activeTab,
        setActiveTab,
        // Acciones
        completeExercise,
        toggleSaveExercise,
        // Helpers
        completedIds,
        savedIds,
    };
};