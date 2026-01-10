import { useState, useRef, useCallback } from "react";
import { uploadImage, validateImage } from "../../supabase/storageService";
import {
  Beef,
  Package,
  Scale,
  GlassWater,
  ImageIcon,
  Camera,
} from "lucide-react";
import ImagePositionEditor from "./ImagePositionEditor";

const categoryNames = {
  hamburguesas: "Hamburguesas",
  empanadas: "Empanadas",
  pizzas: "Pizzas",
  bebidas: "Bebidas",
  postres: "Postres",
  ensaladas: "Ensaladas",
};

// Iconos de unidades
const unitIconComponents = {
  unidad: Beef,
  docena: Package,
  kg: Scale,
  litro: GlassWater,
};

/**
 * Modal profesional para crear/editar productos
 */
const ProductModal = ({ product, isNew, category, onClose, onSave }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(product?.imagen || "");
  const [showPositionEditor, setShowPositionEditor] = useState(false);
  const [formData, setFormData] = useState({
    nombre: product?.nombre || "",
    descripcion: product?.descripcion || "",
    categoria: product?.categoria || category || "hamburguesas",
    precio: product?.precio || 0,
    imagen: product?.imagen || "",
    imagenPosicion: product?.imagenPosicion ||
      product?.imagen_posicion || { x: 50, y: 50 },
    imagenZoom: product?.imagenZoom || product?.imagen_zoom || 100,
    unidad: product?.unidad || "unidad",
    disponible: product?.disponible !== false,
    destacado: product?.destacado || false,
  });
  const [errors, setErrors] = useState({});

  // Callbacks para el editor de posición
  const handlePositionChange = useCallback((position) => {
    setFormData((prev) => ({ ...prev, imagenPosicion: position }));
  }, []);

  const handleZoomChange = useCallback((zoom) => {
    setFormData((prev) => ({ ...prev, imagenZoom: zoom }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.descripcion.trim())
      newErrors.descripcion = "La descripción es obligatoria";
    if (formData.precio <= 0) newErrors.precio = "El precio debe ser mayor a 0";
    if (!formData.imagen && !imagePreview)
      newErrors.imagen = "La imagen es obligatoria";
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
        const imageUrl = await uploadImage(file, "products");
        setFormData({ ...formData, imagen: imageUrl });
        setImagePreview(imageUrl);
        setErrors({ ...errors, imagen: null });
      } catch (error) {
        setErrors({ ...errors, imagen: error.message });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const dataToSave = {
      ...formData,
      precio: Number(formData.precio),
    };

    await onSave(dataToSave);
  };

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
              {isNew ? "Nuevo Producto" : "Editar Producto"}
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              {isNew
                ? "Completa los datos del nuevo producto"
                : `Editando: ${product?.nombre}`}
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
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Imagen del producto
              </label>

              {/* Selector de imagen (solo cuando no hay imagen o no está en modo editor) */}
              {!showPositionEditor && (
                <div
                  className={`
                    relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer
                    ${
                      dragActive
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    }
                    ${errors.imagen ? "border-red-300 bg-red-50" : ""}
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
                        style={{
                          objectPosition: `${
                            formData.imagenPosicion?.x || 50
                          }% ${formData.imagenPosicion?.y || 50}%`,
                        }}
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
              )}

              {/* Botón para abrir editor de posición */}
              {imagePreview && !showPositionEditor && (
                <button
                  type="button"
                  onClick={() => setShowPositionEditor(true)}
                  className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors border-none cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  Ajustar posición de imagen
                </button>
              )}

              {/* Editor de posición de imagen */}
              {showPositionEditor && imagePreview && (
                <div className="space-y-3">
                  <ImagePositionEditor
                    imageUrl={imagePreview}
                    initialPosition={formData.imagenPosicion}
                    initialZoom={formData.imagenZoom}
                    onPositionChange={handlePositionChange}
                    onZoomChange={handleZoomChange}
                    aspectRatio="4/3"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPositionEditor(false)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors border-none cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      Aceptar posición
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors border-none cursor-pointer"
                    >
                      Cambiar foto
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleImageChange(e.target.files[0]);
                        setShowPositionEditor(false);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {errors.imagen && (
                <p className="text-red-500 text-sm mt-1">{errors.imagen}</p>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Nombre del producto *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className={`
                  w-full px-4 py-3 rounded-xl border-2 transition-colors text-neutral-800 text-base
                  focus:outline-none focus:border-primary-500
                  ${
                    errors.nombre
                      ? "border-red-300 bg-red-50"
                      : "border-neutral-200"
                  }
                `}
                placeholder="Ej: Hamburguesa Clásica"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                rows={3}
                className={`
                  w-full px-4 py-3 rounded-xl border-2 transition-colors text-neutral-800 text-base resize-none
                  focus:outline-none focus:border-primary-500
                  ${
                    errors.descripcion
                      ? "border-red-300 bg-red-50"
                      : "border-neutral-200"
                  }
                `}
                placeholder="Describe los ingredientes y características del producto"
              />
              {errors.descripcion && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.descripcion}
                </p>
              )}
            </div>

            {/* Precio y Categoría */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Precio *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.precio}
                    onChange={(e) =>
                      setFormData({ ...formData, precio: e.target.value })
                    }
                    min="0"
                    step="1"
                    className={`
                      w-full pl-8 pr-4 py-3 rounded-xl border-2 transition-colors text-neutral-800 text-base
                      focus:outline-none focus:border-primary-500
                      ${
                        errors.precio
                          ? "border-red-300 bg-red-50"
                          : "border-neutral-200"
                      }
                    `}
                    placeholder="0"
                  />
                </div>
                {errors.precio && (
                  <p className="text-red-500 text-sm mt-1">{errors.precio}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Categoría
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 transition-colors text-neutral-800 text-base focus:outline-none focus:border-primary-500 bg-white"
                >
                  {Object.entries(categoryNames).map(([key, name]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Unidad */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Unidad de venta
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: "unidad", label: "Unidad" },
                  { value: "docena", label: "Docena" },
                  { value: "kg", label: "Kilogramo" },
                  { value: "litro", label: "Litro" },
                ].map((unit) => {
                  const IconComponent = unitIconComponents[unit.value];
                  return (
                    <button
                      key={unit.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, unidad: unit.value })
                      }
                      className={`
                        p-3 rounded-xl border-2 transition-all text-center cursor-pointer
                        ${
                          formData.unidad === unit.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                        }
                      `}
                    >
                      <div className="flex justify-center mb-1">
                        <IconComponent
                          className={`w-5 h-5 ${
                            formData.unidad === unit.value
                              ? "text-primary-600"
                              : "text-neutral-500"
                          }`}
                        />
                      </div>
                      <span className="text-xs font-medium">{unit.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Switches */}
            <div className="flex gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.disponible}
                    onChange={(e) =>
                      setFormData({ ...formData, disponible: e.target.checked })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`
                    w-12 h-6 rounded-full transition-colors
                    ${formData.disponible ? "bg-green-500" : "bg-neutral-200"}
                  `}
                  >
                    <div
                      className={`
                      w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform
                      ${
                        formData.disponible
                          ? "translate-x-6"
                          : "translate-x-0.5"
                      }
                      absolute top-0.5
                    `}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-neutral-700">
                  Disponible
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.destacado}
                    onChange={(e) =>
                      setFormData({ ...formData, destacado: e.target.checked })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`
                    w-12 h-6 rounded-full transition-colors
                    ${formData.destacado ? "bg-accent-500" : "bg-neutral-200"}
                  `}
                  >
                    <div
                      className={`
                      w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform
                      ${
                        formData.destacado ? "translate-x-6" : "translate-x-0.5"
                      }
                      absolute top-0.5
                    `}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-neutral-700">
                  Destacado
                </span>
              </label>
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
              ? "Crear Producto"
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

export default ProductModal;
