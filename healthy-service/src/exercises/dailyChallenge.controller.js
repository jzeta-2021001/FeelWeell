import Exercise from './exercise.model.js';

export const getDailyChallenge = async (req, res) => {
    try {
        const { mood } = req.query; 
        let query = {};
        
        // Mapeo seguro: Corregido de targetMood a targetProfile (según tu modelo)
        if (mood && mood !== 'null' && mood !== 'undefined') {
            query = { targetProfile: new RegExp(`^${mood}$`, 'i') }; 
        }
        
        let count = await Exercise.countDocuments(query);
        
        // Failsafe: Si no encuentra para ese mood específico, busca cualquier reto
        if (count === 0) {
            query = {}; // Quitamos el filtro para buscar en todos los ejercicios
            count = await Exercise.countDocuments(query);
            
            if (count === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: "No se encontraron retos en la base de datos." 
                });
            }
        }

        // ALGORITMO DETERMINISTA: El mismo reto para todo el día
        const today = new Date();
        // Crea un identificador único para el día de hoy (Ej: 20260707)
        const dateSeed = (today.getFullYear() * 10000) + ((today.getMonth() + 1) * 100) + today.getDate();
        
        // El módulo garantiza un índice constante dentro de la cantidad de retos disponibles
        const index = dateSeed % count;

        const challenge = await Exercise.findOne(query).skip(index);

        return res.status(200).json({ 
            success: true, 
            data: challenge 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Error interno al calcular el reto diario.", 
            error: error.message 
        });
    }
};