using System;
using DailyPositive.Domain.Entities;
using DailyPositive.Domain.Interfaces;
using DailyPositive.Persistence.Data;
using MongoDB.Driver;

namespace DailyPositive.Persistence.Repositories;

public class UserDailyMgRepository(MongoDbContext context) : IUserMgDailyRepository
{
    private readonly IMongoCollection<UserDailyMessage> collection = context.UserDailyMessages;

    public async Task<UserDailyMessage?> GetTodayAssignment(string userId, DateTime today)
    {
        // busca un registro
        var filter = Builders<UserDailyMessage>.Filter.And(
            Builders<UserDailyMessage>.Filter.Eq(u => u.UserId, userId),
            Builders<UserDailyMessage>.Filter.Gte(u => u.AssignedDate, today),
            Builders<UserDailyMessage>.Filter.Lt(u => u.AssignedDate, today.AddDays(1))
        );

        return await collection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<UserDailyMessage?> GetLastAssignment(string userId)
    {
        // trae el último mensaje que recibió este usuario ordenando por fecha descendente y tomando el primero
        return await collection
            .Find(u => u.UserId == userId)
            .SortByDescending(u => u.AssignedDate)
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(UserDailyMessage userDailyMessage)
    {
        await collection.InsertOneAsync(userDailyMessage);
    }

}
