/**
 * Componente FoodCard - Tarjeta de plato destacado
 */
const FoodCard = ({ food, onClick }) => {
  return (
    <div
      className="bg-white border border-zinc-200 rounded-lg overflow-hidden transition-all duration-200 h-full flex flex-col cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:border-zinc-300"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-zinc-50">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-103"
          loading="lazy"
        />
        {food.tags && food.tags.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {food.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-white/95 text-zinc-700 px-2.5 py-1 rounded text-[0.7rem] font-semibold border border-zinc-200/50 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <h3 className="text-lg font-semibold text-zinc-800 m-0 tracking-tight leading-tight">
          {food.name}
        </h3>
        <p className="text-sm text-zinc-500 leading-relaxed m-0">
          {food.description}
        </p>
      </div>
    </div>
  );
};

export default FoodCard;
