namespace DailyPositive.Application.DTOs;

/// <summary>Mensaje motivacional asignado al usuario para el día actual</summary>
public class DailyMgResponseDto
{
    /// <summary>ID del mensaje motivacional asignado</summary>
    /// <example>6634a1f2e3b5c900123abcde</example>
    public string MessageId { get; set; } = string.Empty;

    /// <summary>Texto del mensaje del día</summary>
    /// <example>Cree en ti mismo y todo será posible.</example>
    public string Content { get; set; } = string.Empty;

    /// <summary>Autor del mensaje</summary>
    /// <example>Anónimo</example>
    public string? Author { get; set; }

    /// <summary>Categoría temática del mensaje</summary>
    /// <example>motivacion</example>
    public string Category { get; set; } = string.Empty;

    /// <summary>Fecha en que fue asignado este mensaje al usuario (UTC)</summary>
    /// <example>2024-05-02T00:00:00Z</example>
    public DateTime AssignedDate { get; set; }

    /// <summary>
    /// Indica si el mensaje fue asignado en esta llamada.
    /// true = nuevo mensaje de hoy · false = ya había sido asignado anteriormente hoy
    /// </summary>
    /// <example>true</example>
    public bool IsNewAssignment { get; set; }
}