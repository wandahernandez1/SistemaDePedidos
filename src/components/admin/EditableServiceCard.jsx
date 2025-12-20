import { useState } from "react";
import { uploadImage, validateImage } from "../../supabase/storageService";
import "../ServiceCard.css";
import "./EditableCard.css";

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

  // Mapa de iconos profesionales (igual que ServiceCard)
  const iconMap = {
    lunch: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
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
      <div className="service-card editable-card">
        <div className="service-icon">{renderIcon()}</div>
        <div className="card-actions">
          <button
            className="btn-edit"
            onClick={() => setIsEditing(true)}
            title="Editar"
          >
            Editar
          </button>
          <button
            className="btn-delete"
            onClick={handleDelete}
            title="Eliminar"
          >
            Eliminar
          </button>
        </div>
        <h3 className="service-title">{service.title}</h3>
        <p className="service-description">{service.description}</p>
        {service.features && service.features.length > 0 && (
          <ul className="service-features">
            {service.features.map((feature, index) => (
              <li key={index} className="service-feature">
                <span className="feature-bullet"></span>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="service-card editable-card editing">
      <div className="edit-form">
        <div className="edit-group">
          <label className="edit-label">Tipo de icono</label>
          <select
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="edit-input"
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
          className="edit-input edit-title"
          placeholder="Título del servicio"
        />

        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="edit-textarea"
          placeholder="Descripción"
          rows="3"
        />

        <div className="features-editor">
          <label className="edit-label">Características</label>
          <div className="features-list">
            {formData.features.map((feature, index) => (
              <div key={index} className="feature-item">
                <span>{feature}</span>
                <button onClick={() => removeFeature(feature)}>×</button>
              </div>
            ))}
          </div>
          <div className="feature-input-group">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addFeature())
              }
              placeholder="Agregar característica"
              className="edit-input"
            />
            <button
              type="button"
              onClick={addFeature}
              className="btn-add-feature"
            >
              +
            </button>
          </div>
        </div>

        {formData.image && (
          <div className="service-image-preview">
            <img src={formData.image} alt="Preview" />
          </div>
        )}

        <div className="image-upload-group">
          <label className="upload-label">
            {uploading ? "Subiendo..." : "Cambiar imagen"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div className="edit-actions">
          <button
            onClick={handleSave}
            className="btn-save"
            disabled={uploading}
          >
            Guardar
          </button>
          <button onClick={handleCancel} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableServiceCard;
