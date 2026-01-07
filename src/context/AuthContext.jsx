import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

/**
 * Configuración de autenticación
 * Las credenciales se obtienen de variables de entorno para mayor seguridad
 * En producción, considera usar un backend real con autenticación JWT
 */
const AUTH_CONFIG = {
  // Credenciales desde variables de entorno (con fallback para desarrollo)
  username: import.meta.env.VITE_ADMIN_USERNAME || "useradmin",
  password: import.meta.env.VITE_ADMIN_PASSWORD || "123456",
  // Configuración de seguridad
  sessionMaxAge: 24 * 60 * 60 * 1000, // 24 horas en ms
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutos en ms
  sessionKey: "admin_session",
  attemptsKey: "login_attempts",
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
 * Proveedor del contexto de autenticación con protección contra brute force
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState({
    count: 0,
    lockUntil: null,
  });

  /**
   * Cargar intentos de login desde storage
   */
  const loadLoginAttempts = useCallback(() => {
    try {
      const saved = localStorage.getItem(AUTH_CONFIG.attemptsKey);
      if (saved) {
        const attempts = JSON.parse(saved);
        // Verificar si el bloqueo ha expirado
        if (attempts.lockUntil && Date.now() > attempts.lockUntil) {
          localStorage.removeItem(AUTH_CONFIG.attemptsKey);
          return { count: 0, lockUntil: null };
        }
        return attempts;
      }
    } catch {
      localStorage.removeItem(AUTH_CONFIG.attemptsKey);
    }
    return { count: 0, lockUntil: null };
  }, []);

  /**
   * Guardar intentos de login
   */
  const saveLoginAttempts = useCallback((attempts) => {
    setLoginAttempts(attempts);
    localStorage.setItem(AUTH_CONFIG.attemptsKey, JSON.stringify(attempts));
  }, []);

  /**
   * Verificar si la cuenta está bloqueada
   */
  const isAccountLocked = useCallback(() => {
    const attempts = loadLoginAttempts();
    if (attempts.lockUntil && Date.now() < attempts.lockUntil) {
      const remainingTime = Math.ceil(
        (attempts.lockUntil - Date.now()) / 60000
      );
      return { locked: true, remainingMinutes: remainingTime };
    }
    return { locked: false, remainingMinutes: 0 };
  }, [loadLoginAttempts]);

  useEffect(() => {
    // Cargar intentos de login
    const attempts = loadLoginAttempts();
    setLoginAttempts(attempts);

    // Verificar si hay una sesión guardada
    const savedSession = localStorage.getItem(AUTH_CONFIG.sessionKey);
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        // Verificar que la sesión no haya expirado
        const sessionAge = Date.now() - session.timestamp;

        if (sessionAge < AUTH_CONFIG.sessionMaxAge && session.user) {
          // Validar estructura de la sesión
          if (session.user.username && session.user.role) {
            setUser(session.user);
          } else {
            localStorage.removeItem(AUTH_CONFIG.sessionKey);
          }
        } else {
          localStorage.removeItem(AUTH_CONFIG.sessionKey);
        }
      } catch {
        localStorage.removeItem(AUTH_CONFIG.sessionKey);
      }
    }
    setLoading(false);
  }, [loadLoginAttempts]);

  /**
   * Sanitizar entrada de usuario
   */
  const sanitizeInput = (input) => {
    if (typeof input !== "string") return "";
    return input.trim().slice(0, 100); // Limitar longitud
  };

  /**
   * Iniciar sesión con protección contra brute force
   */
  const login = async (username, password) => {
    // Verificar si la cuenta está bloqueada
    const lockStatus = isAccountLocked();
    if (lockStatus.locked) {
      throw new Error(
        `Cuenta bloqueada. Intenta en ${lockStatus.remainingMinutes} minutos`
      );
    }

    // Sanitizar inputs
    const cleanUsername = sanitizeInput(username);
    const cleanPassword = sanitizeInput(password);

    // Validar que los campos no estén vacíos
    if (!cleanUsername || !cleanPassword) {
      throw new Error("Usuario y contraseña son requeridos");
    }

    // Simular delay de red para prevenir timing attacks
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 500)
    );

    // Validar credenciales de forma segura (comparación en tiempo constante simulada)
    const isValidUsername = cleanUsername === AUTH_CONFIG.username;
    const isValidPassword = cleanPassword === AUTH_CONFIG.password;

    if (isValidUsername && isValidPassword) {
      // Login exitoso - resetear intentos
      const resetAttempts = { count: 0, lockUntil: null };
      saveLoginAttempts(resetAttempts);

      const userData = {
        username: cleanUsername,
        role: "admin",
        loginAt: Date.now(),
      };

      // Guardar sesión en localStorage
      const session = {
        user: userData,
        timestamp: Date.now(),
      };
      localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(session));

      setUser(userData);
      return userData;
    } else {
      // Login fallido - incrementar intentos
      const currentAttempts = loadLoginAttempts();
      const newCount = currentAttempts.count + 1;

      let newAttempts;
      if (newCount >= AUTH_CONFIG.maxLoginAttempts) {
        // Bloquear cuenta
        newAttempts = {
          count: newCount,
          lockUntil: Date.now() + AUTH_CONFIG.lockoutDuration,
        };
      } else {
        newAttempts = {
          count: newCount,
          lockUntil: null,
        };
      }

      saveLoginAttempts(newAttempts);

      const remainingAttempts = AUTH_CONFIG.maxLoginAttempts - newCount;
      if (remainingAttempts > 0) {
        throw new Error(
          `Credenciales inválidas. ${remainingAttempts} intentos restantes`
        );
      } else {
        throw new Error(
          `Cuenta bloqueada por ${AUTH_CONFIG.lockoutDuration / 60000} minutos`
        );
      }
    }
  };

  /**
   * Cerrar sesión de forma segura
   */
  const logout = async () => {
    localStorage.removeItem(AUTH_CONFIG.sessionKey);
    setUser(null);
  };

  /**
   * Verificar si el usuario tiene un rol específico
   */
  const hasRole = useCallback(
    (role) => {
      return user?.role === role;
    },
    [user]
  );

  /**
   * Refrescar sesión si está próxima a expirar
   */
  const refreshSession = useCallback(() => {
    if (user) {
      const session = {
        user,
        timestamp: Date.now(),
      };
      localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(session));
    }
  }, [user]);

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAccountLocked,
    refreshSession,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
