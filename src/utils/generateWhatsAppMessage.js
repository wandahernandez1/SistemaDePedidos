import { formatPrice } from "./formatPrice";

/**
 * Genera el detalle de personalización de empanadas
 * @param {Object} customizacion - Objeto con la personalización de empanadas
 * @returns {string} Texto formateado con el detalle
 */
const formatEmpanadaDetail = (customizacion) => {
  if (!customizacion || !customizacion.empanadas) return "";

  let detail = "   📝 *Detalle de empanadas:*\n";
  customizacion.empanadas.forEach((emp) => {
    detail += `      - ${emp.cantidad}x ${emp.tipo}\n`;
  });
  return detail;
};

/**
 * Genera el detalle de personalización de hamburguesas
 * @param {Object} customization - Objeto con la personalización de hamburguesa
 * @param {string} customizationText - Texto resumen de personalización
 * @returns {string} Texto formateado con el detalle
 */
const formatBurgerDetail = (customization, customizationText) => {
  if (!customization) return "";

  let detail = "   📝 *Personalización:*\n";

  // Ingredientes removidos
  if (customization.removed && customization.removed.length > 0) {
    detail += `      ❌ Sin: ${customization.removed.join(", ")}\n`;
  }

  // Ingredientes agregados
  if (customization.added && customization.added.length > 0) {
    const addedItems = customization.added
      .map((ing) =>
        ing.quantity > 1 ? `${ing.quantity}x ${ing.name}` : ing.name
      )
      .join(", ");
    detail += `      ✅ Extras: ${addedItems}\n`;
  }

  return detail;
};

/**
 * Genera el mensaje formateado para WhatsApp
 * @param {Array} cartItems - Items del carrito
 * @param {number} total - Total del pedido
 * @param {string} deliveryTime - Horario de entrega solicitado
 * @param {string} estimatedTime - Horario estimado (+30min)
 * @param {string} deliveryType - Tipo de entrega ("pickup" o "delivery")
 * @param {string} deliveryAddress - Dirección de envío (solo si es delivery)
 * @returns {string} Mensaje formateado para WhatsApp
 */
export const generateWhatsAppMessage = (
  cartItems,
  total,
  deliveryTime,
  estimatedTime,
  deliveryType = "pickup",
  deliveryAddress = ""
) => {
  let message = "*NUEVO PEDIDO*\n\n";

  // Tipo de entrega
  const isDelivery = deliveryType === "delivery";
  message += `🚀 *Tipo de entrega:* ${
    isDelivery ? "Envío a domicilio 🛵" : "Retiro en local 🏪"
  }\n`;

  if (isDelivery && deliveryAddress) {
    message += `📍 *Dirección:* ${deliveryAddress}\n`;
  }

  message += "\n📋 *Detalle del pedido:*\n";
  message += "─────────────────\n";

  cartItems.forEach((item, index) => {
    const subtotal = item.precio * item.quantity;
    const unidadText = item.unidad === "docena" ? "docena(s)" : "unidad(es)";

    message += `\n${index + 1}. *${item.nombre}*\n`;
    message += `   • Cantidad: ${item.quantity} ${unidadText}\n`;
    message += `   • Precio unitario: ${formatPrice(item.precio)}\n`;
    message += `   • Subtotal: ${formatPrice(subtotal)}\n`;

    // Agregar detalle de empanadas personalizadas
    if (item.customizacion && item.customizacion.empanadas) {
      message += formatEmpanadaDetail(item.customizacion);
    }

    // Agregar detalle de hamburguesas personalizadas
    if (
      item.customization &&
      (item.customization.removed || item.customization.added)
    ) {
      message += formatBurgerDetail(item.customization, item.customizationText);
    }
  });

  message += "\n─────────────────\n";
  message += `💰 *TOTAL: ${formatPrice(total)}*\n\n`;

  message += "*Horarios:*\n";
  message += `📍 Horario solicitado: ${deliveryTime}\n`;
  message += `🕐 Horario estimado: ${estimatedTime}\n\n`;

  message += "¡Gracias por tu pedido! 😊";

  return encodeURIComponent(message);
};

/**
 * Calcula el horario estimado de entrega (+30 minutos)
 * @param {string} selectedTime - Horario seleccionado (HH:mm)
 * @returns {string} Horario estimado (HH:mm)
 */
export const calculateEstimatedTime = (selectedTime) => {
  if (!selectedTime) return "";

  const [hours, minutes] = selectedTime.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes + 30);

  const estimatedHours = date.getHours().toString().padStart(2, "0");
  const estimatedMinutes = date.getMinutes().toString().padStart(2, "0");

  return `${estimatedHours}:${estimatedMinutes}`;
};

/**
 * Genera la URL de WhatsApp con el mensaje
 * @param {string} phoneNumber - Número de teléfono sin espacios ni símbolos
 * @param {string} message - Mensaje codificado
 * @returns {string} URL completa de WhatsApp
 */
export const generateWhatsAppUrl = (phoneNumber, message) => {
  return `https://wa.me/${phoneNumber}?text=${message}`;
};
