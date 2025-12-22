import { useState } from "react";
import { uploadImage, validateImage } from "../../supabase/storageService";

/**
 * Componente EditableServiceCard - Tarjeta de servicio editable
 */
const EditableServiceCard = ({ service, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
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
        className="w-8 h-8"
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
        className="w-8 h-8"
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
        className="w-8 h-8"
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
      await onSave(service.id, formData);
      setIsEditing(false);
      alert("Servicio actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los cambios");
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
        alert("Servicio eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar el servicio");
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
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-200 transition-all duration-300 relative group hover:shadow-lg hover:-translate-y-1">
        <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 text-zinc-700 transition-all duration-300 group-hover:bg-zinc-800 group-hover:text-white">
          {renderIcon()}
        </div>
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            className="bg-white/95 border-none rounded-lg px-3 py-2 cursor-pointer text-sm font-medium shadow-lg transition-all duration-200 hover:bg-blue-500 hover:text-white hover:scale-105"
            onClick={() => setIsEditing(true)}
            title="Editar"
          >
            Editar
          </button>
          <button
            className="bg-white/95 border-none rounded-lg px-3 py-2 cursor-pointer text-sm font-medium shadow-lg transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-105"
            onClick={handleDelete}
            title="Eliminar"
          >
            Eliminar
          </button>
        </div>
        <h3 className="text-xl font-semibold text-zinc-800 mb-3">
          {service.title}
        </h3>
        <p className="text-zinc-500 text-sm leading-relaxed mb-5">
          {service.description}
        </p>
        {service.features && service.features.length > 0 && (
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {service.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-2.5 text-zinc-600 text-sm"
              >
                <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full flex-shrink-0"></span>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-500 transition-all duration-300 relative">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-zinc-500 mb-1.5 uppercase">
            Tipo de icono
          </label>
          <select
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-3 py-2.5 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="lunch">Lunch</option>
            <option value="breakfast">Desayuno</option>
            <option value="catering">Catering</option>
          </select>
        </div>

        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2.5 border-2 border-zinc-200 rounded-lg text-lg font-semibold transition-colors duration-200 focus:outline-none focus:border-emerald-500"
          placeholder="Título del servicio"
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

        <div className="mb-3">
          <label className="text-xs font-semibold text-zinc-500 mb-1.5 uppercase block">
            Características
          </label>
          <div className="flex flex-col gap-2 mb-2">
            {formData.features.map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-100 px-3 py-2.5 rounded-lg flex justify-between items-center text-sm"
              >
                <span>{feature}</span>
                <button
                  onClick={() => removeFeature(feature)}
                  className="bg-red-500 text-white border-none w-6 h-6 rounded-full text-base cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addFeature())
              }
              placeholder="Agregar característica"
              className="flex-1 px-3 py-2.5 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-emerald-500 text-white border-none rounded-lg px-4 py-2.5 text-lg font-bold cursor-pointer transition-all duration-200 hover:bg-emerald-600 hover:scale-105"
            >
              +
            </button>
          </div>
        </div>

        {formData.image && (
          <div className="rounded-lg overflow-hidden mb-3">
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-36 object-cover"
            />
          </div>
        )}

        <div className="mb-3">
          <label className="bg-white text-zinc-700 px-4 py-2.5 rounded-lg cursor-pointer font-medium transition-all duration-200 flex items-center justify-center gap-2 border-2 border-zinc-200 w-full hover:bg-emerald-500 hover:text-white hover:border-emerald-500">
            {uploading ? "Subiendo..." : "Cambiar imagen"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSave}
            className="flex-1 py-3 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-emerald-500 text-white hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg disabled:bg-zinc-300 disabled:cursor-not-allowed"
            disabled={uploading}
          >
            Guardar
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 py-3 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableServiceCard;
