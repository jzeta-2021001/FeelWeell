using DailyPositive.Application.DTOs;
using DailyPositive.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DailyPositive.Api.Controllers;

/// <summary>
/// Endpoints de administración para gestionar mensajes motivacionales.
/// Requiere autenticación JWT. Las operaciones requieren rol ADMIN_ROLE o ADMIN_MOODTRACKING_ROLE.
/// </summary>
[ApiController]
[Route("api/admin/messages")]
// Se agregan los roles a nivel de controlador para proteger todos los endpoints, incluyendo los GET
[Authorize(Roles = "ADMIN_ROLE,ADMIN_MOODTRACKING_ROLE")] 
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
    /// <response code="403">No tiene los permisos necesarios</response>
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
            return NotFound(new { success = false, message = $"No se encontró el mensaje con id {id}" });
        }

        return Ok(new { success = true, data = message });
    }

    /// <summary>Crea un nuevo mensaje motivacional</summary>
    /// <remarks>
    /// El campo `content` es obligatorio.
    /// </remarks>
    /// <response code="201">Mensaje creado exitosamente</response>
    /// <response code="400">El campo content está vacío</response>
    /// <response code="401">Token ausente o inválido</response>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponseDto<MessageResponseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] CreatedMessageDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Content))
            return BadRequest(new { success = false, message = "El contenido del mensaje es necesario" });

        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new
        {
            id = created.IdMotivation
        },
        new
        {
            success = true,
            message = "Mensaje creado exitosamente",
            data = created
        });
    }

    /// <summary>Actualiza parcialmente un mensaje (solo los campos enviados)</summary>
    /// <remarks>
    /// Solo se actualizan los campos que se incluyan en el body; los demás conservan su valor actual.
    /// </remarks>
    /// <param name="id">ID del mensaje a actualizar</param>
    /// <param name="dto">Datos que se actualizarán.</param>
    /// <response code="200">Mensaje actualizado correctamente</response>
    /// <response code="401">Token ausente o inválido</response>
    /// <response code="404">No existe un mensaje con ese ID</response>
    [HttpPatch("{id}")]
    [ProducesResponseType(typeof(ApiResponseDto<MessageResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Patch(string id, [FromBody] PatchMessageDto dto)
    {
        var updated = await _service.PatchAsync(id, dto);
        if (updated == null)
            return NotFound(new { success = false, message = $"No se encontró el mensaje con id {id}" });
            
        return Ok(new { success = true, message = "Mensaje actualizado correctamente", data = updated });
    }

    /// <summary>Realiza un Soft-Delete (Desactivación) de un mensaje</summary>
    /// <remarks>
    /// En lugar de eliminar el registro físico (lo cual rompería el ciclo de rotación), 
    /// este endpoint cambia internamente el estado IsActive a false.
    /// </remarks>
    /// <param name="id">ID del mensaje a desactivar</param>
    /// <response code="200">Mensaje desactivado correctamente</response>
    /// <response code="401">Token ausente o inválido</response>
    /// <response code="404">No existe un mensaje con ese ID</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        // Se aplica un Soft-Delete usando el servicio de Patch para mantener la integridad referencial (OrderIndex)
        var softDeleteDto = new PatchMessageDto { IsActive = false };
        var softDeleted = await _service.PatchAsync(id, softDeleteDto);

        if (softDeleted == null)
            return NotFound(new { success = false, message = $"No se encontró el mensaje con id {id}" });

        return Ok(new { success = true, message = "Mensaje desactivado correctamente (Soft Delete)" });
    }
}