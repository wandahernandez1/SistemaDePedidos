import { ShoppingCart } from "lucide-react";
import logo from "../assets/logo.png";
import { ThemeToggle } from "../shared/components/ui";

/**
 * Componente Navbar - Barra de navegación superior
 * Diseño profesional y minimalista con soporte para dark mode
 * Totalmente responsivo: mantiene el mismo aspecto en móvil y PC
 */
const Navbar = ({ totalItems, onCartClick }) => {
  return (
    <nav className="bg-white/95 dark:bg-secondary-900/95 backdrop-blur-md shadow-sm border-b border-secondary-100 dark:border-secondary-800 sticky top-0 z-50 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center gap-4 sm:gap-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0">
          <div className="bg-white dark:bg-secondary-800 p-0.5 rounded-full flex items-center justify-center border-2 border-secondary-100 dark:border-secondary-700 shadow-md transition-all duration-300 hover:border-primary-400 hover:shadow-lg hover:scale-105 shrink-0">
            <img
              src={logo}
              alt="Comidas Caseras Lau"
              className="w-11 h-11 sm:w-13 sm:h-13 object-cover rounded-full block"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-secondary-900 dark:text-secondary-50 m-0 tracking-tight leading-tight truncate">
              LA COCINA DE LAU
            </h1>
            <p className="text-[10px] sm:text-xs font-medium text-secondary-500 dark:text-secondary-400 m-0 mt-0.5 tracking-wide truncate">
              Sabor casero en cada pedido
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart Button */}
          <button
            className="group relative bg-primary-500 border-none rounded-lg sm:rounded-xl px-3 sm:px-5 py-2 sm:py-3 cursor-pointer flex items-center gap-2 sm:gap-2.5 transition-all duration-300 shadow-md hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            onClick={onCartClick}
            aria-label="Ver carrito"
          >
            <span className="font-semibold text-white text-xs sm:text-sm tracking-wide hidden sm:inline">
              Mi Pedido
            </span>
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-white transition-transform duration-300 group-hover:scale-110" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-[20px] sm:min-w-[22px] h-[20px] sm:h-[22px] flex items-center justify-center text-[10px] sm:text-xs font-bold px-1 sm:px-1.5 border-2 border-white dark:border-secondary-900 shadow-lg animate-bounce">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
