/**
 * Constantes de horarios del negocio
 *
 * Sistema de doble turno:
 * - Cada categoría puede tener hasta 2 turnos configurables
 * - Turno 1: Por ejemplo 09:00 a 13:00 (mediodía)
 * - Turno 2: Por ejemplo 18:00 a 21:00 (noche)
 * - Cada turno puede activarse/desactivarse independientemente
 *
 * Reglas de disponibilidad:
 * - Empanadas y Pizzas: Doble turno configurable
 * - Hamburguesas: Viernes, Sábado y Domingo (generalmente solo turno noche)
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

/**
 * Estructura de turno individual
 */
export const DEFAULT_SHIFT = {
  habilitado: false,
  inicio: "09:00",
  fin: "13:00",
  entrega_fin: "13:30",
};

/**
 * Configuración por defecto de horarios por categoría con sistema de doble turno
 */
export const DEFAULT_CATEGORY_SCHEDULES = {
  // Empanadas - Lunes a Viernes con doble turno
  empanadas: {
    dias: ["lunes", "martes", "miércoles", "jueves", "viernes"],
    habilitado: true,
    turnos: {
      turno1: {
        habilitado: true,
        nombre: "Mediodía",
        inicio: "11:00",
        fin: "13:30",
        entrega_fin: "14:00",
      },
      turno2: {
        habilitado: true,
        nombre: "Noche",
        inicio: "19:00",
        fin: "22:00",
        entrega_fin: "22:30",
      },
    },
    // Campos legacy para compatibilidad
    horario_pedidos_inicio: "11:00",
    horario_pedidos_fin: "22:00",
    horario_entrega_fin: "22:30",
  },
  // Pizzas - Lunes a Viernes con doble turno
  pizzas: {
    dias: ["lunes", "martes", "miércoles", "jueves", "viernes"],
    habilitado: true,
    turnos: {
      turno1: {
        habilitado: true,
        nombre: "Mediodía",
        inicio: "11:00",
        fin: "13:30",
        entrega_fin: "14:00",
      },
      turno2: {
        habilitado: true,
        nombre: "Noche",
        inicio: "19:00",
        fin: "22:00",
        entrega_fin: "22:30",
      },
    },
    // Campos legacy para compatibilidad
    horario_pedidos_inicio: "11:00",
    horario_pedidos_fin: "22:00",
    horario_entrega_fin: "22:30",
  },
  // Hamburguesas - Viernes, Sábado y Domingo (generalmente solo noche)
  hamburguesas: {
    dias: ["viernes", "sábado", "domingo"],
    habilitado: true,
    turnos: {
      turno1: {
        habilitado: false,
        nombre: "Mediodía",
        inicio: "11:00",
        fin: "14:00",
        entrega_fin: "14:30",
      },
      turno2: {
        habilitado: true,
        nombre: "Noche",
        inicio: "19:00",
        fin: "21:00",
        entrega_fin: "23:00",
      },
    },
    // Campos legacy para compatibilidad
    horario_pedidos_inicio: "19:00",
    horario_pedidos_fin: "21:00",
    horario_entrega_fin: "23:00",
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
    habilitado: true,
    turnos: {
      turno1: {
        habilitado: true,
        nombre: "Mediodía",
        inicio: "11:00",
        fin: "14:00",
        entrega_fin: "14:30",
      },
      turno2: {
        habilitado: true,
        nombre: "Noche",
        inicio: "19:00",
        fin: "22:00",
        entrega_fin: "23:00",
      },
    },
    horario_pedidos_inicio: "11:00",
    horario_pedidos_fin: "22:00",
    horario_entrega_fin: "23:00",
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
    habilitado: true,
    turnos: {
      turno1: {
        habilitado: true,
        nombre: "Mediodía",
        inicio: "11:00",
        fin: "14:00",
        entrega_fin: "14:30",
      },
      turno2: {
        habilitado: true,
        nombre: "Noche",
        inicio: "19:00",
        fin: "22:00",
        entrega_fin: "23:00",
      },
    },
    horario_pedidos_inicio: "11:00",
    horario_pedidos_fin: "22:00",
    horario_entrega_fin: "23:00",
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
      "Las empanadas están disponibles de Lunes a Viernes de 11:00 a 13:30 y de 19:00 a 22:00 hs.",
    deliveryInfo: "Pedidos en horarios de turno activo.",
  },
  pizzas: {
    unavailable:
      "Las pizzas están disponibles de Lunes a Viernes de 11:00 a 13:30 y de 19:00 a 22:00 hs.",
    deliveryInfo: "Pedidos en horarios de turno activo.",
  },
};

/**
 * Formatea el horario para mostrar al usuario (soporta doble turno)
 */
export const formatScheduleDisplay = (schedule) => {
  if (!schedule) return "";

  const dias = schedule.dias || [];
  const turnos = schedule.turnos;

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

  // Formatear turnos activos
  const formatShifts = () => {
    if (!turnos) {
      // Compatibilidad con formato antiguo
      const inicio = schedule.horario_pedidos_inicio || "19:00";
      const fin = schedule.horario_pedidos_fin || "22:00";
      return `${inicio} a ${fin} hs`;
    }

    const activeShifts = [];
    if (turnos.turno1?.habilitado) {
      activeShifts.push(`${turnos.turno1.inicio} a ${turnos.turno1.fin}`);
    }
    if (turnos.turno2?.habilitado) {
      activeShifts.push(`${turnos.turno2.inicio} a ${turnos.turno2.fin}`);
    }

    if (activeShifts.length === 0) return "Sin horarios activos";
    if (activeShifts.length === 1) return `${activeShifts[0]} hs`;
    return `${activeShifts[0]} y ${activeShifts[1]} hs`;
  };

  return `${formatDays(dias)} - ${formatShifts()}`;
};

/**
 * Obtiene los turnos activos de una categoría
 */
export const getActiveShifts = (schedule) => {
  if (!schedule || !schedule.turnos) return [];

  const active = [];
  if (schedule.turnos.turno1?.habilitado) {
    active.push({ ...schedule.turnos.turno1, key: "turno1" });
  }
  if (schedule.turnos.turno2?.habilitado) {
    active.push({ ...schedule.turnos.turno2, key: "turno2" });
  }
  return active;
};

/**
 * Verifica si la hora actual está dentro de algún turno activo
 */
export const isTimeInActiveShift = (schedule, currentTime) => {
  if (!schedule || !schedule.habilitado) return false;

  const turnos = schedule.turnos;
  if (!turnos) {
    // Compatibilidad con formato antiguo
    const inicio = schedule.horario_pedidos_inicio || "19:00";
    const fin = schedule.horario_pedidos_fin || "22:00";
    return currentTime >= inicio && currentTime <= fin;
  }

  // Verificar turno 1
  if (turnos.turno1?.habilitado) {
    if (
      currentTime >= turnos.turno1.inicio &&
      currentTime <= turnos.turno1.fin
    ) {
      return true;
    }
  }

  // Verificar turno 2
  if (turnos.turno2?.habilitado) {
    if (
      currentTime >= turnos.turno2.inicio &&
      currentTime <= turnos.turno2.fin
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Obtiene el próximo turno disponible
 */
export const getNextAvailableShift = (schedule, currentTime) => {
  if (!schedule || !schedule.habilitado || !schedule.turnos) return null;

  const { turno1, turno2 } = schedule.turnos;

  // Si estamos antes del turno 1 y está habilitado
  if (turno1?.habilitado && currentTime < turno1.inicio) {
    return { ...turno1, key: "turno1" };
  }

  // Si estamos entre turnos y turno 2 está habilitado
  if (turno2?.habilitado && currentTime < turno2.inicio) {
    return { ...turno2, key: "turno2" };
  }

  // Si pasaron ambos turnos, el próximo será turno 1 del día siguiente
  if (turno1?.habilitado) {
    return { ...turno1, key: "turno1", nextDay: true };
  }

  if (turno2?.habilitado) {
    return { ...turno2, key: "turno2", nextDay: true };
  }

  return null;
};
