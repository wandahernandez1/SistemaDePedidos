import { useState, useRef } from "react";
import { uploadImage, validateImage } from "../../supabase/storageService";
import { Beef, Cookie, Pizza, GlassWater, Cake, Salad } from "lucide-react";

const categoryNames = {
  hamburguesas: "Hamburguesas",
  empanadas: "Empanadas",
  pizzas: "Pizzas",
  bebidas: "Bebidas",
  postres: "Postres",
  ensaladas: "Ensaladas",
};

// Iconos de categoría usando Lucide
const categoryIconComponents = {
  hamburguesas: Beef,
  empanadas: Cookie,
  pizzas: Pizza,
  bebidas: GlassWater,
  postres: Cake,
  ensaladas: Salad,
};

/**
 * Modal profesional para crear/editar platos destacados
 */
const FoodModal = ({ food, isNew, onClose, onSave }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(food?.image || "");
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    name: food?.name || "",
    description: food?.description || "",
    category: food?.category || "hamburguesas",
    image: food?.image || "",
    tags: food?.tags || [],
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.description.trim())
      newErrors.description = "La descripción es obligatoria";
    if (!formData.image && !imagePreview)
      newErrors.image = "La imagen es obligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = async (file) => {
    if (file) {
      try {
        validateImage(file);
        setUploading(true);

        // Preview local
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);

        // Subir a Supabase
        const imageUrl = await uploadImage(file, "foods");
        setFormData({ ...formData, image: imageUrl });
        setImagePreview(imageUrl);
        setErrors({ ...errors, image: null });
      } catch (error) {
        setErrors({ ...errors, image: error.message });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSave(formData);
  };

  const suggestedTags = [
    "Más pedido",
    "Popular",
    "Nuevo",
    "Clásico",
    "Casero",
    "Especial",
    "Oferta",
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-800">
              {isNew ? "Nuevo Plato Destacado" : "Editar Plato Destacado"}
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              {isNew
                ? "Completa los datos del nuevo plato"
                : `Editando: ${food?.name}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors border-none cursor-pointer"
          >
            <svg
              className="w-5 h-5 text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Imagen */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Imagen del plato
              </label>
              <div
                className={`
                  relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer
                  ${
                    dragActive
                      ? "border-primary-500 bg-primary-50"
                      : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                  }
                  ${errors.image ? "border-red-300 bg-red-50" : ""}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">
                        {uploading ? "Subiendo..." : "Cambiar imagen"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <svg
                      className="w-12 h-12 mx-auto text-neutral-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-neutral-600 font-medium">
                      {uploading
                        ? "Subiendo imagen..."
                        : "Arrastra una imagen o haz clic para seleccionar"}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Soporta: JPG, PNG, WEBP, GIF, SVG, BMP, AVIF, HEIC (máx.
                      10MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                  className="hidden"
                />
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Nombre del plato *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`
                  w-full px-4 py-3 rounded-xl border-2 transition-colors text-neutral-800 text-base
                  focus:outline-none focus:border-primary-500
                  ${
                    errors.name
                      ? "border-red-300 bg-red-50"
                      : "border-neutral-200"
                  }
                `}
                placeholder="Ej: Hamburguesas Gourmet"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className={`
                  w-full px-4 py-3 rounded-xl border-2 transition-colors text-neutral-800 text-base resize-none
                  focus:outline-none focus:border-primary-500
                  ${
                    errors.description
                      ? "border-red-300 bg-red-50"
                      : "border-neutral-200"
                  }
                `}
                placeholder="Describe el plato destacado"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Categoría
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {Object.entries(categoryNames).map(([key, name]) => {
                  const IconComponent = categoryIconComponents[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: key })
                      }
                      className={`
                        p-3 rounded-xl border-2 transition-all text-center cursor-pointer
                        ${
                          formData.category === key
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                        }
                      `}
                    >
                      <div className="flex justify-center mb-1">
                        <IconComponent
                          className={`w-5 h-5 ${
                            formData.category === key
                              ? "text-primary-600"
                              : "text-neutral-500"
                          }`}
                        />
                      </div>
                      <span className="text-xs font-medium">{name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Etiquetas */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Etiquetas
              </label>

              {/* Tags actuales */}
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="w-4 h-4 rounded-full bg-primary-200 hover:bg-primary-300 flex items-center justify-center text-primary-600 border-none cursor-pointer text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Input para nueva etiqueta */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="Escribe una etiqueta"
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-neutral-200 focus:outline-none focus:border-primary-500 text-neutral-800"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors border-none cursor-pointer"
                >
                  Agregar
                </button>
              </div>

              {/* Etiquetas sugeridas */}
              <div className="mt-3">
                <p className="text-xs text-neutral-500 mb-2">Sugerencias:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags
                    .filter((tag) => !formData.tags.includes(tag))
                    .map((tag, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            tags: [...formData.tags, tag],
                          })
                        }
                        className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full text-xs font-medium transition-colors border-none cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-neutral-700 font-medium hover:bg-neutral-100 transition-colors border-none cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="px-6 py-2.5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
          >
            {uploading
              ? "Subiendo..."
              : isNew
              ? "Crear Plato"
              : "Guardar Cambios"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FoodModal;
