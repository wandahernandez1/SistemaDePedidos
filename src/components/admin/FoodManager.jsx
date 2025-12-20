import { useState, useEffect } from "react";
import {
  getAll,
  create,
  update,
  remove,
  TABLES as COLLECTIONS,
} from "../../supabase/supabaseService";
import {
  uploadImage,
  deleteImage,
  validateImage,
} from "../../supabase/storageService";
import { featuredFoods as initialFoods } from "../../data/foods";
import "./Manager.css";

/**
 * Gestor de Platos Destacados
 */
const FoodManager = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFood, setEditingFood] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
    tags: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const data = await getAll(COLLECTIONS.FOODS);

      if (data.length === 0) {
        const promises = initialFoods.map((f) => create(COLLECTIONS.FOODS, f));
        await Promise.all(promises);
        const newData = await getAll(COLLECTIONS.FOODS);
        setFoods(newData);
      } else {
        setFoods(data);
      }
    } catch (error) {
      console.error("Error al cargar platos:", error);
      alert("Error al cargar platos destacados");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        validateImage(imageFile);
        imageUrl = await uploadImage(imageFile, "foods");
      }

      const foodData = {
        ...formData,
        image: imageUrl,
        id: editingFood?.id || Date.now(),
      };

      if (editingFood) {
        await update(COLLECTIONS.FOODS, editingFood.firebaseId, foodData);
      } else {
        await create(COLLECTIONS.FOODS, foodData);
      }

      await loadFoods();
      resetForm();
      alert(editingFood ? "Plato actualizado" : "Plato creado");
    } catch (error) {
      console.error("Error al guardar plato:", error);
      alert(error.message || "Error al guardar plato");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      category: food.category,
      image: food.image,
      tags: food.tags || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (food) => {
    if (!window.confirm(`¿Eliminar "${food.name}"?`)) return;

    try {
      await remove(COLLECTIONS.FOODS, food.firebaseId);

      if (food.image.includes("firebasestorage")) {
        await deleteImage(food.image);
      }

      await loadFoods();
      alert("Plato eliminado");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar plato");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      image: "",
      tags: [],
    });
    setImageFile(null);
    setTagInput("");
    setEditingFood(null);
    setShowForm(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        validateImage(file);
        setImageFile(file);
      } catch (error) {
        alert(error.message);
        e.target.value = "";
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

  if (loading) {
    return <div className="manager-loading">Cargando platos destacados...</div>;
  }

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Gestión de Platos Destacados</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancelar" : "+ Nuevo Plato"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="manager-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                placeholder="ej: hamburguesas"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Etiquetas</label>
            <div className="tags-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Agregar etiqueta y presionar Enter"
              />
              <button type="button" onClick={addTag} className="btn-add-tag">
                Agregar
              </button>
            </div>
            <div className="tags-list">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Imagen {!editingFood && "*"}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!editingFood}
            />
            <small>JPG, PNG o WEBP. Máximo 5MB</small>
          </div>

          {(formData.image || imageFile) && (
            <div className="image-preview">
              <img
                src={
                  imageFile ? URL.createObjectURL(imageFile) : formData.image
                }
                alt="Preview"
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading
                ? "Guardando..."
                : editingFood
                ? "Actualizar"
                : "Crear"}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="manager-list">
        {foods.length === 0 ? (
          <p className="empty-message">No hay platos destacados</p>
        ) : (
          foods.map((food) => (
            <div key={food.firebaseId} className="manager-item">
              <img src={food.image} alt={food.name} />
              <div className="item-info">
                <h3>{food.name}</h3>
                <p className="item-category">{food.category}</p>
                <p className="item-description">{food.description}</p>
                <div className="item-tags">
                  {food.tags?.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(food)} className="btn-edit">
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(food)}
                  className="btn-delete"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodManager;
