using System.ComponentModel.DataAnnotations;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

// NEWS calculator service
builder.Services.AddScoped<INewsCalculatorService, NewsCalculatorService>();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI();
    app.UseSwagger();
}

app.UseHttpsRedirection();

app.MapPost("/news/score",
    Results<Ok<News>, BadRequest, InternalServerError>
    ([FromBody][Required] NewsCalculationRequest request,
    [FromServices] INewsCalculatorService newsService,
    CancellationToken ct = default) =>
    {
        var score = newsService.GetScore(request.Measurements);

        return TypedResults.Ok(score);
    })
    .AddEndpointFilter(async (efiContext, next) =>
    {
        var measurements = efiContext.GetArgument<NewsCalculationRequest?>(0)?.Measurements;

        if (measurements == default || measurements.Length == 0)
            return Results.Problem("No measurements provided.",
            statusCode: StatusCodes.Status400BadRequest);

        if (measurements.Length != 3)
            return Results.Problem(
                "Exactly 3 measurements must be provided (TEMP, HR and RR).",
                statusCode: StatusCodes.Status400BadRequest);

        if (!measurements.All(m => m.Type == MeasurementType.Temp || m.Type == MeasurementType.Hr || m.Type == MeasurementType.Rr))
            return Results.Problem(
                "Measurements must include all: TEMP, HR, and RR.",
                statusCode: StatusCodes.Status400BadRequest);

        return await next(efiContext);
    })
    .WithName("CalculateNews")
    .WithDescription("National Early Warning Score (NEWS)")
    .WithSummary("Calculate the National Early Warning Score (NEWS) based on the measurements provided.")
    .WithOpenApi();

app.Run();

public partial class Program { }
