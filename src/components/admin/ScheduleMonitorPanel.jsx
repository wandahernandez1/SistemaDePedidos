import { useState } from "react";
import { Clock, Calendar, Settings, Eye, RefreshCw } from "lucide-react";
import { useRealTimeSchedules } from "../../shared/hooks/useRealTimeSchedules";
import RealTimeScheduleStatus from "../RealTimeScheduleStatus";

/**
 * Panel de administración para monitorear los horarios en tiempo real
 * Muestra cómo se ven los horarios desde la perspectiva del usuario
 */
const ScheduleMonitorPanel = () => {
  const [viewMode, setViewMode] = useState("admin"); // "admin" o "customer"

  const {
    schedules,
    config,
    loading,
    error,
    currentDay,
    currentTimeString,
    getMainCategoriesAvailable,
    hasAvailableMainCategories,
    isRealTimeActive,
    refreshConfig,
  } = useRealTimeSchedules();

  const availableCategories = getMainCategoriesAvailable();

  return (
    <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                Monitor de Horarios en Tiempo Real
              </h3>
              <p className="text-blue-100 text-sm">
                Vista actual del usuario •{" "}
                {currentDay.charAt(0).toUpperCase() + currentDay.slice(1)} •{" "}
                {currentTimeString}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isRealTimeActive && (
              <div className="flex items-center gap-2 bg-blue-600 rounded-lg px-3 py-2">
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Conectado</span>
              </div>
            )}
            <button
              onClick={refreshConfig}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg px-3 py-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Actualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controles de vista */}
      <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Modo de vista:
          </span>
          <div className="flex bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("admin")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === "admin"
                  ? "bg-white dark:bg-secondary-700 text-primary-600 shadow-sm"
                  : "text-secondary-600 dark:text-secondary-400"
              }`}
            >
              <Settings className="w-4 h-4 inline mr-1" />
              Admin
            </button>
            <button
              onClick={() => setViewMode("customer")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === "customer"
                  ? "bg-white dark:bg-secondary-700 text-primary-600 shadow-sm"
                  : "text-secondary-600 dark:text-secondary-400"
              }`}
            >
              <Eye className="w-4 h-4 inline mr-1" />
              Vista Usuario
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-primary-500" />
              <span className="text-secondary-600 dark:text-secondary-400">
                Cargando configuración...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-300 font-medium">
              Error al cargar horarios
            </p>
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {error.message || "No se pudo conectar con la base de datos"}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Vista Admin */}
            {viewMode === "admin" && (
              <div className="space-y-6">
                {/* Estado general */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-secondary-800 dark:text-secondary-200">
                        Conexión
                      </span>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        isRealTimeActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isRealTimeActive ? "En vivo" : "Desconectado"}
                    </p>
                  </div>

                  <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-secondary-800 dark:text-secondary-200">
                        Categorías abiertas
                      </span>
                    </div>
                    <p className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
                      {availableCategories.length} de 3
                    </p>
                  </div>

                  <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          hasAvailableMainCategories()
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span className="font-medium text-secondary-800 dark:text-secondary-200">
                        Estado cocina
                      </span>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        hasAvailableMainCategories()
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {hasAvailableMainCategories() ? "Abierta" : "Cerrada"}
                    </p>
                  </div>
                </div>

                {/* Detalles de configuración */}
                <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4">
                  <h4 className="font-medium text-secondary-800 dark:text-secondary-200 mb-3">
                    Configuración Activa
                  </h4>
                  <pre className="text-xs text-secondary-600 dark:text-secondary-400 bg-white dark:bg-secondary-900 rounded border p-3 overflow-x-auto">
                    {JSON.stringify(schedules, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Vista Usuario */}
            {viewMode === "customer" && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    <Eye className="w-4 h-4 inline mr-1" />
                    Esta es la vista que ven los usuarios en tiempo real
                  </p>
                </div>

                {/* Componente tal como lo ve el usuario */}
                <RealTimeScheduleStatus compact={false} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ScheduleMonitorPanel;
