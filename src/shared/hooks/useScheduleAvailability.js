import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  DAYS_MAP, 
  DEFAULT_CATEGORY_SCHEDULES,
  isTimeInActiveShift,
  getActiveShifts,
  getNextAvailableShift,
  formatScheduleDisplay
} from "../constants/schedules";

/**
 * Hook para verificar la disponibilidad de categorías según día y hora
 * Soporta sistema de doble turno configurable
 *
 * @param {Object} customSchedules - Horarios personalizados desde la configuración
 * @returns {Object} - Funciones y estados de disponibilidad
 */
export const useScheduleAvailability = (customSchedules = null) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar la hora cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  // Usar horarios personalizados o los por defecto
  const schedules = useMemo(() => {
    return customSchedules || DEFAULT_CATEGORY_SCHEDULES;
  }, [customSchedules]);

  /**
   * Obtener el día actual en formato texto
   */
  const getCurrentDay = useCallback(() => {
    const dayNumber = currentTime.getDay();
    return DAYS_MAP[dayNumber];
  }, [currentTime]);

  /**
   * Obtener la hora actual en formato HH:MM
   */
  const getCurrentTimeString = useCallback(() => {
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }, [currentTime]);

  /**
   * Comparar dos strings de hora (HH:MM)
   * @returns -1 si time1 < time2, 0 si iguales, 1 si time1 > time2
   */
  const compareTime = useCallback((time1, time2) => {
    const [h1, m1] = time1.split(":").map(Number);
    const [h2, m2] = time2.split(":").map(Number);

    const minutes1 = h1 * 60 + m1;
    const minutes2 = h2 * 60 + m2;

    if (minutes1 < minutes2) return -1;
    if (minutes1 > minutes2) return 1;
    return 0;
  }, []);

  /**
   * Verificar si una categoría está disponible ahora (soporta doble turno)
   */
  const isCategoryAvailableNow = useCallback(
    (category) => {
      const schedule = schedules[category];
      if (!schedule || !schedule.habilitado) return false;

      const currentDay = getCurrentDay();
      const currentTimeStr = getCurrentTimeString();

      // Verificar si el día actual está en los días habilitados
      if (!schedule.dias.includes(currentDay)) return false;

      // Verificar si estamos dentro de algún turno activo
      return isTimeInActiveShift(schedule, currentTimeStr);
    },
    [schedules, getCurrentDay, getCurrentTimeString]
  );

  /**
   * Verificar si una categoría está disponible en un día específico
   */
  const isCategoryAvailableOnDay = useCallback(
    (category, day) => {
      const schedule = schedules[category];
      if (!schedule || !schedule.habilitado) return false;
      return schedule.dias.includes(day);
    },
    [schedules]
  );

  /**
   * Obtener información del horario de una categoría
   */
  const getCategorySchedule = useCallback(
    (category) => {
      return schedules[category] || null;
    },
    [schedules]
  );

  /**
   * Obtener el turno actual activo de una categoría
   */
  const getCurrentActiveShift = useCallback(
    (category) => {
      const schedule = schedules[category];
      if (!schedule || !schedule.habilitado) return null;

      const currentDay = getCurrentDay();
      const currentTimeStr = getCurrentTimeString();

      if (!schedule.dias.includes(currentDay)) return null;

      const turnos = schedule.turnos;
      if (!turnos) return null;

      // Verificar turno 1
      if (turnos.turno1?.habilitado) {
        if (currentTimeStr >= turnos.turno1.inicio && currentTimeStr <= turnos.turno1.fin) {
          return { ...turnos.turno1, key: "turno1" };
        }
      }

      // Verificar turno 2
      if (turnos.turno2?.habilitado) {
        if (currentTimeStr >= turnos.turno2.inicio && currentTimeStr <= turnos.turno2.fin) {
          return { ...turnos.turno2, key: "turno2" };
        }
      }

      return null;
    },
    [schedules, getCurrentDay, getCurrentTimeString]
  );

  /**
   * Obtener mensaje de no disponibilidad para una categoría (con info de turnos)
   */
  const getUnavailableMessage = useCallback(
    (category) => {
      const schedule = schedules[category];
      if (!schedule) return "Esta categoría no está disponible.";

      const days = schedule.dias || [];
      const turnos = schedule.turnos;

      // Formatear días
      const formatDays = (d) => {
        if (d.length === 7) return "todos los días";

        const weekdays = ["lunes", "martes", "miércoles", "jueves", "viernes"];
        const isWeekdays =
          weekdays.every((day) => d.includes(day)) && d.length === 5;
        const isFriToSun =
          ["viernes", "sábado", "domingo"].every((day) => d.includes(day)) &&
          d.length === 3;

        if (isWeekdays) return "Lunes a Viernes";
        if (isFriToSun) return "Viernes, Sábados y Domingos";

        return d
          .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
          .join(", ");
      };

      // Formatear turnos
      const formatTurnos = () => {
        if (!turnos) {
          const inicio = schedule.horario_pedidos_inicio || "19:00";
          const fin = schedule.horario_pedidos_fin || "22:00";
          return `de ${inicio} a ${fin} hs`;
        }

        const activeShifts = [];
        if (turnos.turno1?.habilitado) {
          activeShifts.push(`${turnos.turno1.inicio} a ${turnos.turno1.fin}`);
        }
        if (turnos.turno2?.habilitado) {
          activeShifts.push(`${turnos.turno2.inicio} a ${turnos.turno2.fin}`);
        }

        if (activeShifts.length === 0) return "";
        if (activeShifts.length === 1) return `de ${activeShifts[0]} hs`;
        return `de ${activeShifts[0]} y de ${activeShifts[1]} hs`;
      };

      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      return `${categoryName} están disponibles los ${formatDays(days)} ${formatTurnos()}.`;
    },
    [schedules]
  );

  /**
   * Obtener todas las categorías disponibles ahora
   */
  const getAvailableCategoriesNow = useCallback(() => {
    return Object.keys(schedules).filter((category) =>
      isCategoryAvailableNow(category)
    );
  }, [schedules, isCategoryAvailableNow]);

  /**
   * Verificar si el negocio está abierto (alguna categoría disponible)
   */
  const isBusinessOpen = useCallback(() => {
    return getAvailableCategoriesNow().length > 0;
  }, [getAvailableCategoriesNow]);

  /**
   * Obtener los turnos activos para el carrito (basado en categorías)
   */
  const getAvailableTimeSlots = useCallback(
    (categories = []) => {
      const currentTimeStr = getCurrentTimeString();
      const slots = [];

      // Si no hay categorías específicas, usar todas
      const targetCategories = categories.length > 0 
        ? categories 
        : Object.keys(schedules).filter(cat => !["bebidas", "postres"].includes(cat));

      // Encontrar la intersección de turnos disponibles
      let commonSlots = null;

      targetCategories.forEach((category) => {
        const schedule = schedules[category];
        if (!schedule || !schedule.habilitado) return;

        const activeShifts = getActiveShifts(schedule);
        const categorySlots = [];

        activeShifts.forEach((shift) => {
          // Solo incluir si el turno aún no ha terminado
          if (shift.fin > currentTimeStr || shift.inicio > currentTimeStr) {
            categorySlots.push({
              inicio: shift.inicio > currentTimeStr ? shift.inicio : currentTimeStr,
              fin: shift.fin,
              entrega_fin: shift.entrega_fin,
              nombre: shift.nombre,
            });
          }
        });

        if (commonSlots === null) {
          commonSlots = categorySlots;
        } else {
          // Intersección: solo mantener slots que estén en ambos
          commonSlots = commonSlots.filter((slot) =>
            categorySlots.some(
              (cs) => cs.inicio <= slot.fin && cs.fin >= slot.inicio
            )
          );
        }
      });

      return commonSlots || [];
    },
    [schedules, getCurrentTimeString]
  );

  return {
    currentTime,
    currentDay: getCurrentDay(),
    currentTimeString: getCurrentTimeString(),
    schedules,
    isCategoryAvailableNow,
    isCategoryAvailableOnDay,
    getCategorySchedule,
    getCurrentActiveShift,
    getUnavailableMessage,
    getAvailableCategoriesNow,
    isBusinessOpen,
    getAvailableTimeSlots,
    // Utilidades
    compareTime,
    formatScheduleDisplay,
  };
};

export default useScheduleAvailability;
