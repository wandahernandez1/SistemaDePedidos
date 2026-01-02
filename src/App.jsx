import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

// Lazy load de componentes para mejor rendimiento inicial
const PublicPage = lazy(() => import("./pages/PublicPage"));
const AdminLogin = lazy(() => import("./components/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const ProductManager = lazy(() => import("./components/admin/ProductManager"));
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute"));

// Componente de loading simple y ligero
const PageLoader = () => (
  <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
      <p className="text-secondary-600 dark:text-secondary-400 text-sm font-medium">
        Cargando...
      </p>
    </div>
  </div>
);

/**
 * Componente principal de la aplicación
 * Gestiona las rutas públicas y de administración
 * Optimizado con lazy loading para mejor rendimiento en móviles
 */
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
