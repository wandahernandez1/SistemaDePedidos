import { memo, useCallback } from "react";
import { ShoppingCart } from "lucide-react";
import logo from "../assets/logo.png";
import { ThemeToggle } from "../shared/components/ui";
import RealTimeScheduleStatus from "./RealTimeScheduleStatus";

/**
 * Componente Navbar - Barra de navegación superior
 * Diseño profesional y minimalista con soporte para dark mode
 * Totalmente responsivo y optimizado para rendimiento
 */
const Navbar = memo(({ totalItems, onCartClick }) => {
  const handleCartClick = useCallback(() => {
    onCartClick?.();
  }, [onCartClick]);

  return (
    <nav className="bg-secondary-50 dark:bg-secondary-900 shadow-sm border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-50 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center gap-4 sm:gap-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0">
          <div className="bg-white dark:bg-secondary-800 p-0.5 rounded-full flex items-center justify-center border-2 border-secondary-300 dark:border-secondary-600 shadow-md transition-colors duration-200 shrink-0">
            <img
              src={logo}
              alt="Comidas Caseras Lau"
              className="w-11 h-11 sm:w-13 sm:h-13 object-cover rounded-full block"
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-secondary-900 dark:text-secondary-50 m-0 tracking-tight leading-tight truncate">
              LA COCINA DE LAU
            </h1>
            <p className="text-[10px] sm:text-xs font-medium text-secondary-600 dark:text-secondary-400 m-0 mt-0.5 tracking-wide truncate">
              Sabor casero en cada pedido
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Real-time Schedule Status */}
          <div className="hidden lg:block">
            <RealTimeScheduleStatus compact={true} />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart Button */}
          <button
            className="group relative bg-primary-500 border-none rounded-lg sm:rounded-xl px-3 sm:px-5 py-2 sm:py-3 cursor-pointer flex items-center gap-2 sm:gap-2.5 transition-colors duration-200 shadow-md hover:bg-primary-600 active:scale-[0.98]"
            onClick={handleCartClick}
            aria-label="Ver carrito"
          >
            <span className="font-semibold text-white text-xs sm:text-sm tracking-wide hidden sm:inline">
              Mi Pedido
            </span>
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full min-w-5 sm:min-w-5.5 h-5 sm:h-5.5 flex items-center justify-center text-[10px] sm:text-xs font-bold px-1 sm:px-1.5 border-2 border-white dark:border-secondary-900 shadow-lg">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
