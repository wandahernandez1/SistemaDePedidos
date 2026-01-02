import {
  X,
  Clock,
  Calendar,
  AlertCircle,
  Beef,
  Pizza,
  CircleDot,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

/**
 * Modal que muestra cuando una categoría no está disponible
 * Informa al usuario sobre los horarios de disponibilidad usando datos en tiempo real
 */
const ScheduleNotificationModal = ({
  isOpen,
  onClose,
  category,
  unavailabilityInfo = null,
  availableCategories = [],
  allSchedules = {},
  isRealTimeActive = false,
}) => {
  if (!isOpen) return null;

  const categoryIcons = {
    hamburguesas: Beef,
    empanadas: CircleDot,
    pizzas: Pizza,
  };

  const categoryColors = {
    hamburguesas: {
      bg: "bg-amber-50",
      icon: "text-amber-500",
      border: "border-amber-200",
      accent: "bg-amber-100",
    },
    empanadas: {
      bg: "bg-orange-50",
      icon: "text-orange-500",
      border: "border-orange-200",
      accent: "bg-orange-100",
    },
    pizzas: {
      bg: "bg-red-50",
      icon: "text-red-500",
      border: "border-red-200",
      accent: "bg-red-100",
    },
  };

  const categoryNames = {
    hamburguesas: "Hamburguesas",
    empanadas: "Empanadas",
    pizzas: "Pizzas",
  };

  // Extraer información de unavailabilityInfo o usar valores por defecto
  const schedule = unavailabilityInfo?.schedule || allSchedules[category];
  const currentDay =
    unavailabilityInfo?.currentDay ||
    new Date().toLocaleDateString("es-AR", { weekday: "long" });
  const currentTime =
    unavailabilityInfo?.currentTime ||
    new Date().toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const isWrongDay = unavailabilityInfo?.isWrongDay || false;
  const isWrongTime = unavailabilityInfo?.isWrongTime || false;

  const Icon = categoryIcons[category] || AlertCircle;
  const colors = categoryColors[category] || {
    bg: "bg-secondary-50",
    icon: "text-secondary-500",
    border: "border-secondary-200",
    accent: "bg-secondary-100",
  };
  const categoryName = categoryNames[category] || category;

  // Formatear los días disponibles
  const formatAvailableDays = (days) => {
    if (!days || days.length === 0) return "No disponible";

    const weekdays = ["lunes", "martes", "miércoles", "jueves", "viernes"];
    const isWeekdays =
      weekdays.every((d) => days.includes(d)) && days.length === 5;
    const isFriToSun =
      ["viernes", "sábado", "domingo"].every((d) => days.includes(d)) &&
      days.length === 3;

    if (isWeekdays) return "Lunes a Viernes";
    if (isFriToSun) return "Viernes, Sábados y Domingos";

    return days.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(", ");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-secondary-900 rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header con icono */}
        <div
          className={`${colors.bg} dark:bg-secondary-800 p-6 text-center relative`}
        >
          <div
            className={`w-16 h-16 ${colors.accent} dark:bg-secondary-700 rounded-full mx-auto flex items-center justify-center mb-4`}
          >
            <Icon className={`w-8 h-8 ${colors.icon}`} />
          </div>
          <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-100">
            {categoryName} no disponible
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            {isWrongDay
              ? `Esta sección no está disponible los ${currentDay}s`
              : "Fuera del horario de pedidos"}
          </p>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Información del horario */}
          <div
            className={`${colors.bg} dark:bg-secondary-800 rounded-xl p-4 border ${colors.border} dark:border-secondary-700`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar className={`w-5 h-5 ${colors.icon}`} />
              <span className="font-medium text-secondary-700 dark:text-secondary-200">
                Disponibilidad de {categoryName}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-300">
                <span className="font-medium">Días:</span>
                <span>{formatAvailableDays(schedule?.dias)}</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-300">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Horario de pedidos:</span>
                <span>
                  {schedule?.horario_pedidos_inicio || "19:00"} a{" "}
                  {schedule?.horario_pedidos_fin || "21:00"} hs
                </span>
              </div>
              {schedule?.horario_entrega_fin && (
                <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-300">
                  <span className="font-medium">Entregas hasta:</span>
                  <span>{schedule.horario_entrega_fin} hs</span>
                </div>
              )}
            </div>
          </div>

          {/* Mensaje de alternativa - muestra categorías disponibles ahora */}
          {availableCategories.length > 0 ? (
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div className="text-sm text-green-700 dark:text-green-300">
                <p className="font-medium mb-2">
                  ¡Estas opciones están disponibles ahora!
                </p>
                <div className="space-y-1">
                  {availableCategories
                    .filter(
                      (cat) =>
                        cat !== category &&
                        ["hamburguesas", "empanadas", "pizzas"].includes(cat)
                    )
                    .map((cat) => {
                      const catSchedule = allSchedules[cat];
                      const CatIcon = categoryIcons[cat];
                      return (
                        <div key={cat} className="flex items-center gap-2">
                          {CatIcon && <CatIcon className="w-4 h-4" />}
                          <span className="font-medium">
                            {categoryNames[cat]}:
                          </span>
                          <span>
                            {catSchedule?.horario_pedidos_inicio || "19:00"} a{" "}
                            {catSchedule?.horario_pedidos_fin || "22:00"} hs
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium mb-1">
                  La cocina está cerrada en este momento
                </p>
                <p>
                  Consultá los horarios de cada categoría para saber cuándo
                  podés hacer tu pedido.
                </p>
              </div>
            </div>
          )}

          {/* Hora actual y estado de actualización */}
          <div className="flex items-center justify-center gap-4 text-xs text-secondary-400 dark:text-secondary-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Hora actual: {currentTime}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {currentDay.charAt(0).toUpperCase() + currentDay.slice(1)}
              </span>
            </div>
            {isRealTimeActive && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1 text-green-500">
                  <RefreshCw className="w-3 h-3" />
                  <span>Actualizado automáticamente</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Entendido
          </button>
        </div>

        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-secondary-700/80 hover:bg-white dark:hover:bg-secondary-600 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-secondary-500 dark:text-secondary-400" />
        </button>
      </div>
    </div>
  );
};

export default ScheduleNotificationModal;
