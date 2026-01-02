import { memo, useMemo, useCallback } from "react";
import { ArrowRight, Clock, AlertCircle } from "lucide-react";

/**
 * Componente FoodCard - Tarjeta de plato destacado
 * Diseño profesional y minimalista con efectos hover elegantes
 * Completamente responsivo y optimizado para rendimiento
 */
const FoodCard = memo(({ food, onClick, schedule, isAvailable }) => {
  // Formatear horario para mostrar - memoizado
  const scheduleText = useMemo(() => {
    if (!schedule) return null;
    const dias = schedule.dias || [];
    const inicio = schedule.horario_pedidos_inicio || "19:00";
    const fin = schedule.horario_pedidos_fin || "21:00";

    const weekdays = ["lunes", "martes", "miércoles", "jueves", "viernes"];
    const isWeekdays =
      weekdays.every((d) => dias.includes(d)) && dias.length === 5;
    const isFriToSun =
      ["viernes", "sábado", "domingo"].every((d) => dias.includes(d)) &&
      dias.length === 3;

    let daysText = "";
    if (isWeekdays) daysText = "Lun-Vie";
    else if (isFriToSun) daysText = "Vie-Dom";
    else daysText = dias.map((d) => d.slice(0, 3)).join(", ");

    return `${daysText} ${inicio}-${fin}`;
  }, [schedule]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <div
      className={`group bg-white dark:bg-secondary-900 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 h-full flex flex-col cursor-pointer border border-secondary-200 dark:border-secondary-700 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary-400 dark:hover:border-primary-500 gpu-accelerated ${
        isAvailable === false ? "opacity-75" : ""
      }`}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-40 sm:h-52 overflow-hidden bg-secondary-100 dark:bg-secondary-700">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Tags */}
        {food.tags && food.tags.length > 0 && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap gap-1.5 sm:gap-2">
            {food.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-white/95 text-secondary-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold shadow-sm border border-white/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Ver más indicator */}
        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1 sm:gap-1.5 bg-white dark:bg-secondary-800 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-lg text-primary-600 dark:text-primary-400 text-[10px] sm:text-xs font-semibold border border-secondary-200 dark:border-secondary-700">
            Ver más
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 flex-1">
        <h3 className="text-base sm:text-lg font-bold text-secondary-900 dark:text-secondary-50 m-0 tracking-tight leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150">
          {food.name}
        </h3>
        <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed m-0 line-clamp-2 flex-1">
          {food.description}
        </p>

        {/* Horario de disponibilidad */}
        {scheduleText && (
          <div
            className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-medium mt-1 ${
              isAvailable === false
                ? "text-amber-600 dark:text-amber-400"
                : "text-secondary-400 dark:text-secondary-500"
            }`}
          >
            {isAvailable === false ? (
              <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            ) : (
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            )}
            <span>{scheduleText}</span>
            {isAvailable === false && (
              <span className="text-amber-500 dark:text-amber-400 ml-1">
                (No disponible ahora)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

FoodCard.displayName = "FoodCard";

export default FoodCard;
