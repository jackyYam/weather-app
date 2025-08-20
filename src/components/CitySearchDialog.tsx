import { useState, useEffect, useRef } from "react";
import { Search, X, MapPin, Loader2 } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { loadCities, searchCities } from "../lib/cityData";
import type { City } from "../types/city";

interface CitySearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCitySelect: (city: City) => void;
}

export default function CitySearchDialog({
  isOpen,
  onClose,
  onCitySelect,
}: CitySearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [citiesLoaded, setCitiesLoaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      onCitySelect({
        id: "current-location",
        name: "Current Location",
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        country: "Current Location",
      });
      setSearchQuery("");
      setSearchResults([]);
      setSelectedIndex(-1);
      onClose();
    });
  };

  // Load cities data on mount
  useEffect(() => {
    const loadCitiesData = async () => {
      setIsLoading(true);
      try {
        const citiesData = await loadCities();
        setCities(citiesData);
        setCitiesLoaded(true);
      } catch (error) {
        console.error("Failed to load cities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && !citiesLoaded) {
      loadCitiesData();
    }
  }, [isOpen, citiesLoaded]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery && cities.length > 0) {
      const results = searchCities(debouncedQuery, cities);
      setSearchResults(results);
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  }, [debouncedQuery, cities]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }

    if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleCitySelect(searchResults[selectedIndex]);
    }
  };

  const handleCitySelect = (city: City) => {
    onCitySelect(city);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedIndex(-1);
    onClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedIndex(-1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-card rounded-lg shadow-xl border">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-card-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {isLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          )}
          <button
            onClick={getCurrentLocation}
            className="p-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto" ref={resultsRef}>
          {!citiesLoaded && isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Loading cities...
                </p>
              </div>
            </div>
          ) : searchQuery.length < 2 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Type at least 2 characters to search
                </p>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No cities found for "{searchQuery}"
                </p>
              </div>
            </div>
          ) : (
            <div className="py-2">
              {searchResults.map((city, index) => (
                <button
                  key={`${city.name}-${city.lat}-${city.lon}`}
                  onClick={() => handleCitySelect(city)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3 cursor-pointer ${
                    index === selectedIndex ? "bg-muted" : ""
                  }`}
                >
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-card-foreground truncate">
                      {city.name}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {city.country}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    lat: {city.lat.toFixed(2)}, lon: {city.lon.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-muted/50 rounded-b-lg">
          <p className="text-xs text-muted-foreground text-center">
            Use ↑↓ to navigate • Enter to select • Esc to close
          </p>
        </div>
      </div>
    </div>
  );
}
