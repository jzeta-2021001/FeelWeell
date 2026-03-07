using System;

namespace DailyPositive.Application.DTOs;

public class ApiResponseDto<T>
{
    //mensaje generico para todas las respuestas
    public bool Success {get;set;}
    public string Message{get;set;} = string.Empty;
    public T? Data {get;set;}

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
