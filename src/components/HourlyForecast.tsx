import { useQuery } from "@tanstack/react-query";
import { getHourlyForecast } from "../api/get-forecast";
import type { City } from "../types/city";
import { Droplet, Wind } from "lucide-react";
import { useRef, useEffect } from "react";
interface HourlyForecastProps {
  city: City;
}

export default function HourlyForecast({ city }: HourlyForecastProps) {
  const { data: weatherData, isFetching } = useQuery({
    queryKey: ["hourly-forecast", city],
    queryFn: () => getHourlyForecast({ lat: city.lat, lon: city.lon }),
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadingContainerRef = useRef<HTMLDivElement>(null);

  // Use native event listener for better control over wheel events
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Always prevent vertical scroll
      e.preventDefault();
      e.stopPropagation();

      // Convert vertical scroll to horizontal scroll if there's a container
      const container =
        scrollContainerRef.current || loadingContainerRef.current;
      if (container) {
        const scrollAmount = e.deltaY;
        container.scrollLeft += scrollAmount;
      }
    };

    const mainContainer = scrollContainerRef.current;
    const loadingContainer = loadingContainerRef.current;

    // Add event listener to whichever container exists
    const activeContainer = mainContainer || loadingContainer;
    if (activeContainer) {
      // Add passive: false to ensure preventDefault works
      activeContainer.addEventListener("wheel", handleWheel, {
        passive: false,
      });

      return () => {
        activeContainer.removeEventListener("wheel", handleWheel);
      };
    }
  }, [isFetching]); // Re-run when loading state changes

  if (isFetching) {
    return (
      <div className="bg-card rounded-lg p-4 shadow-sm pb-1">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Next hours
        </h3>
        <div
          ref={loadingContainerRef}
          className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div className="text-center min-w-32 max-w-32">
                <div className="mb-1 flex items-center justify-center gap-1">
                  <div className="w-14 h-8 bg-muted rounded animate-pulse"></div>
                  <div className="w-10 h-10 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="text-sm mb-2 flex items-center justify-center flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <Droplet className="w-4 h-4 text-muted-foreground" />
                    <div className="w-8 h-4 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="w-4 h-4 text-muted-foreground" />
                    <div className="w-12 h-4 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="w-16 h-3 bg-muted rounded animate-pulse mx-auto"></div>
              </div>
              {index < 3 && (
                <div className="w-px h-20 bg-border/50 mx-2 flex-shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm pb-1">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        Next hours
      </h3>
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin"
      >
        {weatherData?.map((hour, index) => (
          <div key={index} className="flex items-center">
            <div className="text-center min-w-32 max-w-32">
              <div className="text-card-foreground mb-1 flex items-center justify-center gap-1">
                <p className="text-2xl font-bold">{hour.temp}°</p>
                <img
                  src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
                  className="w-10 h-10"
                />
              </div>
              <div className="text-sm text-muted-foreground mb-2 flex items-center justify-center flex-col">
                <div className="flex items-center gap-1">
                  <Droplet className="w-4 h-4" />
                  {hour.humidity}%
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-4 h-4" />
                  {hour.windSpeed} km/h
                </div>
              </div>

              <div className="text-xs text-muted-foreground">{hour.time}</div>
            </div>
            {index < weatherData.length - 1 && (
              <div className="w-px h-20 bg-border/50 mx-2 flex-shrink-0"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
