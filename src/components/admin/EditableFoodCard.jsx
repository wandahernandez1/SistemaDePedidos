import { useState } from "react";

/**
 * Componente EditableFoodCard - Tarjeta de plato destacado editable (minimalista)
 */
const EditableFoodCard = ({ food, onSave, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`¿Eliminar "${food.name}"?`)) {
      try {
        await onDelete(food);
      } catch (error) {
        // Error manejado por el componente padre
      }
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(food);
    }
  };

  const categoryNames = {
    hamburguesas: "Hamburguesas",
    empanadas: "Empanadas",
    pizzas: "Pizzas",
    bebidas: "Bebidas",
    postres: "Postres",
    ensaladas: "Ensaladas",
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-200 transition-all duration-300 relative group hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tags */}
        {food.tags && food.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[calc(100%-60px)]">
            {food.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-white/95 backdrop-blur-sm text-neutral-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm"
              >
                {tag}
              </span>
            ))}
            {food.tags.length > 2 && (
              <span className="bg-neutral-800/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                +{food.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Categoría badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-neutral-800/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
            {categoryNames[food.category] || food.category}
          </span>
        </div>

        {/* Botones de acción */}
        <div
          className={`
          absolute bottom-3 right-3 flex gap-2 transition-all duration-300
          ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        `}
        >
          <button
            className="w-10 h-10 bg-white text-secondary-700 rounded-xl flex items-center justify-center shadow-lg cursor-pointer border-none transition-all duration-200 hover:bg-primary-500 hover:text-white hover:scale-105"
            onClick={handleEdit}
            title="Editar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            className="w-10 h-10 bg-white text-secondary-700 rounded-xl flex items-center justify-center shadow-lg cursor-pointer border-none transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-105"
            onClick={handleDelete}
            title="Eliminar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-neutral-800 mb-2 line-clamp-1">
          {food.name}
        </h3>
        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2">
          {food.description}
        </p>
      </div>

      {/* Indicador de estado */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default EditableFoodCard;
