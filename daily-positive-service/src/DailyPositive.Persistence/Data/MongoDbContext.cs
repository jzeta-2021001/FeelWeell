using System;
using DailyPositive.Domain.Entities;
using DailyPositive.Persistence.Config;
using Microsoft.Extensions;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace DailyPositive.Persistence.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase database;

    public MongoDbContext(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);

        //se selecciona la DB si no existe la crea mongoDB
        database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoCollection<MotivationMessage> Messages =>
    database.GetCollection<MotivationMessage>("motivational_messages");

    public IMongoCollection<UserDailyMessage> UserDailyMessages =>
    database.GetCollection<UserDailyMessage> ("user_daily_messages");

}
