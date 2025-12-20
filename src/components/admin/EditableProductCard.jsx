import { useState } from "react";
import { uploadImage, validateImage } from "../../supabase/storageService";
import { formatPrice } from "../../utils/formatPrice";
import "../ProductCard.css";
import "./EditableCard.css";

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
      <div className="product-card editable-card">
        <div className="product-image-container">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="product-image"
            loading="lazy"
          />
          <span className="product-unit-badge">Por {product.unidad}</span>
          <div className="card-actions">
            <button
              className="btn-edit"
              onClick={() => setIsEditing(true)}
              title="Editar"
            >
              ✏️
            </button>
            <button
              className="btn-delete"
              onClick={handleDelete}
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.nombre}</h3>
          <p className="product-description">{product.descripcion}</p>

          <div className="product-footer">
            <span className="product-price">{formatPrice(product.precio)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card editable-card editing">
      <div className="product-image-container">
        <img
          src={formData.imagen}
          alt={formData.nombre}
          className="product-image"
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

      <div className="product-info edit-form">
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="edit-input edit-title"
          placeholder="Nombre del producto"
        />

        <textarea
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
          className="edit-textarea"
          placeholder="Descripción"
          rows="2"
        />

        <div className="edit-row">
          <div className="edit-group">
            <label className="edit-label">Categoría</label>
            <select
              value={formData.categoria}
              onChange={(e) =>
                setFormData({ ...formData, categoria: e.target.value })
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
          </div>

          <div className="edit-group">
            <label className="edit-label">Unidad</label>
            <select
              value={formData.unidad}
              onChange={(e) =>
                setFormData({ ...formData, unidad: e.target.value })
              }
              className="edit-select"
            >
              <option value="unidad">Unidad</option>
              <option value="docena">Docena</option>
              <option value="kg">Kilogramo</option>
              <option value="litro">Litro</option>
            </select>
          </div>
        </div>

        <div className="edit-group">
          <label className="edit-label">Precio</label>
          <input
            type="number"
            value={formData.precio}
            onChange={(e) =>
              setFormData({ ...formData, precio: e.target.value })
            }
            className="edit-input"
            placeholder="Precio"
            min="0"
            step="0.01"
          />
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

export default EditableProductCard;
