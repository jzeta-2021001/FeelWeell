using Microsoft.AspNetCore.Mvc;

namespace DailyPositive.Api.Controllers;

/// <summary>
/// Verifica el estado del servicio.
/// </summary>
[ApiController]
[Route("feelWell/v1")]
[Produces("application/json")]
[Tags("Health")]
public class HealthController : ControllerBase
{
    /// <summary>Verifica que el servicio esté corriendo correctamente</summary>
    /// <response code="200">El servicio está saludable</response>
    [HttpGet("health")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Health()
    {
        return Ok(new
        {
            status = "Healthy",
            timeStamp = DateTime.UtcNow,
            service = "FeelWell Daily Positive Service"
        });
    }
}