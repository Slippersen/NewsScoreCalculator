using System.ComponentModel;
using System.Text.Json.Serialization;

namespace Api.Models;

[JsonConverter(typeof(JsonStringEnumConverter<MeasurementType>))]
public enum MeasurementType
{
    [Description("Temperature")]
    [JsonStringEnumMemberName("TEMP")]
    Temp,

    [Description("Heart rate")]
    [JsonStringEnumMemberName("HR")]
    Hr,

    [Description("Respiratory rate")]
    [JsonStringEnumMemberName("RR")]
    Rr
}
