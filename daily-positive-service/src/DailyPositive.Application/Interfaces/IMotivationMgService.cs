using System;
using DailyPositive.Application.DTOs;

namespace DailyPositive.Application.Interfaces;

public interface IMotivationMgService
{
    //admin crud
    Task<List<MessageResponseDto>> GetAllAsync();
    Task<List<MessageResponseDto>> GetAllActiveAsync();
    Task<MessageResponseDto?> GetByIdAsync(string id);
    Task<MessageResponseDto> CreateAsync(CreatedMessageDto dto);
    Task<MessageResponseDto?> PatchAsync(string id, PatchMessageDto dto);
    Task<bool> DeleteAsync(string id);

    //usuario
    Task<DailyMgResponseDto> GetDailyMgForUser(string userId);
}
