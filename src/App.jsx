import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import PublicPage from "./pages/PublicPage";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import ProductManager from "./components/admin/ProductManager";
import ProtectedRoute from "./components/admin/ProtectedRoute";

/**
 * Componente principal de la aplicación
 * Gestiona las rutas públicas y de administración
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Ruta pública - Tienda */}
            <Route path="/" element={<PublicPage />} />

            {/* Ruta de login del admin */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Ruta protegida - Dashboard del admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Ruta protegida - ProductManager por categoría */}
            <Route
              path="/admin/productos/:categoria"
              element={
                <ProtectedRoute>
                  <ProductManager />
                </ProtectedRoute>
              }
            />

            {/* Redirigir /admin a /admin/dashboard */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />

            {/* Cualquier otra ruta redirige a la página principal */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
