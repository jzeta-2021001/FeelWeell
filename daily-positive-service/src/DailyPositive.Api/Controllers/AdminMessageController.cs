using System;
using DailyPositive.Application.DTOs;
using DailyPositive.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DailyPositive.Api.Controllers;

[ApiController]
[Route("api/admin/messages")]
[Authorize]
public class AdminMessageController : ControllerBase
{
    private readonly IMotivationMgService _service;
    public AdminMessageController(IMotivationMgService service)
    {
        _service = service;
    }

    //trae todos los mensajes, inactivos y activos
    [HttpGet]
    public async Task <IActionResult> GettAll()
    {
        var message = await _service.GetAllAsync();
        return Ok(new { success = true, data= message});
    }

    //trae solo los mensajes activos (los que ven los usuarios)
    [HttpGet("active")]
    public async Task<IActionResult> GetAllActive()
    {
        var message = await _service.GetAllActiveAsync();
        return Ok(new { success = true, data = message});
    }

    //trae un mensaje especifico por su id de mongo
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var message = await _service.GetByIdAsync(id);

        if(message == null)
        {
            return NotFound(new { success = false, message = $"No se encontro el mensaje con id {id} "});
        }

        return Ok(new { success = true, data = message});
    }

    //crea un nuevo mensaje motivacional
    [HttpPost]
    [Authorize(Roles ="ADMIN_ROLE")]
    public async Task<IActionResult> Create([FromBody] CreatedMessageDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Content))
            return BadRequest(new { success = false, message = "El contenido del mensaje es necesario "});
    
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new
        {
            id = created.IdMotivation
        },
        new
        {
            success = true,
            message = "Mensaje creado existosamente",
            data = created
        });
    }

    //actualiza solo los campos que se envién
    [HttpPatch("{id}")]
    [Authorize(Roles ="ADMIN_ROLE")]
    public async Task<IActionResult> Patch(string id, [FromBody] PatchMessageDto dto)
    {
        var updated = await _service.PatchAsync(id, dto);
        if(updated == null)
            return NotFound(new { success = false, message = $"No se encontró el mesnsaje con id {id}"});
            //cuando es una sola linea no hay necesidad de usar {} en una estructura de control
        return Ok(new { success = true, message = "Mensaje actualizado correctamente", data = updated});
    }

    //elimin un mensaje permanentemente
    [HttpDelete("{id}")]
    [Authorize(Roles ="ADMIN_ROLE")]
    public async Task<IActionResult> Delete (string id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { success = false, message = $"No se encontró el mensaje con id {id}"});

        return Ok(new { success = true, message = "Mensaje eliminado correctamente"});
    }

}
