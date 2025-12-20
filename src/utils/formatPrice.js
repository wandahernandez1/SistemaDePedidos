/**
 * Formatea un número como precio en formato argentino
 * @param {number} price - Precio a formatear
 * @returns {string} Precio formateado (ej: "$3.500")
 */
export const formatPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) {
    return "$0";
  }

  return `$${price.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};
