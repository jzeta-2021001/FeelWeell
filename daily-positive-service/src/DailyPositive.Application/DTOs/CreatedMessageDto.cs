using System;

namespace DailyPositive.Application.DTOs;

public class CreatedMessageDto
{
    public string Content {get;set;} = string.Empty;
    public string? Author {get; set;}
    public string Category {get; set;} = "general";
    
}
