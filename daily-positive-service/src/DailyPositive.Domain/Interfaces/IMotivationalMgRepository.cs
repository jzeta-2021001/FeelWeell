using System;
using DailyPositive.Domain.Entities;

namespace DailyPositive.Domain.Interfaces;

public interface IMotivationalMgRepository
{
    Task<List<MotivationMessage>> GetAllAsync();
    Task<List<MotivationMessage>> GetAllActiveAsync();
    Task<MotivationMessage?> GetByIdAsync(string id);
    Task<int> GetMaxOrderIndex();
    Task CreateAsync(MotivationMessage message);
    Task UpdateAsync(string id, MotivationMessage message);
    Task DeleteAsync(string id);
}
