import { memo, useMemo, useCallback, useState } from "react";
import { ArrowRight, Clock, AlertCircle, Flame, Eye, Calendar } from "lucide-react";

/**
 * Componente FoodCard - Tarjeta de plato destacado
 * Diseño premium con efectos sutiles y transiciones suaves
 * Completamente responsivo y optimizado para rendimiento
 */
const FoodCard = memo(({ food, onClick, schedule, isAvailable }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Formatear horario para mostrar - memoizado
  const scheduleInfo = useMemo(() => {
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
    if (isWeekdays) daysText = "Lunes a Viernes";
    else if (isFriToSun) daysText = "Viernes a Domingo";
    else daysText = dias.map((d) => d.charAt(0).toUpperCase() + d.slice(1, 3)).join(", ");

    return { daysText, timeText: `${inicio} - ${fin}` };
  }, [schedule]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <div
      className={`group relative rounded-3xl overflow-hidden h-full flex flex-col cursor-pointer transition-all duration-300 ease-out ${
        isAvailable === false ? "opacity-80 grayscale-[15%]" : ""
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered
          ? '0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(35, 137, 238, 0.1)'
          : '0 8px 30px -8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Main Image Container - Full card background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      </div>

      {/* Content overlay */}
      <div className="relative flex flex-col h-full min-h-[280px] sm:min-h-[320px] p-5 sm:p-6">
        {/* Top Section - Tags & Status */}
        <div className="flex justify-between items-start gap-2">
          {/* Tags with glassmorphism */}
          {food.tags && food.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {food.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 backdrop-blur-sm bg-white/15 text-white px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20 shadow-sm"
                >
                  <Flame className="w-3 h-3 text-orange-400" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Status indicator */}
          {isAvailable !== false && (
            <div className="flex items-center gap-1.5 backdrop-blur-sm bg-emerald-500/20 text-emerald-300 px-2.5 py-1.5 rounded-full text-xs font-medium border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Disponible
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Section - Content */}
        <div className="space-y-4">
          {/* Title */}
          <h3 
            className="text-xl sm:text-2xl font-bold text-white m-0 tracking-tight leading-tight"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
          >
            {food.name}
          </h3>
          
          {/* Description */}
          <p 
            className="text-sm sm:text-base text-white/85 leading-relaxed m-0 line-clamp-2"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
          >
            {food.description}
          </p>

          {/* Schedule & CTA Row */}
          <div className="flex items-end justify-between gap-3 pt-1">
            {/* Horario de disponibilidad - Diseño mejorado */}
            {scheduleInfo && (
              <div className={`flex flex-col gap-1 ${isAvailable === false ? "opacity-90" : ""}`}>
                <div className="flex items-center gap-2">
                  {isAvailable === false ? (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Calendar className="w-4 h-4 text-white/70" />
                  )}
                  <span className={`text-xs font-medium ${isAvailable === false ? "text-amber-300" : "text-white/70"}`}>
                    {scheduleInfo.daysText}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${isAvailable === false ? "text-amber-400" : "text-white/70"}`} />
                  <span className={`text-sm font-semibold ${isAvailable === false ? "text-amber-200" : "text-white/90"}`}>
                    {scheduleInfo.timeText}
                  </span>
                </div>
                {isAvailable === false && (
                  <span className="text-xs text-amber-400 font-medium mt-0.5">
                    Fuera de horario
                  </span>
                )}
              </div>
            )}

            {/* Ver más button */}
            <button 
              className="group/btn flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/25 transition-all duration-300 hover:border-white/40"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              <Eye className="w-4 h-4" />
              <span>Ver más</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

FoodCard.displayName = "FoodCard";

export default FoodCard;
