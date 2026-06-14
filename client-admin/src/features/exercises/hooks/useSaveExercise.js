import { useExerciseStore } from '../../exercises/store/exerciseStore.js';

export const useSaveExercise = () => {
    const createExercise = useExerciseStore((state) => state.createExercise);
    const updateExercise = useExerciseStore((state) => state.updateExercise);

    const saveExercise = async (data, exerciseId = null) => {
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('type', data.type);
        formData.append('duration', data.duration);
        formData.append('instructions', data.instructions);
        if (data.photo?.length > 0) {
            formData.append('photo', data.photo[0]);
        }
        formData.append('targetProfile', data.targetProfile);

        if (exerciseId) {
            return await updateExercise(exerciseId, formData);
        } else {
            return await createExercise(formData);
        }
    };
    return { saveExercise };
}