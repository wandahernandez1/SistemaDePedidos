import { useState } from "react";
import { uploadImage, validateImage } from "../../supabase/storageService";
import "../FoodCard.css";
import "./EditableCard.css";

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
      <div className="food-card editable-card">
        <div className="food-image-container">
          <img
            src={food.image}
            alt={food.name}
            className="food-image"
            loading="lazy"
          />
          {food.tags && food.tags.length > 0 && (
            <div className="food-tags">
              {food.tags.map((tag, index) => (
                <span key={index} className="food-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="card-actions">
            <button
              className="btn-edit"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              title="Editar"
            >
              Editar
            </button>
            <button
              className="btn-delete"
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

        <div className="food-content">
          <h3 className="food-name">{food.name}</h3>
          <p className="food-description">{food.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="food-card editable-card editing"
      onClick={() => onOpen && onOpen(food.category)}
      style={{ cursor: onOpen ? "pointer" : "default" }}
    >
      <div className="food-image-container">
        <img
          src={formData.image}
          alt={formData.name}
          className="food-image"
          loading="lazy"
        />
        <div className="image-upload-overlay">
          <label className="upload-label">
            {uploading ? "Subiendo..." : "📷 Cambiar imagen"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      <div className="food-content edit-form">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="edit-input edit-title"
          placeholder="Nombre del plato"
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

        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="edit-select"
        >
          <option value="hamburguesas">Hamburguesas</option>
          <option value="empanadas">Empanadas</option>
          <option value="pizzas">Pizzas</option>
          <option value="bebidas">Bebidas</option>
          <option value="postres">Postres</option>
          <option value="ensaladas">Ensaladas</option>
        </select>

        <div className="tags-editor">
          <div className="tags-list">
            {formData.tags.map((tag, index) => (
              <span key={index} className="tag-item">
                {tag}
                <button onClick={() => removeTag(tag)}>×</button>
              </span>
            ))}
          </div>
          <div className="tag-input-group">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
              placeholder="Agregar etiqueta"
              className="tag-input"
            />
            <button type="button" onClick={addTag} className="btn-add-tag">
              +
            </button>
          </div>
        </div>

        <div className="edit-actions">
          <button
            onClick={handleSave}
            className="btn-save"
            disabled={uploading}
          >
            ✓ Guardar
          </button>
          <button onClick={handleCancel} className="btn-cancel">
            ✕ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableFoodCard;
