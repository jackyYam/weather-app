import { useRef, useEffect } from "react";
import { cn } from "../lib/utils";
import { Star, X } from "lucide-react";
import type { City } from "../types/city";
import type { StoredCity } from "../hooks/useCityStorage";

interface CityTabsProps {
  cities: StoredCity[];
  activeCity: City;
  onCityChange: (city: City) => void;
  onCityRemove?: (city: City) => void;
}

export default function CityTabs({
  cities,
  activeCity,
  onCityChange,
  onCityRemove,
}: CityTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleRemoveCity = (e: React.MouseEvent, city: City) => {
    e.stopPropagation();
    onCityRemove?.(city);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Always prevent vertical scroll
      e.preventDefault();
      e.stopPropagation();

      // Convert vertical scroll to horizontal scroll if there's a container
      const container = scrollContainerRef.current;
      if (container) {
        const scrollAmount = e.deltaY;
        container.scrollLeft += scrollAmount;
      }
    };

    const mainContainer = scrollContainerRef.current;

    // Add event listener to whichever container exists
    const activeContainer = mainContainer;
    if (activeContainer) {
      // Add passive: false to ensure preventDefault works
      activeContainer.addEventListener("wheel", handleWheel, {
        passive: false,
      });

      return () => {
        activeContainer.removeEventListener("wheel", handleWheel);
      };
    }
  }, [cities]);

  return (
    <div className="bg-primary-foreground dark:bg-card text-primary-foreground px-2 py-1.5 mb-4 rounded-lg">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto md:overflow-x-visible md:justify-center gap-1 md:gap-2 py-1 scrollbar-thin"
      >
        {cities.map((city) => (
          <div
            key={`${city.name}-${city.lat}-${city.lon}`}
            className="relative group"
          >
            <button
              onClick={() => onCityChange(city)}
              className={cn(
                "flex-shrink-0 md:flex-1 text-primary dark:text-foreground md:max-w-[200px] px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded transition-colors min-w-[120px] cursor-pointer w-full",
                activeCity.name === city.name
                  ? "bg-primary dark:bg-primary text-primary-foreground dark:text-foreground"
                  : "group-hover:bg-primary/20 dark:group-hover:bg-primary/70"
              )}
            >
              <div className="text-center flex items-center justify-center gap-1">
                {city.isFavorite && <Star className="w-3 h-3 fill-current" />}
                <div className="whitespace-nowrap">{city.name}</div>
              </div>
            </button>

            {/* Remove button for favorite cities */}
            {city.isFavorite && !city.isDefault && (
              <button
                onClick={(e) => handleRemoveCity(e, city)}
                className="absolute -top-0.5 -right-0.5 bg-red-500 cursor-pointer hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                aria-label={`Remove ${city.name} from favorites`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
