import {
  X,
  Clock,
  Calendar,
  AlertCircle,
  Beef,
  Pizza,
  CircleDot,
  ArrowRight,
} from "lucide-react";

/**
 * Modal que muestra cuando una categoría no está disponible
 * Diseño minimalista y profesional con información clara
 */
const ScheduleNotificationModal = ({
  isOpen,
  onClose,
  category,
  unavailabilityInfo = null,
  availableCategories = [],
  allSchedules = {},
}) => {
  if (!isOpen) return null;

  const categoryIcons = {
    hamburguesas: Beef,
    empanadas: CircleDot,
    pizzas: Pizza,
  };

  const categoryNames = {
    hamburguesas: "Hamburguesas",
    empanadas: "Empanadas",
    pizzas: "Pizzas",
  };

  // Extraer información
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

  const Icon = categoryIcons[category] || AlertCircle;
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
    if (isFriToSun) return "Viernes a Domingo";

    return days.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(", ");
  };

  // Filtrar categorías disponibles
  const otherAvailableCategories = availableCategories.filter(
    (cat) =>
      cat !== category &&
      ["hamburguesas", "empanadas", "pizzas"].includes(cat)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors z-10"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Icon & Title */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-full mx-auto flex items-center justify-center mb-4">
              <Icon className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-1">
              {categoryName} no disponible
            </h2>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {isWrongDay
                ? `No disponible los ${currentDay}`
                : "Fuera del horario de pedidos"}
            </p>
          </div>

          {/* Schedule Info */}
          <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-xl p-4 mb-4">
            <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-3">
              Horario de disponibilidad
            </p>
            
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-secondary-400 shrink-0" />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">
                  {formatAvailableDays(schedule?.dias)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-secondary-400 shrink-0" />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">
                  {schedule?.horario_pedidos_inicio || "19:00"} - {schedule?.horario_pedidos_fin || "21:00"} hs
                </span>
              </div>
            </div>
          </div>

          {/* Alternative options */}
          {otherAvailableCategories.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-4 border border-green-100 dark:border-green-800/30">
              <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                Disponible ahora:
              </p>
              <div className="space-y-1.5">
                {otherAvailableCategories.map((cat) => {
                  const catSchedule = allSchedules[cat];
                  const CatIcon = categoryIcons[cat];
                  return (
                    <div key={cat} className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                      {CatIcon && <CatIcon className="w-4 h-4" />}
                      <span className="font-medium">{categoryNames[cat]}</span>
                      <span className="text-green-600/70 dark:text-green-400/70">
                        ({catSchedule?.horario_pedidos_inicio || "19:00"} - {catSchedule?.horario_pedidos_fin || "22:00"})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Current time */}
          <div className="flex items-center justify-center gap-2 text-xs text-secondary-400 dark:text-secondary-500 mb-6">
            <Clock className="w-3 h-3" />
            <span>{currentDay.charAt(0).toUpperCase() + currentDay.slice(1)}, {currentTime}</span>
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-secondary-900 dark:bg-white hover:bg-secondary-800 dark:hover:bg-secondary-100 text-white dark:text-secondary-900 font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>Entendido</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleNotificationModal;
