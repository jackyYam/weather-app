import { cn } from "../lib/utils";
import type { City } from "../types/city";

interface CityTabsProps {
  cities: City[];
  activeCity: City;
  onCityChange: (city: City) => void;
}

export default function CityTabs({
  cities,
  activeCity,
  onCityChange,
}: CityTabsProps) {
  return (
    <div className="bg-primary-foreground dark:bg-card text-primary-foreground px-2 py-2 mb-4 rounded-lg">
      <div className="flex overflow-x-auto md:overflow-x-visible md:justify-center gap-1 md:gap-2">
        {cities.map((city) => (
          <button
            key={city.name}
            onClick={() => onCityChange(city)}
            className={cn(
              "flex-shrink-0 md:flex-1 text-primary dark:text-foreground md:max-w-[200px] px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium rounded transition-colors min-w-[120px] cursor-pointer",
              activeCity.name === city.name
                ? "bg-primary dark:bg-primary text-primary-foreground dark:text-foreground"
                : "hover:bg-primary/20 dark:hover:bg-primary/70"
            )}
          >
            <div className="text-center">
              <div className="whitespace-nowrap">{city.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
