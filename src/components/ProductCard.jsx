import { useState } from "react";
import { Settings, ChevronRight, Plus } from "lucide-react";
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

  const getButtonContent = () => {
    if (product.categoria === "hamburguesas") {
      return (
        <>
          <Settings className="h-4 w-4" />
          Personalizar
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
          Elegir
        </>
      );
    }
    return (
      <>
        <Plus className="h-4 w-4" />
        Agregar
      </>
    );
  };

  return (
    <>
      <div className="bg-white rounded-card overflow-hidden shadow-card transition-all duration-200 flex flex-col h-full border border-secondary-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-primary-300">
        {/* Image */}
        <div className="relative w-full h-48 overflow-hidden bg-secondary-50">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          <span className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded text-xs font-medium text-secondary-500 border border-secondary-200">
            {product.unidad}
          </span>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col gap-3 flex-grow">
          <h3 className="text-lg font-bold text-secondary-800 m-0 leading-tight tracking-tight">
            {product.nombre}
          </h3>
          <p className="text-sm text-secondary-500 leading-relaxed m-0 flex-grow">
            {product.descripcion}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center mt-auto pt-4 border-t-2 border-secondary-100">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(product.precio)}
            </span>
            <button
              className="bg-primary-500 text-white border-none rounded-button px-4 py-2.5 text-sm font-semibold cursor-pointer flex items-center gap-1.5 transition-all duration-200 hover:bg-primary-600 hover:shadow-md active:scale-[0.98]"
              onClick={handleAddClick}
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
