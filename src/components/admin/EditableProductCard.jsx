import { useState } from "react";
import { uploadImage, validateImage } from "../../supabase/storageService";
import { formatPrice } from "../../utils/formatPrice";

/**
 * Componente EditableProductCard - Tarjeta de producto editable
 */
const EditableProductCard = ({ product, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: product.nombre,
    descripcion: product.descripcion,
    categoria: product.categoria,
    precio: product.precio,
    imagen: product.imagen,
    unidad: product.unidad,
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        validateImage(file);
        setUploading(true);
        const imageUrl = await uploadImage(file, "products");
        setFormData({ ...formData, imagen: imageUrl });
        setUploading(false);
      } catch (error) {
        alert(error.message);
        setUploading(false);
        e.target.value = "";
      }
    }
  };

  const handleSave = async () => {
    try {
      await onSave(product.id, {
        ...formData,
        precio: Number(formData.precio),
      });
      setIsEditing(false);
      alert("Producto actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los cambios");
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      categoria: product.categoria,
      precio: product.precio,
      imagen: product.imagen,
      unidad: product.unidad,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Eliminar "${product.nombre}"?`)) {
      try {
        await onDelete(product);
        alert("Producto eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar el producto");
      }
    }
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-200 transition-all duration-300 relative group hover:shadow-lg hover:-translate-y-0.5">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute top-3 right-3 bg-zinc-800 text-white text-xs font-medium px-3 py-1.5 rounded-full">
            Por {product.unidad}
          </span>
          <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              className="bg-white/95 border-none rounded-full w-9 h-9 cursor-pointer text-base flex items-center justify-center shadow-lg transition-all duration-200 hover:bg-blue-500 hover:scale-110"
              onClick={() => setIsEditing(true)}
              title="Editar"
            >
              ✏️
            </button>
            <button
              className="bg-white/95 border-none rounded-full w-9 h-9 cursor-pointer text-base flex items-center justify-center shadow-lg transition-all duration-200 hover:bg-red-500 hover:scale-110"
              onClick={handleDelete}
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-zinc-800 m-0">
            {product.nombre}
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed m-0 line-clamp-2">
            {product.descripcion}
          </p>
          <div className="flex justify-between items-center pt-3 border-t border-zinc-100 mt-auto">
            <span className="text-xl font-bold text-zinc-800">
              {formatPrice(product.precio)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border-2 border-emerald-500 transition-all duration-300 relative">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={formData.imagen}
          alt={formData.nombre}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-t-xl">
          <label className="bg-white text-zinc-700 px-6 py-3 rounded-lg cursor-pointer font-medium transition-all duration-200 flex items-center gap-2 hover:bg-emerald-500 hover:text-white hover:scale-105">
            {uploading ? "Subiendo..." : "📷 Cambiar imagen"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="w-full px-3 py-2.5 border-2 border-zinc-200 rounded-lg text-lg font-semibold transition-colors duration-200 focus:outline-none focus:border-emerald-500"
          placeholder="Nombre del producto"
        />

        <textarea
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
          className="w-full px-3 py-2.5 border-2 border-zinc-200 rounded-lg text-sm font-inherit resize-y min-h-[60px] transition-colors duration-200 focus:outline-none focus:border-emerald-500"
          placeholder="Descripción"
          rows="2"
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
              Categoría
            </label>
            <select
              value={formData.categoria}
              onChange={(e) =>
                setFormData({ ...formData, categoria: e.target.value })
              }
              className="w-full px-3 py-2.5 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="hamburguesas">Hamburguesas</option>
              <option value="empanadas">Empanadas</option>
              <option value="pizzas">Pizzas</option>
              <option value="bebidas">Bebidas</option>
              <option value="postres">Postres</option>
              <option value="ensaladas">Ensaladas</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
              Unidad
            </label>
            <select
              value={formData.unidad}
              onChange={(e) =>
                setFormData({ ...formData, unidad: e.target.value })
              }
              className="w-full px-3 py-2.5 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="unidad">Unidad</option>
              <option value="docena">Docena</option>
              <option value="kg">Kilogramo</option>
              <option value="litro">Litro</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
            Precio
          </label>
          <input
            type="number"
            value={formData.precio}
            onChange={(e) =>
              setFormData({ ...formData, precio: e.target.value })
            }
            className="w-full px-3 py-2.5 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-emerald-500"
            placeholder="Precio"
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            className="flex-1 py-3 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-emerald-500 text-white hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg disabled:bg-zinc-300 disabled:cursor-not-allowed"
            disabled={uploading}
          >
            ✓ Guardar
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 py-3 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          >
            ✕ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableProductCard;
