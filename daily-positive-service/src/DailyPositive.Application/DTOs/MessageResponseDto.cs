namespace DailyPositive.Application.DTOs;

/// <summary>Representación completa de un mensaje motivacional</summary>
public class MessageResponseDto
{
    /// <summary>ID del documento en MongoDB</summary>
    /// <example>6634a1f2e3b5c900123abcde</example>
    public string IdMotivation { get; set; } = string.Empty;

    /// <summary>Texto del mensaje</summary>
    /// <example>El éxito es la suma de pequeños esfuerzos repetidos día a día.</example>
    public string Content { get; set; } = string.Empty;

    /// <summary>Autor del mensaje</summary>
    /// <example>Robert Collier</example>
    public string? Author { get; set; }

    /// <summary>Categoría temática</summary>
    /// <example>motivacion</example>
    public string Category { get; set; } = string.Empty;

    /// <summary>Indica si el mensaje está activo y visible para los usuarios</summary>
    /// <example>true</example>
    public bool IsActive { get; set; }

    /// <summary>Posición en el orden de rotación</summary>
    /// <example>1</example>
    public int OrderIndex { get; set; }

    /// <summary>Fecha de creación (UTC)</summary>
    /// <example>2024-05-01T10:00:00Z</example>
    public DateTime CreatedAt { get; set; }

    /// <summary>Fecha de última actualización (UTC)</summary>
    /// <example>2024-05-02T08:30:00Z</example>
    public DateTime UpdatedAt { get; set; }
}