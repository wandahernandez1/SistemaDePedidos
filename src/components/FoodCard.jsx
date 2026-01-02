import { ArrowRight } from "lucide-react";

/**
 * Componente FoodCard - Tarjeta de plato destacado
 * Diseño profesional y minimalista con efectos hover elegantes
 * Completamente responsivo
 */
const FoodCard = ({ food, onClick }) => {
  return (
    <div
      className="group bg-white dark:bg-secondary-900 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col cursor-pointer border border-secondary-100 dark:border-secondary-800 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary-200 dark:hover:border-primary-700"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-40 sm:h-52 overflow-hidden bg-secondary-50 dark:bg-secondary-800">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Tags */}
        {food.tags && food.tags.length > 0 && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap gap-1.5 sm:gap-2">
            {food.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-white/95 text-secondary-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold shadow-sm backdrop-blur-sm border border-white/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Ver más indicator */}
        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-1 sm:gap-1.5 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-lg text-primary-600 text-[10px] sm:text-xs font-semibold">
            Ver más
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3 flex-1">
        <h3 className="text-base sm:text-lg font-bold text-secondary-900 dark:text-secondary-50 m-0 tracking-tight leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
          {food.name}
        </h3>
        <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed m-0 line-clamp-2 flex-1">
          {food.description}
        </p>
      </div>
    </div>
  );
};

export default FoodCard;
