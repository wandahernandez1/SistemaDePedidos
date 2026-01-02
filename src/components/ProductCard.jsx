import { useState } from "react";
import { Settings, ChevronRight, Plus, ShoppingCart } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import BurgerCustomizationModal from "./BurgerCustomizationModal";
import EmpanadaCustomizationModal from "./EmpanadaCustomizationModal";

/**
 * Componente ProductCard - Tarjeta de producto individual
 * Diseño profesional y minimalista con efectos hover elegantes
 */
const ProductCard = ({ product, onAddToCart }) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [showEmpanadaCustomization, setShowEmpanadaCustomization] =
    useState(false);

  const handleAddClick = () => {
    const isDocenaMixta =
      product.tipoEspecial === "docena_mixta" ||
      product.tipo_especial === "docena_mixta";

    if (product.categoria === "hamburguesas") {
      setShowCustomization(true);
    } else if (isDocenaMixta) {
      setShowEmpanadaCustomization(true);
    } else {
      onAddToCart(product);
    }
  };

  const handleCustomizedAdd = (customizedProduct, quantity) => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(customizedProduct);
    }
  };

  const getButtonContent = () => {
    if (product.categoria === "hamburguesas") {
      return (
        <>
          <Settings className="h-4 w-4" />
          <span>Personalizar</span>
        </>
      );
    }
    if (
      product.tipoEspecial === "docena_mixta" ||
      product.tipo_especial === "docena_mixta"
    ) {
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
      <div className="group bg-white dark:bg-secondary-900 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col h-full border border-secondary-200 dark:border-secondary-700 hover:-translate-y-1 hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-500">
        {/* Image */}
        <div className="relative w-full h-52 overflow-hidden bg-secondary-100 dark:bg-secondary-700">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Unit badge */}
          <span className="absolute top-3 right-3 bg-white/95 dark:bg-secondary-800/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-secondary-700 dark:text-secondary-300 shadow-sm border border-secondary-200 dark:border-secondary-600">
            {product.unidad}
          </span>

          {/* Price overlay on hover */}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              {formatPrice(product.precio)}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col gap-3 grow">
          <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-50 m-0 leading-tight tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {product.nombre}
          </h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed m-0 grow line-clamp-2">
            {product.descripcion}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-secondary-200 dark:border-secondary-700 gap-2">
            <span className="text-lg sm:text-xl font-bold text-secondary-900 dark:text-secondary-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {formatPrice(product.precio)}
            </span>
            <button
              className="bg-primary-500 text-white border-none rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold cursor-pointer flex items-center gap-1.5 sm:gap-2 transition-all duration-200 shadow-sm hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 shrink-0"
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
          onClose={() => setShowCustomization(false)}
          onAddToCart={handleCustomizedAdd}
        />
      )}

      {showEmpanadaCustomization && (
        <EmpanadaCustomizationModal
          product={product}
          onClose={() => setShowEmpanadaCustomization(false)}
          onAddToCart={handleCustomizedAdd}
        />
      )}
    </>
  );
};

export default ProductCard;
