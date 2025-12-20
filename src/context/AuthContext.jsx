import { createContext, useContext, useState, useEffect } from "react";

/**
 * Credenciales hardcodeadas del administrador
 * Usuario: useradmin
 * Contraseña: 123456
 */
const ADMIN_CREDENTIALS = {
  username: "useradmin",
  password: "123456",
};

const AuthContext = createContext();

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

/**
 * Proveedor del contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedSession = localStorage.getItem("admin_session");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        // Verificar que la sesión no haya expirado (24 horas)
        const sessionAge = Date.now() - session.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 horas en ms

        if (sessionAge < maxAge) {
          setUser(session.user);
        } else {
          localStorage.removeItem("admin_session");
        }
      } catch (error) {
        console.error("Error al cargar sesión:", error);
        localStorage.removeItem("admin_session");
      }
    }
    setLoading(false);
  }, []);

  /**
   * Iniciar sesión con credenciales hardcodeadas
   */
  const login = async (username, password) => {
    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Validar credenciales
      if (
        username === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password
      ) {
        const userData = {
          username: ADMIN_CREDENTIALS.username,
          role: "admin",
        };

        // Guardar sesión en localStorage
        const session = {
          user: userData,
          timestamp: Date.now(),
        };
        localStorage.setItem("admin_session", JSON.stringify(session));

        setUser(userData);
        return userData;
      } else {
        throw new Error("Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = async () => {
    try {
      localStorage.removeItem("admin_session");
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
