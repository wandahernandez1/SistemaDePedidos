import { useState, useEffect } from "react";
import { Clock, Pizza, Beef, CircleDot, Calendar, Info, Sun, Moon } from "lucide-react";
import {
  DAYS_LABELS,
  DEFAULT_CATEGORY_SCHEDULES,
  formatScheduleDisplay,
} from "../../shared/constants/schedules";

/**
 * Componente para configurar los horarios por categoría
 * Permite al administrador definir días y horarios de disponibilidad
 * Soporta sistema de doble turno (mediodía y noche)
 */
const ScheduleConfigManager = ({ schedules, onChange, disabled = false }) => {
  const [categorySchedules, setCategorySchedules] = useState(
    schedules || DEFAULT_CATEGORY_SCHEDULES
  );

  useEffect(() => {
    if (schedules) {
      // Migrar estructura antigua a nueva si es necesario
      const migrated = migrateSchedules(schedules);
      setCategorySchedules(migrated);
    }
  }, [schedules]);

  /**
   * Migrar estructura antigua (sin turnos) a nueva estructura con doble turno
   */
  const migrateSchedules = (oldSchedules) => {
    const migrated = { ...oldSchedules };
    
    Object.keys(migrated).forEach((category) => {
      const schedule = migrated[category];
      
      // Si no tiene estructura de turnos, migrar
      if (!schedule.turnos) {
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

  const handleShiftChange = (category, shiftKey, field, value) => {
    const schedule = categorySchedules[category];
    const updated = {
      ...categorySchedules,
      [category]: {
        ...schedule,
        turnos: {
          ...schedule.turnos,
          [shiftKey]: {
            ...schedule.turnos[shiftKey],
            [field]: value,
          },
        },
      },
    };
    
    // Actualizar campos legacy para compatibilidad
    const turnos = updated[category].turnos;
    if (turnos.turno1?.habilitado || turnos.turno2?.habilitado) {
      const firstActive = turnos.turno1?.habilitado ? turnos.turno1 : turnos.turno2;
      const lastActive = turnos.turno2?.habilitado ? turnos.turno2 : turnos.turno1;
      
      updated[category].horario_pedidos_inicio = firstActive.inicio;
      updated[category].horario_pedidos_fin = lastActive.fin;
      updated[category].horario_entrega_fin = lastActive.entrega_fin;
    }
    
    setCategorySchedules(updated);
    onChange?.(updated);
  };

  const toggleShift = (category, shiftKey) => {
    const currentValue = categorySchedules[category]?.turnos?.[shiftKey]?.habilitado;
    handleShiftChange(category, shiftKey, "habilitado", !currentValue);
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
      key: "empanadas",
      name: "Empanadas",
      icon: CircleDot,
      color: "orange",
      description: "Disponible con doble turno",
    },
    {
      key: "pizzas",
      name: "Pizzas",
      icon: Pizza,
      color: "red",
      description: "Disponible con doble turno",
    },
    {
      key: "hamburguesas",
      name: "Hamburguesas",
      icon: Beef,
      color: "amber",
      description: "Fines de semana",
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
      <div className="bg-primary-50 dark:bg-primary-950/40 border-2 border-primary-200 dark:border-primary-700 rounded-xl p-4 flex items-start gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center shrink-0">
          <Info className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <p className="font-bold text-primary-800 dark:text-primary-200 mb-1 text-base">Sistema de Doble Turno</p>
          <p className="text-sm text-primary-700 dark:text-primary-300 leading-relaxed">
            Configura hasta 2 turnos por categoría: Mediodía y Noche. 
            Cada turno puede activarse o desactivarse independientemente.
            Los cambios se aplican automáticamente en toda la web.
          </p>
        </div>
      </div>

      {/* Tarjetas de configuración por categoría */}
      {categoryConfig.map(({ key, name, icon: Icon, color, description }) => {
        const schedule = categorySchedules[key] || {};
        const isEnabled = schedule.habilitado !== false;
        const turnos = schedule.turnos || {};

        return (
          <div
            key={key}
            className={`bg-white dark:bg-secondary-900 rounded-2xl border-2 transition-all duration-200 ${
              isEnabled
                ? "border-neutral-200 dark:border-secondary-700 shadow-sm"
                : "border-neutral-100 dark:border-secondary-800 opacity-60"
            }`}
          >
            {/* Header de la categoría */}
            <div className="p-5 border-b border-neutral-100 dark:border-secondary-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      color === "amber"
                        ? "bg-amber-100 dark:bg-amber-950"
                        : color === "orange"
                        ? "bg-orange-100 dark:bg-orange-950"
                        : "bg-red-100 dark:bg-red-950"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        color === "amber"
                          ? "text-amber-600 dark:text-amber-400"
                          : color === "orange"
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800 dark:text-neutral-100">{name}</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
                  </div>
                </div>

                {/* Toggle habilitado */}
                <button
                  type="button"
                  onClick={() => toggleEnabled(key)}
                  disabled={disabled}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    isEnabled ? "bg-primary-500" : "bg-neutral-300 dark:bg-neutral-600"
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
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
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
                              : "bg-white dark:bg-secondary-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-secondary-600 hover:border-primary-400"
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

                {/* Turnos */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    <Clock className="w-4 h-4" />
                    Configuración de Turnos
                  </label>

                  {/* Turno 1 - Mediodía */}
                  <ShiftConfig
                    shift={turnos.turno1}
                    shiftKey="turno1"
                    icon={Sun}
                    iconColor="text-yellow-500"
                    bgColor="bg-yellow-50 dark:bg-yellow-950/30"
                    borderColor="border-yellow-200 dark:border-yellow-800"
                    category={key}
                    disabled={disabled}
                    onToggle={() => toggleShift(key, "turno1")}
                    onChange={(field, value) => handleShiftChange(key, "turno1", field, value)}
                  />

                  {/* Turno 2 - Noche */}
                  <ShiftConfig
                    shift={turnos.turno2}
                    shiftKey="turno2"
                    icon={Moon}
                    iconColor="text-indigo-500"
                    bgColor="bg-indigo-50 dark:bg-indigo-950/30"
                    borderColor="border-indigo-200 dark:border-indigo-800"
                    category={key}
                    disabled={disabled}
                    onToggle={() => toggleShift(key, "turno2")}
                    onChange={(field, value) => handleShiftChange(key, "turno2", field, value)}
                  />
                </div>

                {/* Resumen del horario */}
                <div className="bg-neutral-50 dark:bg-secondary-800 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-200 dark:bg-secondary-700 rounded-lg flex items-center justify-center">
                    <Info className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
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

/**
 * Componente para configurar un turno individual
 */
const ShiftConfig = ({
  shift,
  shiftKey,
  icon: Icon,
  iconColor,
  bgColor,
  borderColor,
  category,
  disabled,
  onToggle,
  onChange,
}) => {
  const isEnabled = shift?.habilitado || false;
  const shiftName = shift?.nombre || (shiftKey === "turno1" ? "Mediodía" : "Noche");

  return (
    <div
      className={`rounded-xl border-2 transition-all duration-200 ${
        isEnabled
          ? `${bgColor} ${borderColor}`
          : "bg-neutral-50 dark:bg-secondary-800 border-neutral-200 dark:border-secondary-700 opacity-70"
      }`}
    >
      {/* Header del turno */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${isEnabled ? iconColor : "text-neutral-400"}`} />
          <div>
            <span className={`font-medium ${isEnabled ? "text-neutral-800 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-400"}`}>
              {shiftName}
            </span>
            {isEnabled && shift && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {shift.inicio} - {shift.fin} hs
              </p>
            )}
          </div>
        </div>

        {/* Toggle turno */}
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            isEnabled ? "bg-primary-500" : "bg-neutral-300 dark:bg-neutral-600"
          } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
              isEnabled ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Configuración de horarios del turno */}
      {isEnabled && (
        <div className="px-4 pb-4 pt-2 border-t border-neutral-200/50 dark:border-secondary-700/50">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Inicio pedidos
              </label>
              <input
                type="time"
                value={shift?.inicio || "09:00"}
                onChange={(e) => onChange("inicio", e.target.value)}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border-2 border-neutral-200 dark:border-secondary-600 rounded-lg text-neutral-800 dark:text-neutral-100 bg-white dark:bg-secondary-800 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Fin pedidos
              </label>
              <input
                type="time"
                value={shift?.fin || "13:00"}
                onChange={(e) => onChange("fin", e.target.value)}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border-2 border-neutral-200 dark:border-secondary-600 rounded-lg text-neutral-800 dark:text-neutral-100 bg-white dark:bg-secondary-800 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                Entregas hasta
              </label>
              <input
                type="time"
                value={shift?.entrega_fin || "13:30"}
                onChange={(e) => onChange("entrega_fin", e.target.value)}
                disabled={disabled}
                className="w-full px-3 py-2 text-sm border-2 border-neutral-200 dark:border-secondary-600 rounded-lg text-neutral-800 dark:text-neutral-100 bg-white dark:bg-secondary-800 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleConfigManager;
