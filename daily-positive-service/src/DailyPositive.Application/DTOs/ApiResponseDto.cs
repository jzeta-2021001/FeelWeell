namespace DailyPositive.Application.DTOs;

/// <summary>Estructura de respuesta genérica usada en todos los endpoints</summary>
/// <typeparam name="T">Tipo del payload en el campo data</typeparam>
public class ApiResponseDto<T>
{
    /// <summary>Indica si la operación fue exitosa</summary>
    /// <example>true</example>
    public bool Success { get; set; }

    /// <summary>Mensaje descriptivo del resultado</summary>
    /// <example>Ok</example>
    public string Message { get; set; } = string.Empty;

    /// <summary>Payload de la respuesta</summary>
    public T? Data { get; set; }

    public static ApiResponseDto<T> Ok(T data, string messsage = "Ok") =>
        new()
        {
            Success = true,
            Message = messsage,
            Data = data
        };

    public static ApiResponseDto<T> Fail(string message) =>
        new()
        {
            Success = false,
            Message = message,
            Data = default
        };
}