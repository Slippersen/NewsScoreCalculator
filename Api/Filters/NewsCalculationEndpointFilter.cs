using Api.Models;

namespace Api.Filters;

public class NewsCalculationEndpointFilter : IEndpointFilter
{
    private static (bool isValid, string? validationMessage) ValidateMeasurement(MeasurementType type, int? value)
    {
        // Determine the validation rules based on the measurement type
        return type switch
        {
            MeasurementType.Temp => value > 31 && value <= 42 ? (true, null) : (false, "Temperature must be between 31 and 42"),
            MeasurementType.Hr => value > 25 && value <= 220 ? (true, null) : (false, "Heart rate must be between 25 and 220"),
            MeasurementType.Rr => value > 3 && value <= 60 ? (true, null) : (false, "Respiratory rate must be between 3 and 60"),
            _ => (false, "Invalid measurement type"),
        };
    }

    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        // Check if required measurements for NEWS are provided
        var measurements = context.GetArgument<NewsCalculationRequest?>(0)
            ?.Measurements
            ?.Where(m => m.Value != default);

        if (measurements == default || !measurements.Any())
        {
            return Results.Problem(
                "No measurements provided.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        var measurementTypes = measurements.Select(m => m.Type).Distinct();

        if (!measurementTypes.Contains(MeasurementType.Temp) ||
            !measurementTypes.Contains(MeasurementType.Hr) ||
            !measurementTypes.Contains(MeasurementType.Rr))
        {
            return Results.Problem(
                "Measurements must include all: TEMP, HR, and RR.",
                statusCode: StatusCodes.Status400BadRequest);
        }

        foreach (var measurement in measurements)
        {
            // Validate each measurement
            var (isValid, validationMessage) = ValidateMeasurement(measurement.Type, measurement.Value);

            if (!isValid)
            {
                return Results.Problem(
                    validationMessage,
                    statusCode: StatusCodes.Status400BadRequest);
            }
        }

        return await next(context);
    }
}