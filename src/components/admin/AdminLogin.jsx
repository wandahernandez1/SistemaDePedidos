import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLogin.css";

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

      // Mensaje de error personalizado
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
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <h1>Panel de Administración</h1>
          <p>LA COCINA DE LAU</p>
        </div>

        <div className="credentials-info">
          <p>
            <strong>Usuario:</strong> useradmin
          </p>
          <p>
            <strong>Contraseña:</strong> 123456
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="useradmin"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="login-footer">
          <button onClick={() => navigate("/")} className="back-button">
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
