import { useState, memo, useCallback } from "react";
import {
  Settings,
  ChevronRight,
  ShoppingCart,
  Sparkles,
  Star,
} from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import BurgerCustomizationModal from "./BurgerCustomizationModal";
import EmpanadaCustomizationModal from "./EmpanadaCustomizationModal";

/**
 * Componente ProductCard - Tarjeta de producto individual
 * Diseño premium con gradientes sutiles y transiciones suaves
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
const ProductCard = memo(({ product, onAddToCart }) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [showEmpanadaCustomization, setShowEmpanadaCustomization] =
    useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isDocenaMixta =
    product.tipoEspecial === "docena_mixta" ||
    product.tipo_especial === "docena_mixta";

  const handleAddClick = useCallback(() => {
    if (product.categoria === "hamburguesas") {
      setShowCustomization(true);
    } else if (isDocenaMixta) {
      setShowEmpanadaCustomization(true);
    } else {
      onAddToCart(product);
    }
  }, [product, onAddToCart, isDocenaMixta]);

  const handleCustomizedAdd = useCallback(
    (customizedProduct, quantity) => {
      for (let i = 0; i < quantity; i++) {
        onAddToCart(customizedProduct);
      }
    },
    [onAddToCart]
  );

  const handleCloseCustomization = useCallback(() => {
    setShowCustomization(false);
  }, []);

  const handleCloseEmpanadaCustomization = useCallback(() => {
    setShowEmpanadaCustomization(false);
  }, []);

  const getButtonContent = () => {
    if (product.categoria === "hamburguesas") {
      return (
        <>
          <Settings className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-90" />
          <span>Personalizar</span>
        </>
      );
    }
    if (isDocenaMixta) {
      return (
        <>
          <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          <span>Elegir</span>
        </>
      );
    }
    return (
      <>
        <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
        <span>Agregar</span>
      </>
    );
  };

  return (
    <>
      <div
        className="group relative bg-white dark:bg-secondary-800/95 rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-300 ease-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          boxShadow: isHovered
            ? "0 20px 40px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(35, 137, 238, 0.15)"
            : "0 4px 20px -4px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Gradient border effect - sutil */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-400/10 via-transparent to-accent-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image Container */}
        <div className="relative w-full h-48 sm:h-56 overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10 opacity-50 group-hover:opacity-30 transition-opacity duration-500" />

          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />

          {/* Floating unit badge with glassmorphism */}
          <div className="absolute top-4 right-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-secondary-800 dark:text-white backdrop-blur-md bg-white/80 dark:bg-secondary-900/80 shadow-lg border border-white/50 dark:border-secondary-600/50">
              <Sparkles className="w-3.5 h-3.5 text-accent-500" />
              {product.unidad}
            </span>
          </div>

          {/* Price floating badge */}
          <div className="absolute bottom-4 left-4 z-20 transform transition-all duration-400 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 rounded-2xl text-base font-bold shadow-xl shadow-primary-500/20">
              <Star className="w-4 h-4 fill-accent-300 text-accent-300" />
              {formatPrice(product.precio)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5 sm:p-6 flex flex-col gap-3 grow bg-gradient-to-b from-white to-secondary-50/30 dark:from-secondary-800/95 dark:to-secondary-900/95">
          {/* Decorative accent line */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary-400/30 to-transparent" />

          <h3 className="text-lg sm:text-xl font-bold text-secondary-900 dark:text-white m-0 leading-tight tracking-tight transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
            {product.nombre}
          </h3>

          <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed m-0 grow line-clamp-2">
            {product.descripcion}
          </p>

          {/* Footer */}
          <div className="relative flex justify-between items-center mt-auto pt-4 gap-3">
            {/* Separator line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary-200 dark:via-secondary-700 to-transparent" />

            <div className="flex flex-col">
              <span className="text-xs text-secondary-500 dark:text-secondary-500 font-medium uppercase tracking-wider">
                Precio
              </span>
              <span className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {formatPrice(product.precio)}
              </span>
            </div>

            <button
              className="group/btn relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white border-none rounded-2xl px-5 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 active:scale-95 shrink-0"
              onClick={handleAddClick}
              aria-label={`Agregar ${product.nombre} al carrito`}
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                {getButtonContent()}
              </span>
            </button>
          </div>
        </div>
      </div>

      {showCustomization && (
        <BurgerCustomizationModal
          burger={product}
          onClose={handleCloseCustomization}
          onAddToCart={handleCustomizedAdd}
        />
      )}

      {showEmpanadaCustomization && (
        <EmpanadaCustomizationModal
          product={product}
          onClose={handleCloseEmpanadaCustomization}
          onAddToCart={handleCustomizedAdd}
        />
      )}
    </>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
