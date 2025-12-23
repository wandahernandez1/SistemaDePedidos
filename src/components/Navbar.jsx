import { ShoppingCart } from "lucide-react";
import logo from "../assets/logo.png";

/**
 * Componente Navbar - Barra de navegación superior
 * Muestra el nombre del negocio y el contador del carrito
 */
const Navbar = ({ totalItems, onCartClick }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-50 py-3 backdrop-blur-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-8 md:px-4 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3.5 flex-1">
          <div className="bg-white p-0.5 rounded-full flex items-center justify-center border-2 border-secondary-200 shadow-sm transition-all duration-200 hover:border-primary-500 hover:shadow-md hover:scale-105">
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
          className="relative bg-primary-500 border-none rounded-xl px-4 py-2.5 cursor-pointer flex items-center gap-2 transition-all duration-200 shadow-sm hover:bg-primary-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] sm:px-3 sm:min-w-[48px]"
          onClick={onCartClick}
          aria-label="Ver carrito"
        >
          <span className="font-semibold text-white text-sm tracking-wide sm:hidden">
            Mi Pedido
          </span>
          <ShoppingCart className="h-5 w-5 text-white" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center text-[0.7rem] font-bold px-1 border-2 border-white shadow-md animate-pulse">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
