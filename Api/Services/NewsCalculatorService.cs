using Api.Models;

namespace Api.Services;

public class NewsCalculatorService : INewsCalculatorService
{
    public News GetScore(Measurement[] measurements)
    {
        var score = 0;

        // Calculate the NEWS score based on the provided measurements
        foreach (var measurement in measurements)
        {
            score += measurement.Type switch
            {
                MeasurementType.Temp => measurement.Value switch
                {
                    > 36 and <= 38 => 0,
                    (> 35 and <= 36) or (> 38 and <= 39) => 1,
                    > 39 and <= 42 => 2,
                    > 31 and <= 35 => 3,
                    _ => throw new ArgumentOutOfRangeException(message: "TEMP must be between 31 and 42", null)
                },
                MeasurementType.Hr => measurement.Value switch
                {
                    > 50 and <= 90 => 0,
                    (> 40 and <= 50) or (> 90 and <= 110) => 1,
                    > 110 and <= 130 => 2,
                    (> 25 and <= 40) or (> 130 and <= 220) => 3,
                    _ => throw new ArgumentOutOfRangeException(message: "HR must be between 25 and 220", null)
                },
                MeasurementType.Rr => measurement.Value switch
                {
                    > 11 and <= 20 => 0,
                    > 8 and <= 11 => 1,
                    > 20 and <= 24 => 2,
                    (> 3 and <= 8) or (> 24 and <= 60) => 3,
                    _ => throw new ArgumentOutOfRangeException(message: "RR must be between 31 and 42", null)
                },
                _ => throw new ArgumentException(message: "Invalid measurement type"),
            };
        }

        return new News(Score: score);
    }
}