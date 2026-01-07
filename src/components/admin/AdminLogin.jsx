import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";

/**
 * Componente de Login para el administrador
 * Con protección contra brute force y validaciones
 */
const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockInfo, setLockInfo] = useState({
    locked: false,
    remainingMinutes: 0,
  });

  const { login, isAccountLocked, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Verificar estado de bloqueo periódicamente
  useEffect(() => {
    const checkLock = () => {
      const status = isAccountLocked();
      setLockInfo(status);
      if (status.locked) {
        setError(
          `Cuenta bloqueada. Intenta en ${status.remainingMinutes} minutos`
        );
      }
    };

    checkLock();
    const interval = setInterval(checkLock, 30000); // Verificar cada 30 segundos

    return () => clearInterval(interval);
  }, [isAccountLocked]);

  const validateForm = () => {
    if (!username.trim()) {
      setError("El usuario es requerido");
      return false;
    }
    if (!password.trim()) {
      setError("La contraseña es requerida");
      return false;
    }
    if (username.length < 3) {
      setError("El usuario debe tener al menos 3 caracteres");
      return false;
    }
    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validar formulario
    if (!validateForm()) return;

    // Verificar si está bloqueado
    if (lockInfo.locked) {
      setError(
        `Cuenta bloqueada. Intenta en ${lockInfo.remainingMinutes} minutos`
      );
      return;
    }

    setLoading(true);

    try {
      await login(username, password);
      // Redirigir a la página intentada o al dashboard
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message || "Error al iniciar sesión");
      // Actualizar estado de bloqueo
      const status = isAccountLocked();
      setLockInfo(status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 p-5">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            Panel de Administración
          </h1>
          <p className="text-neutral-500 font-medium">LA COCINA DE LAU</p>
        </div>

        {/* Alerta de bloqueo */}
        {lockInfo.locked && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-700 font-medium text-sm">
                Cuenta bloqueada temporalmente
              </p>
              <p className="text-red-600 text-xs">
                Demasiados intentos fallidos. Espera {lockInfo.remainingMinutes}{" "}
                minutos.
              </p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="font-semibold text-neutral-700 text-sm"
            >
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                required
                placeholder="Ingresa tu usuario"
                disabled={loading || lockInfo.locked}
                autoComplete="username"
                maxLength={50}
                className="w-full pl-10 pr-4 py-3 border-2 border-neutral-200 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:bg-neutral-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="font-semibold text-neutral-700 text-sm"
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                placeholder="Ingresa tu contraseña"
                disabled={loading || lockInfo.locked}
                autoComplete="current-password"
                maxLength={100}
                className="w-full pl-10 pr-12 py-3 border-2 border-neutral-200 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:bg-neutral-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || lockInfo.locked}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 py-3 px-4 rounded-lg text-sm text-center border border-red-200 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="bg-primary-500 text-white border-none py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 mt-2 hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            disabled={loading || lockInfo.locked}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-transparent border-none text-neutral-500 text-sm cursor-pointer underline transition-colors duration-200 hover:text-primary-600"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
