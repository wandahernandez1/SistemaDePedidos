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
    return (
      <div className="text-center py-10 text-lg text-zinc-500">
        Cargando platos destacados...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-zinc-100">
        <h2 className="text-2xl font-bold text-zinc-800">
          Gestión de Platos Destacados
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-lg font-semibold cursor-pointer border-none text-sm transition-all duration-200 bg-zinc-800 text-white hover:bg-zinc-700 hover:-translate-y-0.5"
        >
          {showForm ? "Cancelar" : "+ Nuevo Plato"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-50 border-2 border-zinc-200 rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-zinc-700 text-sm">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-zinc-800"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-zinc-700 text-sm">
                Categoría *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                placeholder="ej: hamburguesas"
                className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-zinc-800"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="font-semibold text-zinc-700 text-sm">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows="3"
              className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm resize-y min-h-[80px] transition-colors duration-200 focus:outline-none focus:border-zinc-800"
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="font-semibold text-zinc-700 text-sm">
              Etiquetas
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Agregar etiqueta y presionar Enter"
                className="flex-1 px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-zinc-800"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-3 bg-zinc-800 text-white border-none rounded-lg cursor-pointer font-semibold transition-colors duration-200 hover:bg-zinc-700"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 bg-zinc-800 text-white px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="bg-transparent border-none text-white text-lg cursor-pointer p-0 w-5 h-5 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/20"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="font-semibold text-zinc-700 text-sm">
              Imagen {!editingFood && "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!editingFood}
              className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm"
            />
            <small className="text-zinc-500 text-xs">
              JPG, PNG o WEBP. Máximo 5MB
            </small>
          </div>

          {(formData.image || imageFile) && (
            <div className="mt-3 text-center">
              <img
                src={
                  imageFile ? URL.createObjectURL(imageFile) : formData.image
                }
                alt="Preview"
                className="max-w-[300px] max-h-[200px] rounded-lg border-2 border-zinc-200 object-cover mx-auto"
              />
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-5 border-t border-zinc-200">
            <button
              type="submit"
              className="px-5 py-3 rounded-lg font-semibold cursor-pointer border-none text-sm transition-all duration-200 bg-zinc-800 text-white hover:bg-zinc-700 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={uploading}
            >
              {uploading
                ? "Guardando..."
                : editingFood
                ? "Actualizar"
                : "Crear"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-3 rounded-lg font-semibold cursor-pointer border-none text-sm transition-all duration-200 bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-4">
        {foods.length === 0 ? (
          <p className="text-center py-10 text-zinc-400 text-base">
            No hay platos destacados
          </p>
        ) : (
          foods.map((food) => (
            <div
              key={food.firebaseId}
              className="flex gap-4 p-4 bg-white border-2 border-zinc-200 rounded-xl transition-all duration-200 hover:border-zinc-800 hover:shadow-lg flex-wrap md:flex-nowrap"
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-full md:w-[120px] h-auto md:h-[120px] object-cover rounded-lg shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-800 mb-2">
                  {food.name}
                </h3>
                <span className="inline-block bg-zinc-800 text-white px-3 py-1 rounded-xl text-xs font-semibold mb-2 capitalize">
                  {food.category}
                </span>
                <p className="text-zinc-500 text-sm leading-relaxed mb-2">
                  {food.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {food.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-zinc-100 text-zinc-600 text-xs px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-2 justify-center w-full md:w-auto">
                <button
                  onClick={() => handleEdit(food)}
                  className="flex-1 md:flex-none px-5 py-2.5 rounded-lg font-semibold cursor-pointer border-none text-sm transition-all duration-200 bg-emerald-500 text-white min-w-[100px] hover:bg-emerald-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(food)}
                  className="flex-1 md:flex-none px-5 py-2.5 rounded-lg font-semibold cursor-pointer border-none text-sm transition-all duration-200 bg-red-500 text-white min-w-[100px] hover:bg-red-600"
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
