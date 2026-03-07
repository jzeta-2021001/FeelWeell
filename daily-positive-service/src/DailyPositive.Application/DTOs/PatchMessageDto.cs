using System;

namespace DailyPositive.Application.DTOs;

public class PatchMessageDto
{
    public string? Content {get; set;}
    public string? Author {get; set;}
    public string? Category {get; set;}
    public bool? IsActive {get; set;}
}
