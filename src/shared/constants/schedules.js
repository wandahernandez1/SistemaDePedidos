/**
 * Constantes de horarios del negocio
 *
 * Reglas de disponibilidad:
 * - Empanadas y Pizzas: Lunes a Viernes, 19:00 a 22:00
 * - Hamburguesas: Viernes, Sábado y Domingo, pedidos de 19:00 a 21:00, entregas hasta 23:00
 */

// Días de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
export const DAYS_MAP = {
  0: "domingo",
  1: "lunes",
  2: "martes",
  3: "miércoles",
  4: "jueves",
  5: "viernes",
  6: "sábado",
};

export const DAYS_LABELS = {
  domingo: { short: "Dom", full: "Domingo" },
  lunes: { short: "Lun", full: "Lunes" },
  martes: { short: "Mar", full: "Martes" },
  miércoles: { short: "Mié", full: "Miércoles" },
  jueves: { short: "Jue", full: "Jueves" },
  viernes: { short: "Vie", full: "Viernes" },
  sábado: { short: "Sáb", full: "Sábado" },
};

// Configuración por defecto de horarios por categoría
export const DEFAULT_CATEGORY_SCHEDULES = {
  // Empanadas y Pizzas - Lunes a Viernes
  empanadas: {
    dias: ["lunes", "martes", "miércoles", "jueves", "viernes"],
    horario_pedidos_inicio: "19:00",
    horario_pedidos_fin: "22:00",
    horario_entrega_fin: "22:30",
    habilitado: true,
  },
  pizzas: {
    dias: ["lunes", "martes", "miércoles", "jueves", "viernes"],
    horario_pedidos_inicio: "19:00",
    horario_pedidos_fin: "22:00",
    horario_entrega_fin: "22:30",
    habilitado: true,
  },
  // Hamburguesas - Viernes, Sábado y Domingo
  hamburguesas: {
    dias: ["viernes", "sábado", "domingo"],
    horario_pedidos_inicio: "19:00",
    horario_pedidos_fin: "21:00",
    horario_entrega_fin: "23:00",
    habilitado: true,
  },
  // Bebidas - siempre disponibles cuando hay algún servicio activo
  bebidas: {
    dias: [
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
      "domingo",
    ],
    horario_pedidos_inicio: "19:00",
    horario_pedidos_fin: "22:00",
    horario_entrega_fin: "23:00",
    habilitado: true,
  },
  // Postres - mismo horario que bebidas
  postres: {
    dias: [
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
      "domingo",
    ],
    horario_pedidos_inicio: "19:00",
    horario_pedidos_fin: "22:00",
    horario_entrega_fin: "23:00",
    habilitado: true,
  },
};

// Mensajes informativos para el usuario
export const SCHEDULE_MESSAGES = {
  hamburguesas: {
    unavailable:
      "Las hamburguesas están disponibles los Viernes, Sábados y Domingos de 19:00 a 21:00 hs.",
    deliveryInfo: "Pedidos hasta las 21:00 hs. Entregas hasta las 23:00 hs.",
  },
  empanadas: {
    unavailable:
      "Las empanadas están disponibles de Lunes a Viernes de 19:00 a 22:00 hs.",
    deliveryInfo: "Pedidos de 19:00 a 22:00 hs.",
  },
  pizzas: {
    unavailable:
      "Las pizzas están disponibles de Lunes a Viernes de 19:00 a 22:00 hs.",
    deliveryInfo: "Pedidos de 19:00 a 22:00 hs.",
  },
};

/**
 * Formatea el horario para mostrar al usuario
 */
export const formatScheduleDisplay = (schedule) => {
  if (!schedule) return "";

  const dias = schedule.dias || [];
  const inicio = schedule.horario_pedidos_inicio || "19:00";
  const fin = schedule.horario_pedidos_fin || "22:00";

  // Agrupar días consecutivos
  const formatDays = (days) => {
    if (days.length === 0) return "";
    if (days.length === 7) return "Todos los días";

    const weekdays = ["lunes", "martes", "miércoles", "jueves", "viernes"];
    const weekend = ["sábado", "domingo"];

    const isWeekdays =
      weekdays.every((d) => days.includes(d)) &&
      !days.includes("sábado") &&
      !days.includes("domingo");
    const isWeekend =
      weekend.every((d) => days.includes(d)) &&
      !weekdays.some((d) => days.includes(d));
    const isFriToSun =
      ["viernes", "sábado", "domingo"].every((d) => days.includes(d)) &&
      days.length === 3;

    if (isWeekdays) return "Lunes a Viernes";
    if (isWeekend) return "Sábado y Domingo";
    if (isFriToSun) return "Viernes a Domingo";

    return days.map((d) => DAYS_LABELS[d]?.short || d).join(", ");
  };

  return `${formatDays(dias)} de ${inicio} a ${fin} hs`;
};
