import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

// ThemeToggle solo Tailwind
const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`relative group shrink-0 w-12 h-7 rounded-full border transition-all duration-300
        bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600
        hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        ${className}`}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      {/* Track background */}
      <span
        className={`absolute inset-0.5 rounded-full transition-all duration-300 ${
          isDark ? "bg-gray-800" : "bg-gray-100"
        }`}
      />
      {/* Sliding circle with icon */}
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center
        ${isDark ? "left-5.5 bg-white" : "left-0.5 bg-gray-50"}`}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-yellow-400" />
        ) : (
          <Moon className="w-4 h-4 text-blue-600" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
