using System;
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
        // verifica si ya hay mensajes en la colección
        var count = await context.Messages.CountDocumentsAsync(Builders<MotivationMessage>.Filter.Empty);

        if (count > 0) return;

        //si la colección está vacía, inserta los mensajes iniciales
        var messages = new List<MotivationMessage>
        {
            new()
            {
                Content = "Cada día es una nueva oportunidad para ser mejor que ayer. ¡Tú puedes lograrlo!",
                Author = "FeelWell",
                Category = "motivacion",
                IsActive = true,
                OrderIndex = 1,
                CreatedAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow
            },
            new()
            {
                Content = "La resiliencia no es evitar las tormentas, sino aprender a bailar bajo la lluvia.",
                Author = "Anónimo",
                Category = "resiliencia",
                IsActive = true,
                OrderIndex = 2,
                CreatedAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow
            },
            new()
            {
                Content = "Tu bienestar mental importa. Dedica tiempo a cuidarte hoy.",
                Author = "FeelWell",
                Category = "bienestar",
                IsActive = true,
                OrderIndex = 3,
                CreatedAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow
            },
            new()
            {
                Content = "Pequeños pasos cada día construyen grandes cambios con el tiempo.",
                Author = "FeelWell",
                Category = "motivacion",
                IsActive = true,
                OrderIndex = 4,
                CreatedAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow
            },
            new()
            {
                Content = "No tienes que ser perfecto para ser valioso. Eres suficiente tal como eres.",
                Author = "Anónimo",
                Category = "autoestima",
                IsActive = true,
                OrderIndex = 5,
                CreatedAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow
            },
            new()
            {
                Content = "Respirar profundo no resuelve los problemas, pero te da la calma para enfrentarlos.",
                Author = "FeelWell",
                Category = "bienestar",
                IsActive = true,
                OrderIndex = 6,
                CreatedAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow
            },
            new()
            {
                Content = "Pedir ayuda es una muestra de fortaleza, no de debilidad.",
                Author = "FeelWell",
                Category = "resiliencia",
                IsActive = true,
                OrderIndex = 7,
                CreatedAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow
            }
        };

        await context.Messages.InsertManyAsync(messages);

        Console.WriteLine($"Seeder: {messages.Count} mensajes motivacionales insertados.");
    }
}
