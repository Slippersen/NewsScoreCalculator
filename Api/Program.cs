using System.ComponentModel.DataAnnotations;
using Api.Filters;
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

// CORS policy
var NewsCalculatorSpecificOrigins = "NewsCalculatorSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: NewsCalculatorSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:5013",
                "https://localhost:7144");
            policy.WithMethods("POST", "OPTIONS");
            policy.AllowAnyHeader();
        });
});

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(NewsCalculatorSpecificOrigins);

app.MapPost("/news/score",
    Results<Ok<News>, BadRequest, InternalServerError>
    ([FromBody][Required] NewsCalculationRequest request,
    [FromServices] INewsCalculatorService newsService,
    CancellationToken ct = default) =>
    {
        var score = newsService.GetScore(request.Measurements);

        return TypedResults.Ok(score);
    })
    .WithOpenApi()
    .WithName("CalculateNews")
    .WithDescription("National Early Warning Score (NEWS)")
    .WithSummary("Calculate the National Early Warning Score (NEWS) based on the measurements provided.")
    .AddEndpointFilter<NewsCalculationEndpointFilter>()
    .RequireCors(NewsCalculatorSpecificOrigins);

app.Run();

public partial class Program { }
