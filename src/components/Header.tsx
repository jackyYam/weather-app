import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon, RefreshCcw, Search } from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  onSearchClick: () => void;
}

export default function Header({ onRefresh, onSearchClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-primary dark:bg-background text-primary-foreground dark:text-foreground px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-base sm:text-lg md:text-xl font-semibold">
          Simple Weather
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 sm:p-3 hover:bg-primary-foreground/10 dark:hover:bg-primary-foreground rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Refresh weather data"
          >
            <RefreshCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-3 hover:bg-primary-foreground/10 dark:hover:bg-primary-foreground rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
          <button
            onClick={onSearchClick}
            className="p-2 sm:p-3 hover:bg-primary-foreground/10 dark:hover:bg-primary-foreground rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer  "
            aria-label="Search cities"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
