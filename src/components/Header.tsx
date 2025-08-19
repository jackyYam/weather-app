import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon, RefreshCcw } from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
}

export default function Header({ onRefresh }: HeaderProps) {
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
            className="p-2 sm:p-3 hover:bg-primary/80 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Refresh weather data"
          >
            <RefreshCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-3 hover:bg-primary/80 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
          <button className="p-2 sm:p-3 hover:bg-primary/80 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
