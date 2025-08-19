import { useQuery } from "@tanstack/react-query";
import { getDailyForecast } from "../api/get-forecast";
import type { City } from "../types/city";
import { Thermometer } from "lucide-react";

interface DailyForecastProps {
  city: City;
}

export default function DailyForecast({ city }: DailyForecastProps) {
  const { data: weatherData, isFetching } = useQuery({
    queryKey: ["daily-forecast", city],
    queryFn: () => getDailyForecast({ lat: city.lat, lon: city.lon }),
  });

  // Loading skeleton
  if (isFetching) {
    return (
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Next 5 days
        </h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-muted rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-24"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                </div>
              </div>
              {index < 4 && <hr className="border-border/50" />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Next 5 days
      </h3>
      <div className="space-y-3">
        {weatherData?.map((day, index) => (
          <div key={index}>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl">
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon.replace(
                      "n",
                      "d"
                    )}.png`}
                    alt={day.condition}
                    className="w-12 h-12"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-card-foreground">
                    {day.day}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {day.condition}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-card-foreground flex items-center gap-1">
                  <Thermometer className="w-5 h-5" />
                  <p>
                    {day.high}° | {day.low}°
                  </p>
                </div>
              </div>
            </div>
            {index < weatherData.length - 1 && (
              <hr className="border-border/50" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
