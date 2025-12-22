import { useState } from "react";
import { uploadImage, validateImage } from "../../supabase/storageService";

/**
 * Componente EditableFoodCard - Tarjeta de plato destacado editable
 */
const EditableFoodCard = ({ food, onSave, onDelete, onOpen }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: food.name,
    description: food.description,
    category: food.category,
    image: food.image,
    tags: food.tags || [],
  });
  const [tagInput, setTagInput] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        validateImage(file);
        setUploading(true);
        const imageUrl = await uploadImage(file, "foods");
        setFormData({ ...formData, image: imageUrl });
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
      await onSave(food.id, formData);
      setIsEditing(false);
      alert("Plato actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los cambios");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: food.name,
      description: food.description,
      category: food.category,
      image: food.image,
      tags: food.tags || [],
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Eliminar "${food.name}"?`)) {
      try {
        await onDelete(food);
        alert("Plato eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar el plato");
      }
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  if (!isEditing) {
    return (
      <div
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-200 transition-all duration-300 relative group hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
        onClick={() => onOpen && onOpen(food.category)}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {food.tags && food.tags.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 max-w-[calc(100%-24px)]">
              {food.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-zinc-800/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              className="bg-white/95 border-none rounded-lg px-3 py-2 cursor-pointer text-sm font-medium shadow-lg transition-all duration-200 hover:bg-blue-500 hover:text-white hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              title="Editar"
            >
              Editar
            </button>
            <button
              className="bg-white/95 border-none rounded-lg px-3 py-2 cursor-pointer text-sm font-medium shadow-lg transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              title="Eliminar"
            >
              Eliminar
            </button>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-semibold text-zinc-800 mb-2">
            {food.name}
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed m-0 line-clamp-2">
            {food.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-500 transition-all duration-300 relative"
      onClick={() => onOpen && onOpen(food.category)}
      style={{ cursor: onOpen ? "pointer" : "default" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={formData.image}
          alt={formData.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
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
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2.5 border-2 border-zinc-200 rounded-lg text-lg font-semibold transition-colors duration-200 focus:outline-none focus:border-emerald-500"
          placeholder="Nombre del plato"
        />

        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2.5 border-2 border-zinc-200 rounded-lg text-sm resize-y min-h-[70px] transition-colors duration-200 focus:outline-none focus:border-emerald-500"
          placeholder="Descripción"
          rows="3"
        />

        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
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

        <div className="mb-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="bg-transparent border-none text-blue-600 text-base cursor-pointer p-0 w-4 h-4 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/10"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
              placeholder="Agregar etiqueta"
              className="flex-1 px-3 py-2.5 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-emerald-500 text-white border-none rounded-lg px-4 py-2.5 text-lg font-bold cursor-pointer transition-all duration-200 hover:bg-emerald-600 hover:scale-105"
            >
              +
            </button>
          </div>
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

export default EditableFoodCard;
