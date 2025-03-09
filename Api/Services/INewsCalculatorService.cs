using Api.Models;

namespace Api.Services;

public interface INewsCalculatorService
{
    public News GetScore(Measurement[] measurements);
}