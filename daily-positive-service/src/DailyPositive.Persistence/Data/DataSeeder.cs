using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DailyPositive.Domain.Entities;
using MongoDB.Driver;

namespace DailyPositive.Persistence.Data;

public class DataSeeder(MongoDbContext contexto)
{
    private readonly MongoDbContext context = contexto;

    public async Task SendAsync()
    {
        await SeedMessagesAsync();
    }

    private async Task SeedMessagesAsync()
    {
        var count = await context.Messages.CountDocumentsAsync(Builders<MotivationMessage>.Filter.Empty);

        if (count > 0) return;

        var messages = new List<MotivationMessage>
        {
            new() {
                Content = "Cada día es una nueva oportunidad para ser mejor que ayer. ¡Tú puedes lograrlo!",
                Author = "FeelWell", Category = "motivacion", IsActive = true, OrderIndex = 1,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "La resiliencia no es evitar las tormentas, sino aprender a bailar bajo la lluvia.",
                Author = "Anónimo", Category = "resiliencia", IsActive = true, OrderIndex = 2,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Tu bienestar mental importa. Dedica tiempo a cuidarte hoy.",
                Author = "FeelWell", Category = "bienestar", IsActive = true, OrderIndex = 3,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Pequeños pasos cada día construyen grandes cambios con el tiempo.",
                Author = "FeelWell", Category = "motivacion", IsActive = true, OrderIndex = 4,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "No tienes que ser perfecto para ser valioso. Eres suficiente tal como eres.",
                Author = "Anónimo", Category = "autoestima", IsActive = true, OrderIndex = 5,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Respirar profundo no resuelve los problemas, pero te da la calma para enfrentarlos.",
                Author = "FeelWell", Category = "bienestar", IsActive = true, OrderIndex = 6,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Pedir ayuda es una muestra de fortaleza, no de debilidad.",
                Author = "FeelWell", Category = "resiliencia", IsActive = true, OrderIndex = 7,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "El fracaso es solo la oportunidad de comenzar de nuevo de forma más inteligente.",
                Author = "Henry Ford", Category = "motivacion", IsActive = true, OrderIndex = 8,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Rodéate de personas que iluminen tu camino y sumen paz a tu vida.",
                Author = "FeelWell", Category = "bienestar", IsActive = true, OrderIndex = 9,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Acepta lo que no puedes cambiar y ten el valor de cambiar lo que sí puedes.",
                Author = "Anónimo", Category = "resiliencia", IsActive = true, OrderIndex = 10,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Tu mente es un jardín. Tus pensamientos son las semillas. Elige cultivar flores.",
                Author = "FeelWell", Category = "autoestima", IsActive = true, OrderIndex = 11,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "La motivación te impulsa a comenzar; el hábito te permite continuar.",
                Author = "Jim Ryun", Category = "motivacion", IsActive = true, OrderIndex = 12,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Está bien tener un mal día. Mañana el sol volverá a salir.",
                Author = "FeelWell", Category = "bienestar", IsActive = true, OrderIndex = 13,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "La confianza en uno mismo es el primer secreto del éxito.",
                Author = "Ralph Waldo Emerson", Category = "autoestima", IsActive = true, OrderIndex = 14,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "El descanso también es productivo. No te sientas culpable por recargar energías.",
                Author = "FeelWell", Category = "bienestar", IsActive = true, OrderIndex = 15,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "No importa lo lento que vayas, siempre y cuando no te detengas.",
                Author = "Confucio", Category = "resiliencia", IsActive = true, OrderIndex = 16,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Eres el autor de tu propia historia. Escribe un capítulo increíble hoy.",
                Author = "FeelWell", Category = "motivacion", IsActive = true, OrderIndex = 17,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Sé amable contigo mismo; estás haciendo lo mejor que puedes con lo que tienes.",
                Author = "Anónimo", Category = "autoestima", IsActive = true, OrderIndex = 18,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Los grandes logros no son hechos por la fuerza, sino por la perseverancia.",
                Author = "Samuel Johnson", Category = "resiliencia", IsActive = true, OrderIndex = 19,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Agradece por lo que tienes mientras trabajas por lo que quieres.",
                Author = "FeelWell", Category = "bienestar", IsActive = true, OrderIndex = 20,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Tu valor no se mide por tu productividad, sino por tu esencia.",
                Author = "FeelWell", Category = "autoestima", IsActive = true, OrderIndex = 21,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Las cicatrices son la prueba de que el dolor sanó y tú sobreviviste.",
                Author = "Anónimo", Category = "resiliencia", IsActive = true, OrderIndex = 22,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Enfócate en el progreso, no en la perfección.",
                Author = "FeelWell", Category = "motivacion", IsActive = true, OrderIndex = 23,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "La paz interior comienza en el momento en que decides no permitir que otra persona controle tus emociones.",
                Author = "Roy T. Bennett", Category = "bienestar", IsActive = true, OrderIndex = 24,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "No dejes que lo que no puedes hacer interfiera con lo que puedes hacer.",
                Author = "John Wooden", Category = "motivacion", IsActive = true, OrderIndex = 25,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Háblate a ti mismo como hablarías a alguien que amas.",
                Author = "Brené Brown", Category = "autoestima", IsActive = true, OrderIndex = 26,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Desconéctate para reconectar contigo mismo.",
                Author = "FeelWell", Category = "bienestar", IsActive = true, OrderIndex = 27,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Un mar en calma nunca hizo a un marinero experto. Las dificultades te fortalecen.",
                Author = "Proverbio", Category = "resiliencia", IsActive = true, OrderIndex = 28,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "Celebra tus pequeñas victorias, ellas son el motor de tus grandes metas.",
                Author = "FeelWell", Category = "motivacion", IsActive = true, OrderIndex = 29,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            },
            new() {
                Content = "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
                Author = "Robert Collier", Category = "motivacion", IsActive = true, OrderIndex = 30,
                CreatedAt = DateTime.UtcNow, UpdateAt = DateTime.UtcNow
            }
        };

        await context.Messages.InsertManyAsync(messages);

        Console.WriteLine($"Seeder: {messages.Count} mensajes motivacionales insertados para rotación mensual.");
    }
}