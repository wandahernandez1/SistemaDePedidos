import { useState, useEffect, useCallback, useMemo } from "react";
import { DAYS_MAP, DEFAULT_CATEGORY_SCHEDULES } from "../constants/schedules";

/**
 * Hook para verificar la disponibilidad de categorías según día y hora
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
   * Verificar si una categoría está disponible ahora
   */
  const isCategoryAvailableNow = useCallback(
    (category) => {
      const schedule = schedules[category];
      if (!schedule || !schedule.habilitado) return false;

      const currentDay = getCurrentDay();
      const currentTimeStr = getCurrentTimeString();

      // Debug temporal - remover en producción
      if (category === "hamburguesas") {
        console.log("🍔 Debug Hamburguesas:", {
          category,
          currentDay,
          currentTimeStr,
          scheduleDays: schedule.dias,
          scheduleStart: schedule.horario_pedidos_inicio,
          scheduleEnd: schedule.horario_pedidos_fin,
          dayIncluded: schedule.dias.includes(currentDay),
          timeAfterStart: compareTime(
            currentTimeStr,
            schedule.horario_pedidos_inicio
          ),
          timeBeforeEnd: compareTime(
            currentTimeStr,
            schedule.horario_pedidos_fin
          ),
        });
      }

      // Verificar si el día actual está en los días habilitados
      if (!schedule.dias.includes(currentDay)) return false;

      // Verificar si la hora actual está dentro del rango de pedidos
      const afterStart =
        compareTime(currentTimeStr, schedule.horario_pedidos_inicio) >= 0;
      const beforeEnd =
        compareTime(currentTimeStr, schedule.horario_pedidos_fin) <= 0;

      return afterStart && beforeEnd;
    },
    [schedules, getCurrentDay, getCurrentTimeString, compareTime]
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
   * Obtener mensaje de no disponibilidad para una categoría
   */
  const getUnavailableMessage = useCallback(
    (category) => {
      const schedule = schedules[category];
      if (!schedule) return "Esta categoría no está disponible.";

      const days = schedule.dias || [];
      const inicio = schedule.horario_pedidos_inicio || "19:00";
      const fin = schedule.horario_pedidos_fin || "22:00";

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

      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      return `${categoryName} están disponibles los ${formatDays(
        days
      )} de ${inicio} a ${fin} hs.`;
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

  return {
    currentTime,
    currentDay: getCurrentDay(),
    currentTimeString: getCurrentTimeString(),
    schedules,
    isCategoryAvailableNow,
    isCategoryAvailableOnDay,
    getCategorySchedule,
    getUnavailableMessage,
    getAvailableCategoriesNow,
    isBusinessOpen,
  };
};

export default useScheduleAvailability;
