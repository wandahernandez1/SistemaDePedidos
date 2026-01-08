import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabase/config";
import { getConfig, TABLES } from "../../supabase/supabaseService";
import { DEFAULT_CATEGORY_SCHEDULES } from "../constants/schedules";
import { useScheduleAvailability } from "./useScheduleAvailability";

/**
 * Migra la estructura de horarios antigua a la nueva estructura con doble turno
 * Si ya tiene la estructura nueva, la devuelve sin cambios
 */
const migrateSchedulesToNewFormat = (oldSchedules) => {
  if (!oldSchedules) return DEFAULT_CATEGORY_SCHEDULES;

  const migrated = { ...oldSchedules };

  Object.keys(migrated).forEach((category) => {
    const schedule = migrated[category];

    // Si no tiene estructura de turnos, migrar
    if (schedule && !schedule.turnos) {
      migrated[category] = {
        ...schedule,
        turnos: {
          turno1: {
            habilitado: false,
            nombre: "Mediodía",
            inicio: "11:00",
            fin: "13:30",
            entrega_fin: "14:00",
          },
          turno2: {
            habilitado: true,
            nombre: "Noche",
            inicio: schedule.horario_pedidos_inicio || "19:00",
            fin: schedule.horario_pedidos_fin || "22:00",
            entrega_fin: schedule.horario_entrega_fin || "22:30",
          },
        },
      };
    }
  });

  return migrated;
};

/**
 * Hook que maneja horarios en tiempo real desde Supabase
 * Escucha cambios en la configuración y actualiza la disponibilidad automáticamente
 * Soporta sistema de doble turno con migración automática
 */
export const useRealTimeSchedules = () => {
  const [schedules, setSchedules] = useState(DEFAULT_CATEGORY_SCHEDULES);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar el hook de disponibilidad con los schedules actualizados
  const scheduleAvailability = useScheduleAvailability(schedules);

  /**
   * Cargar configuración inicial de horarios
   */
  const loadInitialConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const configData = await getConfig();

      if (configData) {
        setConfig(configData);

        // Si hay horarios configurados, migrar si es necesario y usarlos
        const schedulesData = configData.horarios_categorias
          ? migrateSchedulesToNewFormat(configData.horarios_categorias)
          : DEFAULT_CATEGORY_SCHEDULES;
        setSchedules(schedulesData);
      } else {
        // Si no hay configuración, usar defaults
        setSchedules(DEFAULT_CATEGORY_SCHEDULES);
      }
    } catch (err) {
      setError(err);
      // En caso de error, usar horarios por defecto
      setSchedules(DEFAULT_CATEGORY_SCHEDULES);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Manejar cambios en la configuración en tiempo real
   */
  const handleConfigChange = useCallback((payload) => {
    if (payload.eventType === "UPDATE" && payload.new) {
      const newConfig = payload.new;
      setConfig(newConfig);

      // Actualizar horarios (migrando si es necesario)
      const newSchedules = newConfig.horarios_categorias
        ? migrateSchedulesToNewFormat(newConfig.horarios_categorias)
        : DEFAULT_CATEGORY_SCHEDULES;
      setSchedules(newSchedules);
    }
  }, []);

  /**
   * Configurar suscripción en tiempo real
   */
  useEffect(() => {
    // Cargar configuración inicial
    loadInitialConfig();

    // Suscribirse a cambios en la configuración
    const subscription = supabase
      .channel("config-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: TABLES.CONFIG,
        },
        handleConfigChange
      )
      .subscribe();

    // Cleanup: cancelar suscripción al desmontar
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [loadInitialConfig, handleConfigChange]);

  /**
   * Funciones adicionales específicas para categorías
   */

  /**
   * Verificar si una categoría específica está disponible ahora
   */
  const isCategoryAvailable = useCallback(
    (category) => {
      return scheduleAvailability.isCategoryAvailableNow(category);
    },
    [scheduleAvailability]
  );

  /**
   * Obtener todas las categorías principales disponibles ahora
   */
  const getMainCategoriesAvailable = useCallback(() => {
    const mainCategories = ["hamburguesas", "empanadas", "pizzas"];
    return mainCategories.filter((category) =>
      scheduleAvailability.isCategoryAvailableNow(category)
    );
  }, [scheduleAvailability]);

  /**
   * Verificar si alguna categoría principal está disponible
   */
  const hasAvailableMainCategories = useCallback(() => {
    return getMainCategoriesAvailable().length > 0;
  }, [getMainCategoriesAvailable]);

  /**
   * Obtener información de una categoría no disponible
   */
  const getUnavailabilityInfo = useCallback(
    (category) => {
      const schedule = schedules[category];
      const currentDay = scheduleAvailability.currentDay;
      const currentTime = scheduleAvailability.currentTimeString;

      if (!schedule) {
        return {
          isWrongDay: true,
          isWrongTime: false,
          message: "Esta categoría no está configurada",
        };
      }

      const isWrongDay = !schedule.dias?.includes(currentDay);
      const isWrongTime =
        !isWrongDay && !scheduleAvailability.isCategoryAvailableNow(category);

      return {
        isWrongDay,
        isWrongTime,
        message: scheduleAvailability.getUnavailableMessage(category),
        schedule,
        currentDay,
        currentTime,
      };
    },
    [schedules, scheduleAvailability]
  );

  /**
   * Recargar configuración manualmente
   */
  const refreshConfig = useCallback(() => {
    loadInitialConfig();
  }, [loadInitialConfig]);

  return {
    // Estados básicos
    schedules,
    config,
    loading,
    error,

    // Funcionalidades de disponibilidad (del hook base)
    ...scheduleAvailability,

    // Funcionalidades específicas para categorías principales
    isCategoryAvailable,
    getMainCategoriesAvailable,
    hasAvailableMainCategories,
    getUnavailabilityInfo,

    // Funciones de control
    refreshConfig,

    // Información de estado
    isRealTimeActive: !loading && !error,
  };
};

export default useRealTimeSchedules;
