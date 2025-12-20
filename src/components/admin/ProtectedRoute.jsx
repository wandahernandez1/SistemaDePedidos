import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Componente para proteger rutas que requieren autenticación
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
