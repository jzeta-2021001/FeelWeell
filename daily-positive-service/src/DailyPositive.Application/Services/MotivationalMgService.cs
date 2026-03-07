using System;
using DailyPositive.Application.DTOs;
using DailyPositive.Application.Interfaces;
using DailyPositive.Domain.Entities;
using DailyPositive.Domain.Interfaces;
namespace DailyPositive.Application.Services;

public class MotivationalMgService : IMotivationMgService
{
    private readonly IMotivationalMgRepository messageRepositoy;
    private readonly IUserMgDailyRepository userMgDailyRepository;

    public MotivationalMgService(
        IMotivationalMgRepository messageRepo,
        IUserMgDailyRepository userDailyRepo
    )
    {
        messageRepositoy = messageRepo;
        userMgDailyRepository = userDailyRepo;
    }

    public static MessageResponseDto MapToResponse(MotivationMessage m) => new()
    {
        IdMotivation = m.IdMotivation!,
        Content = m.Content,
        Author = m.Author,
        Category = m.Category,
        IsActive = m.IsActive,
        OrderIndex = m.OrderIndex,
        CreatedAt = m.CreatedAt,
        UpdatedAt = m.UpdateAt

    };

    //crud de admin
    public async Task<List<MessageResponseDto>> GetAllAsync()
    {
        var message = await messageRepositoy.GetAllAsync();
        return message.Select(MapToResponse).ToList();
    }



    public async Task<List<MessageResponseDto>> GetAllActiveAsync()
    {
        var message = await messageRepositoy.GetAllActiveAsync();
        return message.Select(MapToResponse).ToList();
    }


    public async Task<MessageResponseDto?> GetByIdAsync(string id)
    {
        var message = await messageRepositoy.GetByIdAsync(id);
        return message is null ? null : MapToResponse(message);
    }

    public async Task<MessageResponseDto> CreateAsync(CreatedMessageDto dto)
    {
        int nextIndex = await messageRepositoy.GetMaxOrderIndex() + 1;
        var message = new MotivationMessage
        {
            Content = dto.Content.Trim(),
            Author = dto.Author?.Trim(),
            Category = dto.Category.Trim(),
            IsActive = true,
            OrderIndex = nextIndex,
            CreatedAt = DateTime.UtcNow,
            UpdateAt = DateTime.UtcNow

        };

        await messageRepositoy.CreateAsync(message);
        return MapToResponse(message);
    }

    public async Task<MessageResponseDto?> PatchAsync(string id, PatchMessageDto dto)
    {
        var existing = await messageRepositoy.GetByIdAsync(id.Trim());
        if(existing is null) return null;

        //solo actualiza los campos que vienen con valor, si el campo es null entonces el cliente no quiso cambiarlo
        if(dto.Content is not null) existing.Content =
        dto.Content.Trim();

        if(dto.Author != null) existing.Author = dto.Author.Trim();

        if(dto.Category != null) existing.Category = dto.Category.Trim();

        if(dto.IsActive != null) existing.IsActive = dto.IsActive.Value;
        existing.UpdateAt = DateTime.UtcNow;

        await messageRepositoy.UpdateAsync(id, existing);
        return MapToResponse(existing);
    
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var existing = await messageRepositoy.GetByIdAsync(id);
        if(existing is null) return false;

        await messageRepositoy.DeleteAsync(id);
        return true;
    }

    //logica del mensaje diario

    public async Task<DailyMgResponseDto> GetDailyMgForUser(string userId)
    {
        var today = DateTime.UtcNow.Date;
        var existingAssignament = await userMgDailyRepository.GetTodayAssignment(userId, today);

        if (existingAssignament != null)
        {
            var existingMessage = await messageRepositoy.GetByIdAsync(existingAssignament.MessageId);
            if(existingMessage == null) throw new KeyNotFoundException("Mensaje no encontrado");

            return new DailyMgResponseDto
            {
                MessageId = existingMessage.IdMotivation!,
                Content = existingMessage.Content,
                Author = existingMessage.Author,
                Category = existingMessage.Category,
                AssignedDate = existingAssignament.AssignedDate,
                IsNewAssignment = false
            };
        }

        //si es otro día se cacula el siguiente mensaje en rotacón
        var activeMessages = await messageRepositoy.GetAllActiveAsync();
        if(activeMessages.Count == 0) throw new InvalidOperationException("No hay mensajes activos");

        //orderIndex garantiza rotación constante
        activeMessages = activeMessages.OrderBy(m =>m.OrderIndex).ToList();

        MotivationMessage nextMessage;
        var lastAssignment = await userMgDailyRepository.GetLastAssignment(userId);

        if(lastAssignment is null)
        {
            //primer mensaje de la lista
            nextMessage = activeMessages[0];
        }
        else
        {
            var lastMessage = await messageRepositoy.GetByIdAsync(lastAssignment.MessageId);
            if (lastMessage is null)
            {
                nextMessage = activeMessages[0];
            }
            else
            {
                int lastIdx = activeMessages.FindIndex(m => m.IdMotivation == lastMessage.IdMotivation);
                int nextIdx = (lastIdx + 1) % activeMessages.Count;
                nextMessage = activeMessages[nextIdx];
            }
        }

        //se guarda la asginación del mismo día para recibir el mismo mensaje
        var newAssignment = new UserDailyMessage
        {
            UserId = userId,
            MessageId = nextMessage.IdMotivation!,
            AssignedDate = today,
            CreatedAt = DateTime.UtcNow
        };

        await userMgDailyRepository.CreateAsync(newAssignment);
        return new DailyMgResponseDto
        {
            MessageId = nextMessage.IdMotivation!,
            Content = nextMessage.Content,
            Author = nextMessage.Author,
            Category = nextMessage.Category,
            AssignedDate = today,
            IsNewAssignment = true
        };
    }

}
