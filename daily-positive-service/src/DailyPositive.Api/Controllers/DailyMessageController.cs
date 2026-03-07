using System;
using DailyPositive.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DailyPositive.Api.Controllers;
// este endpoint llama al auth-service después del login

[ApiController]
[Route("api/daily-message")]
public class DailyMessageController : ControllerBase
{
    private readonly IMotivationMgService _service;

    public DailyMessageController(IMotivationMgService service)
    {
        _service = service;
    }

    //retorna el mensaje del dúa para el usuario, si ya se le asgino uno hoy retorna el mismo
    [HttpGet("today/{userId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTodayMessage(string userId)
    {
        if(string.IsNullOrWhiteSpace(userId))
            return BadRequest(new {success = false, message = "El mensaje userId es requerdi"});

        var result = await _service.GetDailyMgForUser(userId);
        if(result == null)
            return NotFound(new {success = false, message = "No hay mensajes activos. El admino debe de agregar mensajes"});
        
        var msg = result.IsNewAssignment ? "Nuevo mensajes motivacional para hoy": "Mensaje del día";

        return Ok(new { success = true, message = msg, data = result});
    }
}
