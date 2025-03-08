using System.Net.Http.Json;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Mvc.Testing;
using Moq;

namespace Api.Tests;

public class NewsCalculatorTest()
{
    [Fact]
    public async Task CalculateNews_GivenStaticMeasurements()
    {
        // API specification - POST /news/score
        // Request body: 
        //  {
        //      "measurements": [
        //          {"type":"TEMP","value":39},
        //          {"type":"HR","value":43},
        //          {"type":"RR","value":19}
        //      ]
        //  }
        // Response body: 
        //  { "score": 2 }

        // Arrange
        var measurements = new NewsCalculationRequest()
        {
            Measurements =
            [
                new Measurement(MeasurementType.Temp, 39),
                new Measurement(MeasurementType.Hr, 43),
                new Measurement(MeasurementType.Rr, 19)
            ]
        };

        var mockNewsCalculatorService = new Mock<INewsCalculatorService>();
        mockNewsCalculatorService.Setup(service =>
            service.GetScore(It.IsAny<Measurement[]>())).Returns(new News(2));

        // Act
        await using var application = new WebApplicationFactory<Program>();
        using var client = application.CreateClient();
        var response = await client.PostAsJsonAsync("/news/score", measurements);

        // Assert
        var result = await response.Content.ReadFromJsonAsync<News>();
        Assert.IsType<News>(result);
        Assert.Equal(2, result.Score);
    }
}
