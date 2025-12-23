import { ShoppingCart } from "lucide-react";
import logo from "../assets/logo.png";

/**
 * Componente Navbar - Barra de navegación superior
 * Diseño profesional y minimalista
 */
const Navbar = ({ totalItems, onCartClick }) => {
  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-secondary-100 sticky top-0 z-50 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-8 md:px-4 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3.5 flex-1">
          <div className="bg-white p-0.5 rounded-full flex items-center justify-center border-2 border-secondary-100 shadow-md transition-all duration-300 hover:border-primary-400 hover:shadow-lg hover:scale-105">
            <img
              src={logo}
              alt="Comidas Caseras Lau"
              className="w-13 h-13 object-cover rounded-full block sm:w-11 sm:h-11"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-secondary-900 m-0 tracking-tight leading-tight sm:text-lg">
              LA COCINA DE LAU
            </h1>
            <p className="text-xs font-medium text-secondary-500 m-0 mt-0.5 tracking-wide">
              Sabor casero en cada pedido
            </p>
          </div>
        </div>

        {/* Cart Button */}
        <button
          className="group relative bg-gradient-to-r from-primary-500 to-primary-600 border-none rounded-xl px-5 py-3 cursor-pointer flex items-center gap-2.5 transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] sm:px-3 sm:min-w-[48px]"
          onClick={onCartClick}
          aria-label="Ver carrito"
        >
          <span className="font-semibold text-white text-sm tracking-wide sm:hidden">
            Mi Pedido
          </span>
          <ShoppingCart className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-[22px] h-[22px] flex items-center justify-center text-xs font-bold px-1.5 border-2 border-white shadow-lg animate-bounce">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
