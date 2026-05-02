using DailyPositive.Application.DTOs;
using DailyPositive.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DailyPositive.Api.Controllers;

/// <summary>
/// Endpoints de administración para gestionar mensajes motivacionales.
/// Requiere autenticación JWT. Las operaciones de escritura requieren rol ADMIN_ROLE.
/// </summary>
[ApiController]
[Route("api/admin/messages")]
[Authorize]
[Produces("application/json")]
[Tags("Admin - Mensajes")]
public class AdminMessageController : ControllerBase
{
    private readonly IMotivationMgService _service;
    public AdminMessageController(IMotivationMgService service)
    {
        _service = service;
    }

    /// <summary>Obtiene todos los mensajes (activos e inactivos)</summary>
    /// <remarks>Devuelve el catálogo completo sin filtrar por estado.</remarks>
    /// <response code="200">Lista completa de mensajes</response>
    /// <response code="401">Token ausente o inválido</response>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponseDto<IEnumerable<MessageResponseDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GettAll()
    {
        var message = await _service.GetAllAsync();
        return Ok(new { success = true, data = message });
    }

    /// <summary>Obtiene solo los mensajes activos</summary>
    /// <remarks>Devuelve únicamente los mensajes visibles para los usuarios finales.</remarks>
    /// <response code="200">Lista de mensajes activos</response>
    /// <response code="401">Token ausente o inválido</response>
    [HttpGet("active")]
    [ProducesResponseType(typeof(ApiResponseDto<IEnumerable<MessageResponseDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAllActive()
    {
        var message = await _service.GetAllActiveAsync();
        return Ok(new { success = true, data = message });
    }

    /// <summary>Obtiene un mensaje por su ID de MongoDB</summary>
    /// <param name="id">ID del documento en MongoDB (24 caracteres hexadecimales)</param>
    /// <response code="200">Mensaje encontrado</response>
    /// <response code="401">Token ausente o inválido</response>
    /// <response code="404">No existe un mensaje con ese ID</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponseDto<MessageResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(string id)
    {
        var message = await _service.GetByIdAsync(id);

        if (message == null)
        {
            return NotFound(new { success = false, message = $"No se encontro el mensaje con id {id} " });
        }

        return Ok(new { success = true, data = message });
    }

    /// <summary>Crea un nuevo mensaje motivacional</summary>
    /// <remarks>
    /// Requiere rol **ADMIN_ROLE**. El campo `content` es obligatorio.
    ///
    /// Ejemplo de body:
    ///
    ///     {
    ///         "content": "El éxito es la suma de pequeños esfuerzos repetidos día a día.",
    ///         "author": "Robert Collier",
    ///         "category": "motivacion"
    ///     }
    /// </remarks>
    /// <response code="201">Mensaje creado exitosamente</response>
    /// <response code="400">El campo content está vacío</response>
    /// <response code="401">Token ausente o inválido</response>
    /// <response code="403">El token no tiene rol ADMIN_ROLE</response>
    [HttpPost]
    [Authorize(Roles = "ADMIN_ROLE")]
    [ProducesResponseType(typeof(ApiResponseDto<MessageResponseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Create([FromBody] CreatedMessageDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Content))
            return BadRequest(new { success = false, message = "El contenido del mensaje es necesario " });

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

    /// <summary>Actualiza parcialmente un mensaje (solo los campos enviados)</summary>
    /// <remarks>
    /// Requiere rol **ADMIN_ROLE**. Solo se actualizan los campos que se incluyan en el body; los demás conservan su valor actual.
    ///
    /// Ejemplo para desactivar un mensaje:
    ///
    ///     {
    ///         "isActive": false
    ///     }
    /// </remarks>
    /// <param name="id">ID del mensaje a actualizar</param>
    /// <response code="200">Mensaje actualizado correctamente</response>
    /// <response code="401">Token ausente o inválido</response>
    /// <response code="403">El token no tiene rol ADMIN_ROLE</response>
    /// <response code="404">No existe un mensaje con ese ID</response>
    [HttpPatch("{id}")]
    [Authorize(Roles = "ADMIN_ROLE")]
    [ProducesResponseType(typeof(ApiResponseDto<MessageResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Patch(string id, [FromBody] PatchMessageDto dto)
    {
        var updated = await _service.PatchAsync(id, dto);
        if (updated == null)
            return NotFound(new { success = false, message = $"No se encontró el mesnsaje con id {id}" });
        return Ok(new { success = true, message = "Mensaje actualizado correctamente", data = updated });
    }

    /// <summary>Elimina un mensaje permanentemente</summary>
    /// <remarks>Requiere rol **ADMIN_ROLE**. Esta acción no se puede deshacer.</remarks>
    /// <param name="id">ID del mensaje a eliminar</param>
    /// <response code="200">Mensaje eliminado correctamente</response>
    /// <response code="401">Token ausente o inválido</response>
    /// <response code="403">El token no tiene rol ADMIN_ROLE</response>
    /// <response code="404">No existe un mensaje con ese ID</response>
    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN_ROLE")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { success = false, message = $"No se encontró el mensaje con id {id}" });

        return Ok(new { success = true, message = "Mensaje eliminado correctamente" });
    }
}