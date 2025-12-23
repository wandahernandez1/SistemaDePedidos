import { useState } from "react";
import { uploadImage, validateImage } from "../../supabase/storageService";

/**
 * Componente EditableServiceCard - Tarjeta de servicio editable (profesional)
 */
const EditableServiceCard = ({ service, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [formData, setFormData] = useState({
    title: service.title,
    description: service.description,
    icon: service.icon,
    image: service.image,
    features: service.features || [],
  });
  const [featureInput, setFeatureInput] = useState("");

  const iconMap = {
    lunch: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    ),
    breakfast: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" x2="6" y1="2" y2="4" />
        <line x1="10" x2="10" y1="2" y2="4" />
        <line x1="14" x2="14" y1="2" y2="4" />
      </svg>
    ),
    catering: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
        <path d="M8.5 8.5v.01" />
        <path d="M16 15.5v.01" />
        <path d="M12 12v.01" />
        <path d="M11 17v.01" />
        <path d="M7 14v.01" />
      </svg>
    ),
  };

  const renderIcon = () => {
    if (typeof service.icon === "string" && iconMap[service.icon]) {
      return iconMap[service.icon];
    }
    return iconMap["catering"];
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        validateImage(file);
        setUploading(true);
        const imageUrl = await uploadImage(file, "services");
        setFormData({ ...formData, image: imageUrl });
      } catch (error) {
        alert(error.message);
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    }
  };

  const handleSave = async () => {
    try {
      await onSave(service.id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      image: service.image,
      features: service.features || [],
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Eliminar "${service.title}"?`)) {
      try {
        await onDelete(service);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const addFeature = () => {
    if (
      featureInput.trim() &&
      !formData.features.includes(featureInput.trim())
    ) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput("");
    }
  };

  const removeFeature = (featureToRemove) => {
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== featureToRemove),
    });
  };

  if (!isEditing) {
    return (
      <div
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all duration-300 relative group hover:shadow-xl hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Icono */}
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-5 text-slate-700 transition-all duration-300 group-hover:bg-slate-800 group-hover:text-white">
          {renderIcon()}
        </div>

        {/* Botones de acción */}
        <div
          className={`
          absolute top-4 right-4 flex gap-2 transition-all duration-300
          ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }
        `}
        >
          <button
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer border border-slate-200 transition-all duration-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:scale-110"
            onClick={() => setIsEditing(true)}
            title="Editar"
          >
            <svg
              className="w-4 h-4"
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
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer border border-slate-200 transition-all duration-200 hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-110"
            onClick={handleDelete}
            title="Eliminar"
          >
            <svg
              className="w-4 h-4"
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

        {/* Contenido */}
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {service.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <ul className="space-y-2">
            {service.features.slice(0, 3).map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-2.5 text-slate-600 text-sm"
              >
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0"></span>
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
            {service.features.length > 3 && (
              <li className="text-slate-400 text-xs pl-4">
                +{service.features.length - 3} más
              </li>
            )}
          </ul>
        )}

        {/* Indicador de estado */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
      </div>
    );
  }

  // Modo edición
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-blue-500 transition-all duration-300 relative">
      <div className="flex flex-col gap-4">
        {/* Tipo de icono */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">
            Tipo de icono
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(iconMap).map(([key, icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFormData({ ...formData, icon: key })}
                className={`
                  p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-1
                  ${
                    formData.icon === key
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }
                `}
              >
                {icon}
                <span className="text-xs font-medium capitalize">{key}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">
            Título
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 font-medium transition-colors focus:outline-none focus:border-blue-500"
            placeholder="Título del servicio"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 transition-colors focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Descripción del servicio"
            rows={3}
          />
        </div>

        {/* Características */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">
            Características
          </label>
          {formData.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm"
                >
                  {feature}
                  <button
                    onClick={() => removeFeature(feature)}
                    className="w-4 h-4 rounded-full bg-slate-300 hover:bg-red-500 hover:text-white flex items-center justify-center text-xs border-none cursor-pointer transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addFeature())
              }
              placeholder="Agregar característica"
              className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-xl text-slate-800 transition-colors focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors border-none cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Imagen */}
        {formData.image && (
          <div className="rounded-xl overflow-hidden">
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-32 object-cover"
            />
          </div>
        )}
        <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl cursor-pointer font-medium transition-all hover:bg-slate-200">
          {uploading ? "Subiendo..." : "📷 Cambiar imagen"}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {/* Botones */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={uploading}
            className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-all border-none cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableServiceCard;
