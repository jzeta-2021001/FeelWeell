namespace DailyPositive.Application.DTOs;

/// <summary>Datos requeridos para crear un nuevo mensaje motivacional</summary>
public class CreatedMessageDto
{
    /// <summary>Texto del mensaje motivacional (obligatorio)</summary>
    /// <example>El éxito es la suma de pequeños esfuerzos repetidos día a día.</example>
    public string Content { get; set; } = string.Empty;

    /// <summary>Autor o fuente del mensaje (opcional)</summary>
    /// <example>Robert Collier</example>
    public string? Author { get; set; }

    /// <summary>Categoría temática del mensaje</summary>
    /// <example>motivacion</example>
    public string Category { get; set; } = "general";
}