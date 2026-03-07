using System;

namespace DailyPositive.Application.DTOs;

public class MessageResponseDto
{
    public string IdMotivation { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Author { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int OrderIndex { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
}
