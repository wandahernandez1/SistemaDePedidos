import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

/**
 * Toggle elegante y minimalista para cambiar entre modo claro y oscuro
 * Usa las variables de tema del sistema de diseño
 */
const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative group shrink-0 w-12 h-6 rounded-full 
        transition-all duration-300 ease-in-out
        bg-secondary-200 dark:bg-secondary-700
        border border-secondary-300 dark:border-secondary-600
        hover:border-accent-400 dark:hover:border-accent-500 
        hover:shadow-md dark:hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 
        dark:focus:ring-offset-secondary-900 focus:ring-offset-white
        active:scale-95
        ${className}
      `}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {/* Track interno */}
      <span
        className={`
          absolute inset-0.5 rounded-full 
          transition-all duration-300 ease-in-out
          ${isDark ? "bg-secondary-800 shadow-inner" : "bg-white shadow-inner"}
        `}
      />

      {/* Círculo deslizante con icono */}
      <span
        className={`
          absolute top-0.5 w-5 h-5 rounded-full 
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          shadow-sm
          ${
            isDark
              ? "left-6 bg-white text-accent-600"
              : "left-0.5 bg-secondary-100 text-secondary-600"
          }
        `}
      >
        {isDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
      </span>

      {/* Indicador de estado visual */}
      <span
        className={`
          absolute top-1 right-1.5 w-1 h-1 rounded-full
          transition-opacity duration-300
          ${
            isDark ? "bg-accent-400 opacity-100" : "bg-secondary-400 opacity-60"
          }
        `}
      />
    </button>
  );
};

export default ThemeToggle;
