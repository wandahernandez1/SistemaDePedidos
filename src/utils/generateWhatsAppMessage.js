import { formatPrice } from "./formatPrice";

/**
 * Genera el detalle de personalización de empanadas
 * @param {Object} customizacion - Objeto con la personalización de empanadas
 * @returns {string} Texto formateado con el detalle
 */
const formatEmpanadaDetail = (customizacion) => {
  if (!customizacion || !customizacion.empanadas) return "";

  let detail = "   *Detalle de empanadas:*\n";
  customizacion.empanadas.forEach((emp) => {
    detail += `      • ${emp.cantidad}x ${emp.tipo}\n`;
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

  let detail = "   *Personalización:*\n";

  // Ingredientes removidos
  if (customization.removed && customization.removed.length > 0) {
    detail += `      Sin: ${customization.removed.join(", ")}\n`;
  }

  // Ingredientes agregados
  if (customization.added && customization.added.length > 0) {
    const addedItems = customization.added
      .map((ing) =>
        ing.quantity > 1 ? `${ing.quantity}x ${ing.name}` : ing.name
      )
      .join(", ");
    detail += `      Extras: ${addedItems}\n`;
  }

  return detail;
};

/**
 * Genera el mensaje formateado para WhatsApp
 * @param {Array} cartItems - Items del carrito
 * @param {number} total - Total del pedido (con descuento aplicado)
 * @param {string} deliveryTime - Horario de entrega solicitado
 * @param {string} estimatedTime - Horario estimado (+30min)
 * @param {string} deliveryType - Tipo de entrega ("pickup" o "delivery")
 * @param {string} deliveryAddress - Dirección de envío (solo si es delivery)
 * @param {string} customerName - Nombre del cliente
 * @param {string} paymentMethod - Método de pago ("transfer" o "cash")
 * @param {number} totalDiscount - Descuento total aplicado por ofertas
 * @param {number} totalWithoutDiscount - Total sin descuentos (precio original)
 * @param {Array} itemsWithOffer - Items que tienen oferta aplicada con detalle del descuento
 * @returns {string} Mensaje formateado para WhatsApp
 */
export const generateWhatsAppMessage = (
  cartItems,
  total,
  deliveryTime,
  estimatedTime,
  deliveryType = "pickup",
  deliveryAddress = "",
  customerName = "",
  paymentMethod = "cash",
  totalDiscount = 0,
  totalWithoutDiscount = 0,
  itemsWithOffer = []
) => {
  let message = "═══════════════════════\n";
  message += "*NUEVO PEDIDO*\n";
  message += "═══════════════════════\n\n";

  // Información del cliente
  if (customerName) {
    message += `*Cliente:* ${customerName}\n`;
  }

  // Tipo de entrega
  const isDelivery = deliveryType === "delivery";
  message += `*Tipo de entrega:* ${
    isDelivery ? "Envío a domicilio" : "Retiro en local"
  }\n`;

  if (isDelivery && deliveryAddress) {
    message += `*Dirección:* ${deliveryAddress}\n`;
  }

  message += "\n*Detalle del pedido:*\n";
  message += "───────────────────\n";

  cartItems.forEach((item, index) => {
    const subtotal = item.precio * item.quantity;
    const unidadText = item.unidad === "docena" ? "docena(s)" : "unidad(es)";

    message += `\n${index + 1}. *${item.nombre}*\n`;
    message += `   • Cantidad: ${item.quantity} ${unidadText}\n`;
    message += `   • Precio unitario: ${formatPrice(item.precio)}\n`;
    message += `   • Subtotal: ${formatPrice(subtotal)}\n`;
    
    // Indicar si el item tiene oferta aplicada
    if (item.enOferta && item.precioOriginal) {
      message += `   ⭐ *OFERTA* - Precio original: ${formatPrice(item.precioOriginal)}\n`;
    }

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

  message += "\n───────────────────\n";
  
  // Si hay descuento, mostrar desglose detallado
  if (totalDiscount > 0 && totalWithoutDiscount > 0) {
    message += `Subtotal: ${formatPrice(totalWithoutDiscount)}\n\n`;
    
    // Detalle de ofertas aplicadas
    if (itemsWithOffer && itemsWithOffer.length > 0) {
      message += `*🏷️ OFERTAS APLICADAS:*\n`;
      itemsWithOffer.forEach(item => {
        const discountPerUnit = item.precioOriginal - item.precio;
        message += `   • ${item.nombre}`;
        if (item.quantity > 1) {
          message += ` x${item.quantity}`;
        }
        message += `\n     Ahorro: ${formatPrice(discountPerUnit)} c/u = -${formatPrice(item.discount || discountPerUnit * item.quantity)}\n`;
      });
      message += `\n`;
    }
    
    message += `*Total descuento: -${formatPrice(totalDiscount)}*\n`;
    message += `───────────────────\n`;
  }
  
  message += `*TOTAL A PAGAR: ${formatPrice(total)}*\n\n`;

  // Método de pago
  const paymentMethodText =
    paymentMethod === "transfer" ? "Transferencia bancaria" : "Efectivo";
  message += `*Método de pago:* ${paymentMethodText}\n\n`;

  message += "*Información de entrega:*\n";
  message += `• Horario solicitado: ${deliveryTime}\n`;
  message += `• Horario estimado: ${estimatedTime}\n\n`;

  message += "───────────────────\n";
  message += "Gracias por su pedido.\n";
  message += "Nos pondremos en contacto para confirmar.";

  return encodeURIComponent(message);
};

/**
 * Calcula el horario estimado de entrega basado en el tiempo de preparación configurado
 * @param {string} selectedTime - Horario seleccionado (HH:mm)
 * @param {number} preparationTime - Tiempo de preparación en minutos (default: 30)
 * @returns {string} Horario estimado (HH:mm)
 */
export const calculateEstimatedTime = (selectedTime, preparationTime = 30) => {
  if (!selectedTime) return "";

  const [hours, minutes] = selectedTime.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes + preparationTime);

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
