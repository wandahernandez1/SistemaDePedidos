import { useState } from "react";
import { Clock, Calendar, ChevronDown, RefreshCw } from "lucide-react";
import { useRealTimeSchedules } from "../shared/hooks/useRealTimeSchedules";

/**
 * Componente que muestra el estado actual de horarios en tiempo real
 * Diseñado para mostrar en el navbar o header
 */
const RealTimeScheduleStatus = ({ compact = true, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    schedules,
    currentDay,
    currentTimeString,
    getMainCategoriesAvailable,
    hasAvailableMainCategories,
    isRealTimeActive,
  } = useRealTimeSchedules();

  const availableCategories = getMainCategoriesAvailable();
  const isBusinessOpen = hasAvailableMainCategories();

  // Información de categorías con iconos
  const categoryInfo = {
    hamburguesas: { name: "Hamburguesas", emoji: "🍔" },
    empanadas: { name: "Empanadas", emoji: "🥟" },
    pizzas: { name: "Pizzas", emoji: "🍕" },
  };

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            {isBusinessOpen ? (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            ) : (
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            )}
            <Clock className="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {isBusinessOpen ? "Abierto" : "Cerrado"}
            </span>
          </div>

          {isRealTimeActive && <RefreshCw className="w-3 h-3 text-green-500" />}

          <ChevronDown
            className={`w-4 h-4 text-secondary-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Panel expandido */}
        {isExpanded && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-secondary-900 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-primary-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Estado de Horarios</h3>
                  <p className="text-primary-100 text-xs mt-1">
                    {currentDay.charAt(0).toUpperCase() + currentDay.slice(1)} •{" "}
                    {currentTimeString}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-4 space-y-3">
              {Object.entries(categoryInfo).map(([key, info]) => {
                const isAvailable = availableCategories.includes(key);
                const schedule = schedules[key];

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isAvailable ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm font-medium text-secondary-800 dark:text-secondary-200">
                        {info.name}
                      </span>
                    </div>
                    <div className="text-xs text-secondary-500 dark:text-secondary-400">
                      {schedule
                        ? `${schedule.horario_pedidos_inicio} - ${schedule.horario_pedidos_fin}`
                        : "No configurado"}
                    </div>
                  </div>
                );
              })}

              {!isBusinessOpen && (
                <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    La cocina está cerrada en este momento
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overlay para cerrar */}
        {isExpanded && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </div>
    );
  }

  // Versión no compacta (para usar en secciones dedicadas)
  return (
    <div
      className={`bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-linear-to-r from-primary-500 to-primary-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Estado en Tiempo Real</h3>
              <p className="text-primary-100 text-sm">
                {currentDay.charAt(0).toUpperCase() + currentDay.slice(1)} •{" "}
                {currentTimeString}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.entries(categoryInfo).map(([key, info]) => {
            const isAvailable = availableCategories.includes(key);
            const schedule = schedules[key];

            return (
              <div
                key={key}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  isAvailable
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                    : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isAvailable ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="font-medium text-secondary-800 dark:text-secondary-200">
                    {info.name}
                  </span>
                </div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  {isAvailable ? "Disponible ahora" : "No disponible"}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
                  {schedule
                    ? `${schedule.horario_pedidos_inicio} - ${schedule.horario_pedidos_fin}`
                    : "No configurado"}
                </p>
              </div>
            );
          })}
        </div>

        {!isBusinessOpen && (
          <div className="mt-4 text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-amber-700 dark:text-amber-300 font-medium">
              La cocina está cerrada en este momento
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Consultá los horarios de cada categoría para planificar tu pedido
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeScheduleStatus;
