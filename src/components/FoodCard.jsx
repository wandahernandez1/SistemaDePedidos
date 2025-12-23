import { ArrowRight } from "lucide-react";

/**
 * Componente FoodCard - Tarjeta de plato destacado
 * Diseño profesional y minimalista con efectos hover elegantes
 */
const FoodCard = ({ food, onClick }) => {
  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col cursor-pointer border border-secondary-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary-200"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-52 overflow-hidden bg-secondary-50">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tags */}
        {food.tags && food.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {food.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-white/95 text-secondary-700 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm border border-white/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Ver más indicator */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-full shadow-lg text-primary-600 text-xs font-semibold">
            Ver más
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-lg font-bold text-secondary-900 m-0 tracking-tight leading-tight group-hover:text-primary-600 transition-colors duration-200">
          {food.name}
        </h3>
        <p className="text-sm text-secondary-500 leading-relaxed m-0 line-clamp-2">
          {food.description}
        </p>

        {/* Bottom accent line */}
        <div className="mt-auto pt-4 border-t border-secondary-100">
          <div className="h-1 w-12 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full group-hover:w-full transition-all duration-500" />
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
