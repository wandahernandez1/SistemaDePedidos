import {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";

/**
 * Contexto para gestión del tema (claro/oscuro)
 * Persiste la preferencia en localStorage
 */
const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  // Estado inicial seguro para SSR/hidratación
  const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };
  const [theme, setTheme] = useState(getInitialTheme);

  const isDark = theme === "dark";

  // Sincronizar clase dark en <html> y localStorage con transición suave
  useLayoutEffect(() => {
    const root = window.document.documentElement;

    // Agregar clase de transición antes del cambio
    root.classList.add("theme-transition");

    // Aplicar el tema
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);

    // Remover clase de transición después de que termine la animación
    const timeout = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 350);

    return () => clearTimeout(timeout);
  }, [theme, isDark]);

  // Escuchar cambios en la preferencia del sistema solo si no hay preferencia guardada
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setLightTheme = () => setTheme("light");
  const setDarkTheme = () => setTheme("dark");

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setLightTheme,
        setDarkTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
};

export default ThemeContext;
