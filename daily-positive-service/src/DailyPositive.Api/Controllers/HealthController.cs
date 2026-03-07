using System;
using Microsoft.AspNetCore.Mvc;

namespace DailyPositive.Api.Controllers;

[ApiController]
[Route("feelWell/v1")]
public class HealthController : ControllerBase
{
    [HttpGet("health")]
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
