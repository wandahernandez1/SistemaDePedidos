import { useState } from "react";
import { formatPrice } from "../utils/formatPrice";
import BurgerCustomizationModal from "./BurgerCustomizationModal";
import EmpanadaCustomizationModal from "./EmpanadaCustomizationModal";

/**
 * Componente ProductCard - Tarjeta de producto individual
 * Muestra información del producto y botón para agregar al carrito
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

  const getButtonText = () => {
    if (product.categoria === "hamburguesas") return "Personalizar";
    if (
      product.tipoEspecial === "docena_mixta" ||
      product.tipo_especial === "docena_mixta"
    ) {
      return "Elegir Empanadas";
    }
    return "Agregar";
  };

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-200 flex flex-col h-full border border-zinc-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-zinc-300">
        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden bg-zinc-50">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          <span className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded text-xs font-medium text-zinc-500 border border-zinc-200">
            {product.unidad}
          </span>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col gap-3 flex-grow">
          <h3 className="text-lg font-bold text-zinc-800 m-0 leading-tight tracking-tight">
            {product.nombre}
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed m-0 flex-grow">
            {product.descripcion}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center mt-auto pt-4 border-t-2 border-zinc-100">
            <span className="text-xl font-bold text-zinc-800">
              {formatPrice(product.precio)}
            </span>
            <button
              className="bg-zinc-800 text-white border-none rounded-md px-4 py-2.5 text-sm font-semibold cursor-pointer flex items-center gap-1.5 transition-all duration-200 hover:bg-zinc-700 active:scale-[0.98]"
              onClick={handleAddClick}
            >
              {getButtonText()}
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
