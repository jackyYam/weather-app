import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather } from "../api/get-current-weather";
import { formatCurrentLocalTime } from "../lib/timezone";
import type { City } from "../types/city";
import {
  Droplet,
  Wind,
  Cloud,
  Thermometer,
  type LucideIcon,
} from "lucide-react";

interface CurrentWeatherProps {
  city: City;
}

interface WeatherStatProps {
  icon: LucideIcon;
  label: string;
  value: string | number | undefined;
  unit?: string;
}

function WeatherStat({
  icon: Icon,
  label,
  value,
  unit = "",
}: WeatherStatProps) {
  return (
    <div className="text-center md:text-right">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className="font-semibold text-card-foreground text-left">
        {value ?? "--"}
        {unit}
      </div>
    </div>
  );
}

export default function CurrentWeather({ city }: CurrentWeatherProps) {
  const { data: weatherData, isFetching } = useQuery({
    queryKey: ["weather", city],
    queryFn: () => getCurrentWeather({ lat: city.lat, lon: city.lon }),
  });

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div className="text-center md:text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-card-foreground mb-1">
            {city.name}{" "}
            {city.id === "current-location" && weatherData?.cityName && (
              <span className="text-sm text-muted-foreground">
                ({weatherData.cityName})
              </span>
            )}
          </h2>
          <div className="text-sm text-muted-foreground mb-2">
            {weatherData?.timezone && (
              <div>
                Local time: {formatCurrentLocalTime(weatherData.timezone)}
              </div>
            )}
          </div>
        </div>
        {isFetching ? (
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                {/* Temperature and icon skeleton */}
                <div className="mb-2 flex gap-2">
                  <div className="h-16 w-32 bg-muted rounded-lg"></div>
                  <div className="h-12 w-12 bg-muted rounded"></div>
                </div>
                {/* Condition and min/max skeleton */}
                <div className="flex flex-col gap-2">
                  <div className="h-6 w-40 bg-muted rounded"></div>
                  <div className="h-6 w-48 bg-muted rounded"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center md:text-right">
                  {/* Feels like label skeleton */}
                  <div className="h-4 w-20 bg-muted rounded mb-1 mx-auto md:ml-auto md:mr-0"></div>
                  {/* Feels like value skeleton */}
                  <div className="h-5 w-12 bg-muted rounded mx-auto md:ml-auto md:mr-0"></div>
                </div>
                <div className="text-center md:text-right">
                  {/* Humidity label skeleton */}
                  <div className="h-4 w-16 bg-muted rounded mb-1 mx-auto md:ml-auto md:mr-0"></div>
                  {/* Humidity value skeleton */}
                  <div className="h-5 w-12 bg-muted rounded mx-auto md:ml-auto md:mr-0"></div>
                </div>
                <div className="text-center md:text-right">
                  {/* Wind label skeleton */}
                  <div className="h-4 w-10 bg-muted rounded mb-1 mx-auto md:ml-auto md:mr-0"></div>
                  {/* Wind value skeleton */}
                  <div className="h-5 w-16 bg-muted rounded mx-auto md:ml-auto md:mr-0"></div>
                </div>
                <div className="text-center md:text-right">
                  {/* Clouds label skeleton */}
                  <div className="h-4 w-14 bg-muted rounded mb-1 mx-auto md:ml-auto md:mr-0"></div>
                  {/* Clouds value skeleton */}
                  <div className="h-5 w-12 bg-muted rounded mx-auto md:ml-auto md:mr-0"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0 flex md:flex-col justify-between md:justify-start">
              <div className="mb-2 flex gap-2">
                <p className="text-5xl font-bold text-card-foreground ">
                  {weatherData?.temp}°
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData?.icon}.png`}
                  alt={weatherData?.condition}
                  className="w-12 h-12"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-lg text-muted-foreground first-letter:uppercase">
                  {weatherData?.condition}
                </div>
                <div className="text-lg text-muted-foreground">
                  Max: {weatherData?.max}° | Min: {weatherData?.min}°
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <WeatherStat
                icon={Thermometer}
                label="Feels like"
                value={weatherData?.feelsLike}
                unit="°"
              />
              <WeatherStat
                icon={Droplet}
                label="Humidity"
                value={weatherData?.humidity}
                unit="%"
              />
              <WeatherStat
                icon={Wind}
                label="Wind"
                value={weatherData?.windSpeed}
                unit=" km/h"
              />
              <WeatherStat
                icon={Cloud}
                label="Clouds"
                value={weatherData?.clouds}
                unit="%"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
