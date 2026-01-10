/**
 * Configuración de Ofertas del Día
 *
 * Este archivo proporciona funciones helper para manejar ofertas.
 * Las ofertas se cargan desde Supabase a través del hook useOffers.
 *
 * Las ofertas locales (dailyOffers) se usan como fallback si no hay conexión a Supabase.
 *
 * IMPORTANTE: El nombre del producto debe coincidir EXACTAMENTE con el nombre en la base de datos.
 *
 * CAMPOS DISPONIBLES:
 * - productName: Nombre exacto del producto en la base de datos
 * - offerPrice: Precio de oferta
 * - originalPrice: Precio original (opcional, se usa para calcular %)
 * - validDate: "today" o fecha en formato YYYY-MM-DD
 * - badge: Texto del badge (ej: "¡Oferta del día!")
 * - offerDescription: Descripción especial de la oferta (ej: "DOBLE", "CON PAPAS", etc.)
 * - category: Categoría del producto
 * - is_active: Si la oferta está activa
 */

// Ofertas locales como fallback (cuando Supabase no está disponible)
// NOTA: El nombre debe coincidir EXACTAMENTE con el nombre en la base de datos de Supabase
export const dailyOffers = [
  {
    productName: "Bacon", // Nombre del producto base en tu DB
    offerPrice: 13999,
    originalPrice: 15500, // Precio aprox. de una bacon doble
    validDate: "today",
    badge: "¡Solo hoy!",
    offerDescription: "DOBLE", // Indica que la oferta es por la versión DOBLE
    category: "hamburguesas",
    is_active: true,
  },
];

/**
 * Verifica si una oferta está activa hoy
 * @param {string} validDate - Fecha de validez o "today"
 * @returns {boolean}
 */
export const isOfferValidToday = (validDate) => {
  if (validDate === "today") return true;

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Si es string en formato YYYY-MM-DD
  if (typeof validDate === "string") {
    return validDate === todayStr;
  }

  return false;
};

/**
 * Obtiene la oferta activa para un producto específico desde un array de ofertas
 * @param {string} productName - Nombre del producto
 * @param {array} offersArray - Array de ofertas (desde Supabase o local)
 * @returns {object|null} - Datos de la oferta o null si no hay oferta activa
 */
export const getActiveOfferFromArray = (productName, offersArray = []) => {
  if (!productName || !offersArray.length) return null;

  // Normalizar: lowercase, quitar espacios extra, quitar acentos
  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const normalizedName = normalizeString(productName);

  const offer = offersArray.find((offer) => {
    // Para ofertas de Supabase
    const offerName = normalizeString(
      offer.product_name || offer.productName || ""
    );
    const validDate = offer.valid_date || offer.validDate;
    const isActive = offer.is_active !== false;

    return (
      isActive &&
      (normalizedName === offerName ||
        normalizedName.includes(offerName) ||
        offerName.includes(normalizedName)) &&
      isOfferValidToday(validDate)
    );
  });

  if (!offer) return null;

  // Normalizar estructura de oferta
  return {
    productName: offer.product_name || offer.productName,
    offerPrice: offer.offer_price || offer.offerPrice,
    originalPrice: offer.original_price || offer.originalPrice,
    validDate: offer.valid_date || offer.validDate,
    badge: offer.badge_text || offer.badge || "¡Oferta del día!",
    offerDescription: offer.offer_description || offer.offerDescription || null,
    category: offer.category,
    discountPercentage: offer.discount_percentage,
  };
};

/**
 * Obtiene la oferta activa para un producto específico (fallback local)
 * @param {string} productName - Nombre del producto
 * @returns {object|null} - Datos de la oferta o null si no hay oferta activa
 */
export const getActiveOffer = (productName) => {
  return getActiveOfferFromArray(productName, dailyOffers);
};

/**
 * Calcula el porcentaje de descuento
 * @param {number} originalPrice - Precio original
 * @param {number} offerPrice - Precio de oferta
 * @returns {number} - Porcentaje de descuento redondeado
 */
export const calculateDiscountPercentage = (originalPrice, offerPrice) => {
  if (!originalPrice || !offerPrice || originalPrice <= 0) return 0;
  return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
};

/**
 * Obtiene todas las ofertas activas para hoy de un array
 * @param {array} offersArray - Array de ofertas
 * @returns {array} - Array de ofertas activas
 */
export const getActiveOffers = (offersArray = dailyOffers) => {
  return offersArray.filter((offer) => {
    const validDate = offer.valid_date || offer.validDate;
    const isActive = offer.is_active !== false;
    return isActive && isOfferValidToday(validDate);
  });
};
