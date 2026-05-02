namespace DailyPositive.Application.DTOs;

/// <summary>Campos actualizables de un mensaje. Solo se modifican los campos que se envíen en el body.</summary>
public class PatchMessageDto
{
    /// <summary>Nuevo texto del mensaje (opcional)</summary>
    /// <example>Cada día es una nueva oportunidad para crecer.</example>
    public string? Content { get; set; }

    /// <summary>Nuevo autor (opcional)</summary>
    /// <example>Anónimo</example>
    public string? Author { get; set; }

    /// <summary>Nueva categoría (opcional)</summary>
    /// <example>bienestar</example>
    public string? Category { get; set; }

    /// <summary>Activa o desactiva el mensaje (opcional)</summary>
    /// <example>false</example>
    public bool? IsActive { get; set; }
}