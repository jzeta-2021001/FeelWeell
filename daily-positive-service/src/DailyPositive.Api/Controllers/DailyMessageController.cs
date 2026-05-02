using DailyPositive.Application.DTOs;
using DailyPositive.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DailyPositive.Api.Controllers;

/// <summary>
/// Endpoint público para que los usuarios obtengan su mensaje motivacional del día.
/// No requiere autenticación.
/// </summary>
[ApiController]
[Route("api/daily-message")]
[Produces("application/json")]
[Tags("Usuario - Mensaje del Día")]
public class DailyMessageController : ControllerBase
{
    private readonly IMotivationMgService _service;

    public DailyMessageController(IMotivationMgService service)
    {
        _service = service;
    }

    /// <summary>Obtiene el mensaje motivacional del día para un usuario</summary>
    /// <remarks>
    /// Si al usuario ya se le asignó un mensaje hoy, devuelve el mismo.
    /// Si es la primera consulta del día, asigna uno nuevo aleatoriamente entre los activos.
    ///
    /// El campo `isNewAssignment` en la respuesta indica si el mensaje fue asignado en esta llamada (`true`) o ya existía (`false`).
    /// </remarks>
    /// <param name="userId">ID único del usuario</param>
    /// <response code="200">Mensaje del día asignado o recuperado exitosamente</response>
    /// <response code="400">El parámetro userId está vacío</response>
    /// <response code="404">No hay mensajes activos. El administrador debe agregar mensajes</response>
    [HttpGet("today/{userId}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponseDto<DailyMgResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTodayMessage(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return BadRequest(new { success = false, message = "El mensaje userId es requerdi" });

        var result = await _service.GetDailyMgForUser(userId);
        if (result == null)
            return NotFound(new { success = false, message = "No hay mensajes activos. El admino debe de agregar mensajes" });

        var msg = result.IsNewAssignment ? "Nuevo mensajes motivacional para hoy" : "Mensaje del día";

        return Ok(new { success = true, message = msg, data = result });
    }
}