import { useState } from "react";
import { formatPrice } from "../../utils/formatPrice";

/**
 * Componente EditableProductCard - Tarjeta de producto editable (minimalista)
 */
const EditableProductCard = ({ product, onSave, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`¿Eliminar "${product.nombre}"?`)) {
      try {
        await onDelete(product);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(product);
    }
  };

  const unitLabels = {
    unidad: "Unidad",
    docena: "Docena",
    kg: "Kg",
    litro: "Lt",
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-200 transition-all duration-300 relative group hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge de unidad */}
        <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-neutral-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
          Por {unitLabels[product.unidad] || product.unidad}
        </span>

        {/* Badge de disponibilidad */}
        {product.disponible === false && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            No disponible
          </span>
        )}

        {/* Badge destacado */}
        {product.destacado && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Destacado
          </span>
        )}

        {/* Botones de acción */}
        <div
          className={`
          absolute bottom-3 right-3 flex gap-2 transition-all duration-300
          ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        `}
        >
          <button
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer border-none transition-all duration-200 hover:bg-blue-500 hover:text-white hover:scale-110"
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
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer border-none transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-110"
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

        {/* Precio sobre la imagen */}
        <div
          className={`
          absolute bottom-3 left-3 transition-all duration-300
          ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        `}
        >
          <span className="bg-neutral-900/90 text-white text-lg font-bold px-4 py-2 rounded-xl backdrop-blur-sm">
            {formatPrice(product.precio)}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-neutral-800 mb-1 line-clamp-1">
          {product.nombre}
        </h3>
        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2 mb-3">
          {product.descripcion}
        </p>

        {/* Footer con precio */}
        <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
          <span className="text-2xl font-bold text-neutral-800">
            {formatPrice(product.precio)}
          </span>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-neutral-100 hover:bg-primary-500 hover:text-white text-neutral-700 text-sm font-medium rounded-xl transition-all duration-200 border-none cursor-pointer"
          >
            Editar
          </button>
        </div>
      </div>

      {/* Indicador de estado */}
      <div
        className={`
        absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-300
        ${
          product.disponible === false
            ? "bg-red-500 opacity-100"
            : "bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100"
        }
      `}
      />
    </div>
  );
};

export default EditableProductCard;
