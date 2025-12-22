import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Componente de Login para el administrador
 */
const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error en login:", error);

      if (error.message === "Credenciales inválidas") {
        setError("Usuario o contraseña incorrectos");
      } else {
        setError("Error al iniciar sesión. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 p-5">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-800 mb-2">
            Panel de Administración
          </h1>
          <p className="text-zinc-500 font-medium">LA COCINA DE LAU</p>
        </div>

        {/* Credenciales de prueba */}
        <div className="bg-zinc-100 border-2 border-zinc-300 rounded-lg p-4 mb-6 text-center">
          <p className="text-zinc-700 text-sm mb-1">
            <span className="font-semibold text-zinc-800">Usuario:</span>{" "}
            useradmin
          </p>
          <p className="text-zinc-700 text-sm">
            <span className="font-semibold text-zinc-800">Contraseña:</span>{" "}
            123456
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="font-semibold text-zinc-700 text-sm"
            >
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="useradmin"
              disabled={loading}
              autoComplete="username"
              className="px-4 py-3 border-2 border-zinc-200 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-zinc-800 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="font-semibold text-zinc-700 text-sm"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
              autoComplete="current-password"
              className="px-4 py-3 border-2 border-zinc-200 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-zinc-800 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100 disabled:cursor-not-allowed"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 py-3 px-4 rounded-lg text-sm text-center border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="bg-zinc-800 text-white border-none py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 mt-2 hover:bg-zinc-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-transparent border-none text-zinc-500 text-sm cursor-pointer underline transition-colors duration-200 hover:text-zinc-800"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
