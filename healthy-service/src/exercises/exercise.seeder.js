import Exercise from './exercise.model.js';

export const seedDailyChallenges = async () => {
    try {
        const count = await Exercise.countDocuments();
        if (count > 0) {
            console.log('✅ Base de datos ya contiene ejercicios. Seeder omitido.');
            return;
        }

        const challenges = [
            {
                title: "Camina 5 minutos",
                description: "Sal a caminar para despejar tu mente y oxigenar tu cuerpo.",
                type: "RELAJACIÓN",
                targetProfile: "ANSIOSO",
                duration: 5,
                instructions: "1. Levántate de tu asiento.\n2. Sal al aire libre.\n3. Concéntrate en tu respiración mientras caminas."
            },
            {
                title: "Escucha música que te haga feliz",
                description: "La musicoterapia eleva los niveles de dopamina instantáneamente.",
                type: "MINDFULNESS",
                targetProfile: "DEPRESIVO",
                duration: 10,
                instructions: "1. Busca un lugar cómodo.\n2. Ponte tus audífonos.\n3. Reproduce tus 3 canciones favoritas y cierra los ojos."
            },
            {
                title: "Estiramiento rápido de cuello",
                description: "Libera la tensión cervical acumulada tras horas frente a la pantalla.",
                type: "ESTIRAMIENTO",
                targetProfile: "EQUILIBRADO",
                duration: 3,
                instructions: "1. Siéntate derecho.\n2. Inclina tu cabeza hacia la derecha suavemente.\n3. Mantén 10 segundos y cambia de lado."
            },
            {
                title: "Respiración 4-7-8",
                description: "Técnica comprobada para reducir picos de estrés y anclarte al presente.",
                type: "RESPIRACIÓN",
                targetProfile: "RESILIENTE",
                duration: 4,
                instructions: "1. Inhala por la nariz durante 4 segundos.\n2. Mantén el aire 7 segundos.\n3. Exhala por la boca durante 8 segundos."
            }
        ];

        await Exercise.insertMany(challenges);
        console.log('✅ Seeder ejecutado: Retos diarios funcionales inyectados en MongoDB.');
    } catch (error) {
        console.error('❌ Error inyectando los retos diarios:', error.message);
    }
};