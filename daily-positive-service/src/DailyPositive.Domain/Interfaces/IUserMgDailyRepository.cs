using System;
using DailyPositive.Domain.Entities;

namespace DailyPositive.Domain.Interfaces;

public interface IUserMgDailyRepository
{
    Task<UserDailyMessage?> GetTodayAssignment (string userId, DateTime today);
    Task<UserDailyMessage?> GetLastAssignment (string userId);
    Task CreateAsync(UserDailyMessage userDailyMessage);
}
