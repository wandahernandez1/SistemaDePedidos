import { useState, memo, useCallback } from "react";
import { Settings, ChevronRight, Plus, ShoppingCart } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import BurgerCustomizationModal from "./BurgerCustomizationModal";
import EmpanadaCustomizationModal from "./EmpanadaCustomizationModal";

/**
 * Componente ProductCard - Tarjeta de producto individual
 * Diseño profesional y minimalista con efectos hover elegantes
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
const ProductCard = memo(({ product, onAddToCart }) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [showEmpanadaCustomization, setShowEmpanadaCustomization] =
    useState(false);

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
          <Settings className="h-4 w-4" />
          <span>Personalizar</span>
        </>
      );
    }
    if (isDocenaMixta) {
      return (
        <>
          <ChevronRight className="h-4 w-4" />
          <span>Elegir</span>
        </>
      );
    }
    return (
      <>
        <ShoppingCart className="h-4 w-4" />
        <span>Agregar</span>
      </>
    );
  };

  return (
    <>
      <div className="group bg-white dark:bg-secondary-900 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 flex flex-col h-full border border-secondary-200 dark:border-secondary-700 hover:-translate-y-1 hover:shadow-lg hover:border-primary-400 dark:hover:border-primary-500 gpu-accelerated">
        {/* Image */}
        <div className="relative w-full h-44 sm:h-52 overflow-hidden bg-secondary-100 dark:bg-secondary-700">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />

          {/* Unit badge */}
          <span className="absolute top-3 right-3 bg-white/95 dark:bg-secondary-800/95 px-3 py-1.5 rounded-full text-xs font-semibold text-secondary-700 dark:text-secondary-300 shadow-sm border border-secondary-200 dark:border-secondary-600">
            {product.unidad}
          </span>

          {/* Price overlay on hover */}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {formatPrice(product.precio)}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 grow">
          <h3 className="text-base sm:text-lg font-bold text-secondary-900 dark:text-secondary-50 m-0 leading-tight tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150">
            {product.nombre}
          </h3>
          <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed m-0 grow line-clamp-2">
            {product.descripcion}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center mt-auto pt-3 sm:pt-4 border-t border-secondary-200 dark:border-secondary-700 gap-2">
            <span className="text-base sm:text-xl font-bold text-secondary-900 dark:text-secondary-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {formatPrice(product.precio)}
            </span>
            <button
              className="bg-primary-500 text-white border-none rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold cursor-pointer flex items-center gap-1.5 sm:gap-2 transition-colors duration-150 shadow-sm hover:bg-primary-600 active:scale-[0.98] shrink-0"
              onClick={handleAddClick}
              aria-label={`Agregar ${product.nombre} al carrito`}
            >
              {getButtonContent()}
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
