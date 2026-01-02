import { useState, useEffect } from "react";
import { Clock, Pizza, Beef, CircleDot, Calendar, Info } from "lucide-react";
import {
  DAYS_LABELS,
  DEFAULT_CATEGORY_SCHEDULES,
  formatScheduleDisplay,
} from "../../shared/constants/schedules";

/**
 * Componente para configurar los horarios por categoría
 * Permite al administrador definir días y horarios de disponibilidad
 */
const ScheduleConfigManager = ({ schedules, onChange, disabled = false }) => {
  const [categorySchedules, setCategorySchedules] = useState(
    schedules || DEFAULT_CATEGORY_SCHEDULES
  );

  useEffect(() => {
    if (schedules) {
      setCategorySchedules(schedules);
    }
  }, [schedules]);

  const handleScheduleChange = (category, field, value) => {
    const updated = {
      ...categorySchedules,
      [category]: {
        ...categorySchedules[category],
        [field]: value,
      },
    };
    setCategorySchedules(updated);
    onChange?.(updated);
  };

  const toggleDay = (category, day) => {
    const currentDays = categorySchedules[category]?.dias || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    handleScheduleChange(category, "dias", newDays);
  };

  const toggleEnabled = (category) => {
    handleScheduleChange(
      category,
      "habilitado",
      !categorySchedules[category]?.habilitado
    );
  };

  const categoryConfig = [
    {
      key: "hamburguesas",
      name: "Hamburguesas",
      icon: Beef,
      color: "amber",
      description: "Disponible fines de semana",
    },
    {
      key: "empanadas",
      name: "Empanadas",
      icon: CircleDot,
      color: "orange",
      description: "Disponible días de semana",
    },
    {
      key: "pizzas",
      name: "Pizzas",
      icon: Pizza,
      color: "red",
      description: "Disponible días de semana",
    },
  ];

  const diasSemana = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];

  return (
    <div className="space-y-6">
      {/* Header informativo */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">Horarios por Categoría</p>
          <p className="text-blue-600">
            Configura los días y horarios de disponibilidad para cada tipo de
            producto. Los clientes solo podrán realizar pedidos durante los
            horarios habilitados.
          </p>
        </div>
      </div>

      {/* Tarjetas de configuración por categoría */}
      {categoryConfig.map(({ key, name, icon: Icon, color, description }) => {
        const schedule = categorySchedules[key] || {};
        const isEnabled = schedule.habilitado !== false;

        return (
          <div
            key={key}
            className={`bg-white rounded-2xl border-2 transition-all duration-200 ${
              isEnabled
                ? "border-neutral-200 shadow-sm"
                : "border-neutral-100 opacity-60"
            }`}
          >
            {/* Header de la categoría */}
            <div className="p-5 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      color === "amber"
                        ? "bg-amber-100"
                        : color === "orange"
                        ? "bg-orange-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        color === "amber"
                          ? "text-amber-600"
                          : color === "orange"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800">{name}</h4>
                    <p className="text-sm text-neutral-500">{description}</p>
                  </div>
                </div>

                {/* Toggle habilitado */}
                <button
                  type="button"
                  onClick={() => toggleEnabled(key)}
                  disabled={disabled}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    isEnabled ? "bg-primary-500" : "bg-neutral-300"
                  } ${
                    disabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                      isEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Contenido de configuración */}
            {isEnabled && (
              <div className="p-5 space-y-5">
                {/* Días de la semana */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
                    <Calendar className="w-4 h-4" />
                    Días disponibles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {diasSemana.map((dia) => {
                      const isSelected = schedule.dias?.includes(dia);
                      return (
                        <button
                          key={dia}
                          type="button"
                          onClick={() => toggleDay(key, dia)}
                          disabled={disabled}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                            isSelected
                              ? "bg-primary-500 text-white border-primary-500"
                              : "bg-white text-neutral-600 border-neutral-200 hover:border-primary-400"
                          } ${
                            disabled
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          }`}
                        >
                          <span className="hidden sm:inline">
                            {DAYS_LABELS[dia]?.full}
                          </span>
                          <span className="sm:hidden">
                            {DAYS_LABELS[dia]?.short}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Horarios */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                      <Clock className="w-4 h-4" />
                      Inicio de pedidos
                    </label>
                    <input
                      type="time"
                      value={schedule.horario_pedidos_inicio || "19:00"}
                      onChange={(e) =>
                        handleScheduleChange(
                          key,
                          "horario_pedidos_inicio",
                          e.target.value
                        )
                      }
                      disabled={disabled}
                      className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                      <Clock className="w-4 h-4" />
                      Fin de pedidos
                    </label>
                    <input
                      type="time"
                      value={schedule.horario_pedidos_fin || "21:00"}
                      onChange={(e) =>
                        handleScheduleChange(
                          key,
                          "horario_pedidos_fin",
                          e.target.value
                        )
                      }
                      disabled={disabled}
                      className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                      <Clock className="w-4 h-4" />
                      Entregas hasta
                    </label>
                    <input
                      type="time"
                      value={schedule.horario_entrega_fin || "23:00"}
                      onChange={(e) =>
                        handleScheduleChange(
                          key,
                          "horario_entrega_fin",
                          e.target.value
                        )
                      }
                      disabled={disabled}
                      className="w-full px-4 py-2.5 border-2 border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Resumen del horario */}
                <div className="bg-neutral-50 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-200 rounded-lg flex items-center justify-center">
                    <Info className="w-4 h-4 text-neutral-500" />
                  </div>
                  <p className="text-sm text-neutral-600">
                    <span className="font-medium">{name}:</span>{" "}
                    {formatScheduleDisplay(schedule)}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleConfigManager;
