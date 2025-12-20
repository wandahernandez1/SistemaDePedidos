import { useState, useEffect } from "react";
import { formatPrice } from "../utils/formatPrice";
import BurgerCustomizationModal from "./BurgerCustomizationModal";
import EmpanadaCustomizationModal from "./EmpanadaCustomizationModal";
import "./ProductCard.css";

/**
 * Componente ProductCard - Tarjeta de producto individual
 * Muestra información del producto y botón para agregar al carrito
 */
const ProductCard = ({ product, onAddToCart }) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [showEmpanadaCustomization, setShowEmpanadaCustomization] =
    useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddClick = () => {
    // Verificar si es docena mixta (camelCase o snake_case)
    const isDocenaMixta =
      product.tipoEspecial === "docena_mixta" ||
      product.tipo_especial === "docena_mixta";

    if (product.categoria === "hamburguesas") {
      console.log("Abriendo modal de hamburguesa");
      setShowCustomization(true);
    } else if (isDocenaMixta) {
      setShowEmpanadaCustomization(true);
    } else {
      console.log("Agregando al carrito directamente");
      onAddToCart(product);
    }
  };

  const handleCustomizedAdd = (customizedProduct, quantity) => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(customizedProduct);
    }
  };

  return (
    <>
      <div className="product-card">
        <div className="product-image-container">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="product-image"
            loading="lazy"
          />
          <span className="product-unit-badge">{product.unidad}</span>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.nombre}</h3>
          <p className="product-description">{product.descripcion}</p>

          <div className="product-footer">
            <span className="product-price">{formatPrice(product.precio)}</span>
            <button className="add-to-cart-button" onClick={handleAddClick}>
              {product.categoria === "hamburguesas"
                ? "Personalizar"
                : product.tipoEspecial === "docena_mixta" ||
                  product.tipo_especial === "docena_mixta"
                ? "Elegir Empanadas"
                : "Agregar"}
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
        <>
          <EmpanadaCustomizationModal
            product={product}
            onClose={() => setShowEmpanadaCustomization(false)}
            onAddToCart={handleCustomizedAdd}
          />
        </>
      )}
    </>
  );
};

export default ProductCard;
