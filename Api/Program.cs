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

app.MapPost(
    "/news/score",
    Results<Ok<News>, BadRequest, InternalServerError>
    ([FromBody][Required] NewsCalculationRequest request,
    [FromServices] INewsCalculatorService newsService,
    CancellationToken ct = default) =>
    {
        var score = newsService.GetScore(request.Measurements);

        return TypedResults.Ok(score);
    })
    .WithName("CalculateNews")
    .WithDescription("National Early Warning Score (NEWS)")
    .WithSummary("Calculate the National Early Warning Score (NEWS) based on the measurements provided.")
    .WithOpenApi();

app.Run();

public partial class Program { }
