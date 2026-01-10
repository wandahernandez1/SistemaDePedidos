import { memo, useMemo, useCallback, useState } from "react";
import {
  ArrowRight,
  Clock,
  AlertCircle,
  Flame,
  Eye,
  Calendar,
  Sun,
  Moon,
} from "lucide-react";

/**
 * Componente FoodCard - Tarjeta de plato destacado
 * Diseño premium con efectos sutiles y transiciones suaves
 * Completamente responsivo y optimizado para rendimiento
 * Soporta sistema de doble turno
 */
const FoodCard = memo(({ food, onClick, schedule, isAvailable }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Formatear horario para mostrar - memoizado (soporta doble turno)
  const scheduleInfo = useMemo(() => {
    if (!schedule) return null;
    const dias = schedule.dias || [];
    const turnos = schedule.turnos;

    // Formatear días
    const weekdays = ["lunes", "martes", "miércoles", "jueves", "viernes"];
    const isWeekdays =
      weekdays.every((d) => dias.includes(d)) && dias.length === 5;
    const isFriToSun =
      ["viernes", "sábado", "domingo"].every((d) => dias.includes(d)) &&
      dias.length === 3;

    let daysText = "";
    if (isWeekdays) daysText = "Lunes a Viernes";
    else if (isFriToSun) daysText = "Viernes a Domingo";
    else
      daysText = dias
        .map((d) => d.charAt(0).toUpperCase() + d.slice(1, 3))
        .join(", ");

    // Formatear turnos
    const activeShifts = [];
    if (turnos) {
      if (turnos.turno1?.habilitado) {
        activeShifts.push({
          nombre: turnos.turno1.nombre || "Mediodía",
          inicio: turnos.turno1.inicio,
          fin: turnos.turno1.fin,
          icon: "sun",
        });
      }
      if (turnos.turno2?.habilitado) {
        activeShifts.push({
          nombre: turnos.turno2.nombre || "Noche",
          inicio: turnos.turno2.inicio,
          fin: turnos.turno2.fin,
          icon: "moon",
        });
      }
    }

    // Fallback a formato antiguo si no hay turnos
    if (activeShifts.length === 0) {
      const inicio = schedule.horario_pedidos_inicio || "19:00";
      const fin = schedule.horario_pedidos_fin || "21:00";
      activeShifts.push({
        nombre: "Horario",
        inicio,
        fin,
        icon: "clock",
      });
    }

    return { daysText, activeShifts };
  }, [schedule]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <div
      className={`group relative rounded-3xl overflow-hidden h-full flex flex-col cursor-pointer transition-all duration-300 ease-out ${
        isAvailable === false
          ? "opacity-95 dark:opacity-90 grayscale-[5%] dark:grayscale-[10%]"
          : ""
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered
          ? "0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(35, 137, 238, 0.1)"
          : "0 8px 30px -8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Main Image Container - Full card background */}
      <div className="absolute inset-0 overflow-hidden bg-secondary-200 dark:bg-secondary-800">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full min-w-full min-h-full object-cover object-center"
          loading="lazy"
          decoding="async"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      </div>

      {/* Content overlay */}
      <div className="relative flex flex-col h-full min-h-[300px] sm:min-h-[360px] lg:min-h-[400px] p-5 sm:p-6 lg:p-8">
        {/* Top Section - Tags & Status */}
        <div className="flex justify-between items-start gap-3">
          {/* Tags with glassmorphism - Max 2 tags, truncate if needed */}
          {food.tags && food.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 max-w-[65%]">
              {food.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 backdrop-blur-md bg-white/20 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-white/25 shadow-lg whitespace-nowrap"
                >
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400 shrink-0" />
                  <span className="truncate max-w-[80px] sm:max-w-none">
                    {tag}
                  </span>
                </span>
              ))}
            </div>
          )}

          {/* Status indicator */}
          {isAvailable !== false && (
            <div className="flex items-center gap-1.5 sm:gap-2 backdrop-blur-md bg-emerald-500/25 text-emerald-200 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-emerald-400/35 shrink-0 shadow-lg">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Disponible</span>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Section - Content */}
        <div className="space-y-4 lg:space-y-5">
          {/* Title */}
          <h3
            className="text-2xl sm:text-2xl lg:text-3xl font-bold text-white m-0 tracking-tight leading-tight"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            {food.name}
          </h3>

          {/* Description */}
          <p
            className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed m-0 line-clamp-2"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            {food.description}
          </p>

          {/* Schedule & CTA Row */}
          <div className="flex items-end justify-between gap-3 pt-1">
            {/* Horario de disponibilidad - Diseño con soporte doble turno */}
            {scheduleInfo && (
              <div
                className={`flex flex-col gap-1.5 ${
                  isAvailable === false ? "opacity-90" : ""
                }`}
              >
                {/* Días */}
                <div className="flex items-center gap-2 lg:gap-2.5">
                  {isAvailable === false ? (
                    <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5 text-amber-400" />
                  ) : (
                    <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-white/70" />
                  )}
                  <span
                    className={`text-xs lg:text-sm font-medium ${
                      isAvailable === false ? "text-amber-300" : "text-white/70"
                    }`}
                  >
                    {scheduleInfo.daysText}
                  </span>
                </div>

                {/* Turnos activos */}
                <div className="flex flex-col gap-1 lg:gap-1.5">
                  {scheduleInfo.activeShifts.map((shift, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 lg:gap-2.5"
                    >
                      {shift.icon === "sun" ? (
                        <Sun
                          className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${
                            isAvailable === false
                              ? "text-amber-400"
                              : "text-yellow-400"
                          }`}
                        />
                      ) : shift.icon === "moon" ? (
                        <Moon
                          className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${
                            isAvailable === false
                              ? "text-amber-400"
                              : "text-indigo-300"
                          }`}
                        />
                      ) : (
                        <Clock
                          className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${
                            isAvailable === false
                              ? "text-amber-400"
                              : "text-white/70"
                          }`}
                        />
                      )}
                      <span
                        className={`text-xs lg:text-sm font-semibold ${
                          isAvailable === false
                            ? "text-amber-200"
                            : "text-white/90"
                        }`}
                      >
                        {shift.inicio} - {shift.fin}
                      </span>
                    </div>
                  ))}
                </div>

                {isAvailable === false && (
                  <span className="text-xs lg:text-sm text-amber-400 font-medium mt-0.5">
                    Fuera de horario
                  </span>
                )}
              </div>
            )}

            {/* Ver más button - Más grande en desktop */}
            <button
              className="group/btn flex items-center gap-2 lg:gap-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2.5 lg:px-5 lg:py-3 rounded-xl lg:rounded-2xl text-sm lg:text-base font-semibold border border-white/30 transition-all duration-300 hover:border-white/50 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>Ver más</span>
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

FoodCard.displayName = "FoodCard";

export default FoodCard;
