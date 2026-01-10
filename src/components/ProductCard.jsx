import { useState, memo, useCallback, useMemo } from "react";
import {
  Settings,
  ChevronRight,
  ShoppingCart,
  Sparkles,
  Star,
  Percent,
  Tag,
} from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import BurgerCustomizationModal from "./BurgerCustomizationModal";
import EmpanadaCustomizationModal from "./EmpanadaCustomizationModal";
import {
  getActiveOffer,
  getActiveOfferFromArray,
  calculateDiscountPercentage,
} from "../shared/constants/offers";

/**
 * Componente ProductCard - Tarjeta de producto individual
 * Diseño premium con gradientes sutiles y transiciones suaves
 * Optimizado con React.memo para evitar re-renders innecesarios
 *
 * @param {object} product - Datos del producto
 * @param {function} onAddToCart - Callback al agregar al carrito
 * @param {array} activeOffers - Array opcional de ofertas activas (desde Supabase)
 */
const ProductCard = memo(({ product, onAddToCart, activeOffers = [] }) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [showEmpanadaCustomization, setShowEmpanadaCustomization] =
    useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Verificar si el producto tiene una oferta activa
  // Usa ofertas de Supabase si están disponibles, sino fallback local
  const activeOffer = useMemo(() => {
    if (activeOffers && activeOffers.length > 0) {
      return getActiveOfferFromArray(product.nombre, activeOffers);
    }
    return getActiveOffer(product.nombre);
  }, [product.nombre, activeOffers]);

  // Calcular el porcentaje de descuento si hay oferta
  // Usamos originalPrice de la oferta (ej: precio de DOBLE) o el precio del producto como fallback
  const discountPercentage = useMemo(() => {
    if (!activeOffer) return 0;
    // Priorizar originalPrice de la oferta (para casos como DOBLE donde el precio base es diferente)
    const originalPrice = activeOffer.originalPrice || product.precio;
    return calculateDiscountPercentage(originalPrice, activeOffer.offerPrice);
  }, [activeOffer, product.precio]);

  // Precio efectivo (con oferta o sin ella)
  const effectivePrice = activeOffer ? activeOffer.offerPrice : product.precio;

  // Producto con precio de oferta aplicado (si existe)
  // Incluye la descripción de oferta si existe (ej: "DOBLE")
  const productWithOffer = useMemo(() => {
    if (!activeOffer) return product;
    
    // Nombre del producto con variante de oferta
    const nombreConOferta = activeOffer.offerDescription 
      ? `${product.nombre} ${activeOffer.offerDescription}`
      : product.nombre;
    
    // Usar originalPrice de la oferta (ej: precio de DOBLE) o el precio del producto
    const originalPrice = activeOffer.originalPrice || product.precio;
    
    return {
      ...product,
      nombre: nombreConOferta,
      nombreOriginal: product.nombre,
      precio: effectivePrice,
      precioOriginal: originalPrice,
      enOferta: true,
      offerDescription: activeOffer.offerDescription,
    };
  }, [product, activeOffer, effectivePrice]);

  const isDocenaMixta =
    product.tipoEspecial === "docena_mixta" ||
    product.tipo_especial === "docena_mixta";

  const handleAddClick = useCallback(() => {
    if (product.categoria === "hamburguesas") {
      setShowCustomization(true);
    } else if (isDocenaMixta) {
      setShowEmpanadaCustomization(true);
    } else {
      // Agregar con precio de oferta si aplica
      onAddToCart(productWithOffer);
    }
  }, [product, productWithOffer, onAddToCart, isDocenaMixta]);

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
        className={`group relative rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-300 ease-out bg-white dark:bg-secondary-800/95 ${
          activeOffer ? "ring-2 ring-primary-400/50" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          boxShadow: isHovered
            ? activeOffer
              ? "0 20px 40px -12px rgba(35, 137, 238, 0.3), 0 0 0 1px rgba(35, 137, 238, 0.15)"
              : "0 20px 40px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(35, 137, 238, 0.15)"
            : "0 4px 20px -4px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Gradient border effect */}
        <div
          className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500 ${
            activeOffer
              ? "bg-gradient-to-br from-primary-400/15 via-transparent to-amber-400/15 opacity-100"
              : "bg-gradient-to-br from-primary-400/10 via-transparent to-accent-400/10 opacity-0 group-hover:opacity-100"
          }`}
        />

        {/* Image Container - MISMO TAMAÑO PARA TODAS */}
        <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-secondary-100 dark:bg-secondary-700">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />

          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            style={{
              objectPosition: `${product.imagenPosicion?.x ?? product.imagen_posicion?.x ?? 50}% ${product.imagenPosicion?.y ?? product.imagen_posicion?.y ?? 50}%`,
            }}
          />

          {/* OFERTA: Badge de descuento - Estilo profesional azul/dorado */}
          {activeOffer && (
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-lg">
                <Percent className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{discountPercentage}% OFF</span>
              </div>
              {/* Badge de variante especial (ej: DOBLE) */}
              {activeOffer.offerDescription && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg">
                  <Star className="w-3 h-3 fill-white" />
                  <span className="text-[10px] font-black uppercase tracking-wide">{activeOffer.offerDescription}</span>
                </div>
              )}
            </div>
          )}

          {/* Badge de unidad - Siempre visible */}
          <div className="absolute top-3 right-3 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-secondary-800 dark:text-white backdrop-blur-md bg-white/90 dark:bg-secondary-900/90 shadow-lg border border-white/50 dark:border-secondary-600/50">
              <Sparkles className="w-3 h-3 text-accent-500" />
              {product.unidad}
            </span>
          </div>

          {/* Badge de oferta del día (si existe) */}
          {activeOffer && activeOffer.badge && (
            <div className="absolute bottom-3 left-3 z-20">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg">
                <Tag className="w-3 h-3" />
                <span className="text-[10px] font-bold">{activeOffer.badge}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content - MISMO PADDING PARA TODAS */}
        <div className="relative p-5 sm:p-6 flex flex-col gap-3 grow bg-gradient-to-b from-white to-secondary-50/30 dark:from-secondary-800/95 dark:to-secondary-900/95">
          {/* Decorative accent line */}
          <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent ${activeOffer ? "via-primary-400/40" : "via-primary-400/30"} to-transparent`} />

          {/* Título con variante de oferta */}
          <div className="flex flex-col gap-1">
            <h3 className="text-lg sm:text-xl font-bold text-secondary-900 dark:text-white m-0 leading-tight tracking-tight transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {product.nombre}
              {activeOffer?.offerDescription && (
                <span className="text-primary-600 dark:text-primary-400"> {activeOffer.offerDescription}</span>
              )}
            </h3>
            {/* Indicador de oferta especial */}
            {activeOffer?.offerDescription && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ⭐ Hoy: {product.nombre} versión {activeOffer.offerDescription.toLowerCase()}
              </span>
            )}
          </div>

          <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed m-0 grow line-clamp-2">
            {product.descripcion}
          </p>

          {/* Footer - Precios y botón */}
          <div className="relative flex justify-between items-center mt-auto pt-4 gap-3">
            {/* Separator line */}
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${activeOffer ? "via-primary-200 dark:via-primary-800/50" : "via-secondary-200 dark:via-secondary-700"} to-transparent`} />

            {/* Precio */}
            <div className="flex flex-col">
              {activeOffer ? (
                <>
                  <span className="text-xs text-secondary-400 dark:text-secondary-500 line-through">
                    {formatPrice(activeOffer.originalPrice || product.precio)}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(effectivePrice)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs text-secondary-500 dark:text-secondary-500 font-medium uppercase tracking-wider">
                    Precio
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {formatPrice(product.precio)}
                  </span>
                </>
              )}
            </div>

            {/* Botón - siempre azul */}
            <button
              className="group/btn relative overflow-hidden border-none rounded-2xl px-5 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 active:scale-95 shrink-0 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white shadow-lg shadow-primary-500/20"
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
          burger={productWithOffer}
          onClose={handleCloseCustomization}
          onAddToCart={handleCustomizedAdd}
        />
      )}

      {showEmpanadaCustomization && (
        <EmpanadaCustomizationModal
          product={productWithOffer}
          onClose={handleCloseEmpanadaCustomization}
          onAddToCart={handleCustomizedAdd}
        />
      )}
    </>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
