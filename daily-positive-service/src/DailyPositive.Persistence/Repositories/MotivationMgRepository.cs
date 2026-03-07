using System;
using DailyPositive.Domain.Entities;
using DailyPositive.Domain.Interfaces;
using DailyPositive.Persistence.Data;
using MongoDB.Bson;
using MongoDB.Driver;

namespace DailyPositive.Persistence.Repositories;

public class MotivationMgRepository(MongoDbContext context) : IMotivationalMgRepository
{
    private readonly IMongoCollection<MotivationMessage> collection = context.Messages;

    public async Task CreateAsync(MotivationMessage message)
    {
        await collection.InsertOneAsync(message);
    }

    public async Task DeleteAsync(string id)
    {
        var objectId = ObjectId.Parse(id);
        var filter = Builders<MotivationMessage>.Filter.Eq("_id", objectId);
        await collection.DeleteOneAsync(filter);
    }

    public async Task<List<MotivationMessage>> GetAllActiveAsync()
    {
        return await collection
            .Find(m => m.IsActive)
            .SortBy(m => m.OrderIndex)
            .ToListAsync();
    }

    public async Task<List<MotivationMessage>> GetAllAsync()
    {
        return await collection
            .Find(_=> true)
            .SortBy(m => m.OrderIndex)
            .ToListAsync();
    }

    public async Task<MotivationMessage?> GetByIdAsync(string id)
    {
        if(!ObjectId.TryParse(id, out var objectId))
            return null;
        var filter = Builders<MotivationMessage>.Filter.Eq("_id", objectId);
        return await collection
            .Find(filter)
            .FirstOrDefaultAsync();
    }

    public async Task<int> GetMaxOrderIndex()
    {
        var last = await collection
            .Find(_=> true)
            .SortByDescending(m => m.OrderIndex)
            .FirstOrDefaultAsync();

        return last?.OrderIndex ?? 0; //si aún no hay ningun msg aún, retorna 0
    }

    public async Task UpdateAsync(string id, MotivationMessage message)
    {
        var objectId = ObjectId.Parse(id);
        var filter = Builders<MotivationMessage>.Filter.Eq("_id", objectId);
        await collection.ReplaceOneAsync(filter, message);
    }
}
