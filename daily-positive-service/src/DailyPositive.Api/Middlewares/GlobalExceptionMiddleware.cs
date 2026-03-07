using System;
using System.Net;
using System.Text.Json;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace DailyPositive.Api.Middlewares;

public class GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger = logger;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Recurso no encontrado");
            await WriteErrorResponse(context, HttpStatusCode.NotFound, ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Operación inválida");
            await WriteErrorResponse(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error no controlado en el servidor");
            await WriteErrorResponse(context, HttpStatusCode.InternalServerError,
                "Ocurrió un error interno. Intenta más tarde.");
        }
    }

    private static async Task WriteErrorResponse(HttpContext context, HttpStatusCode statusCode, string message)
    {
        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";

        var response = JsonSerializer.Serialize(new { success = false, message, statusCode = (int)statusCode });
    
        await context.Response.WriteAsync(response);
    }
}
