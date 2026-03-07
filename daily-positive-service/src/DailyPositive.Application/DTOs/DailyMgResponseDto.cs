using System;

namespace DailyPositive.Application.DTOs;

public class DailyMgResponseDto
{
    public string MessageId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Author { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime AssignedDate { get; set; }
    public bool IsNewAssignment { get; set; } // true es que hay mensaje nuevo de hoy, false ya se había asignado antes hoy

}
