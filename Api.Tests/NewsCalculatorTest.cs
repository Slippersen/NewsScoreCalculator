using System.Net;
using System.Net.Http.Json;
using Api.Models;
using Microsoft.AspNetCore.Mvc.Testing;

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
        var request = new NewsCalculationRequest()
        {
            Measurements =
            [
                new Measurement(MeasurementType.Temp, 39),
                new Measurement(MeasurementType.Hr, 43),
                new Measurement(MeasurementType.Rr, 19)
            ]
        };

        // Act
        await using var application = new WebApplicationFactory<Program>();
        using var client = application.CreateClient();

        var response = await client.PostAsJsonAsync("/news/score", request);
        var result = await response.Content.ReadFromJsonAsync<News>();

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.IsType<News>(result);
        Assert.Equal(2, result.Score);
    }
}
