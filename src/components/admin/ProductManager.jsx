import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { products as initialProducts } from "../../data/products";

/**
 * Gestor de Productos (Hamburguesas, Empanadas, Pizzas, etc.)
 */
const ProductManager = () => {
  const { categoria } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState(categoria || "all");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "hamburguesas",
    precio: 0,
    imagen: "",
    unidad: "unidad",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (categoria) {
      setFilterCategory(categoria);
    }
  }, [categoria]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAll(COLLECTIONS.PRODUCTS);

      if (data.length === 0) {
        const promises = initialProducts.map((p) =>
          create(COLLECTIONS.PRODUCTS, p)
        );
        await Promise.all(promises);
        const newData = await getAll(COLLECTIONS.PRODUCTS);
        setProducts(newData);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      alert("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.imagen;

      if (imageFile) {
        validateImage(imageFile);
        imageUrl = await uploadImage(imageFile, "products");
      }

      const productData = {
        ...formData,
        imagen: imageUrl,
        precio: Number(formData.precio),
        id: editingProduct?.id || Date.now(),
      };

      if (editingProduct) {
        await update(
          COLLECTIONS.PRODUCTS,
          editingProduct.firebaseId,
          productData
        );
      } else {
        await create(COLLECTIONS.PRODUCTS, productData);
      }

      await loadProducts();
      resetForm();
      alert(editingProduct ? "Producto actualizado" : "Producto creado");
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert(error.message || "Error al guardar producto");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      categoria: product.categoria,
      precio: product.precio,
      imagen: product.imagen,
      unidad: product.unidad,
    });
    setShowForm(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.nombre}"?`)) return;

    try {
      await remove(COLLECTIONS.PRODUCTS, product.firebaseId);

      if (product.imagen.includes("firebasestorage")) {
        await deleteImage(product.imagen);
      }

      await loadProducts();
      alert("Producto eliminado");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar producto");
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      categoria: "hamburguesas",
      precio: 0,
      imagen: "",
      unidad: "unidad",
    });
    setImageFile(null);
    setEditingProduct(null);
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

  const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "hamburguesas", label: "Hamburguesas" },
    { value: "empanadas", label: "Empanadas" },
    { value: "pizzas", label: "Pizzas" },
    { value: "bebidas", label: "Bebidas" },
  ];

  const filteredProducts =
    filterCategory === "all"
      ? products
      : products.filter((p) => p.categoria === filterCategory);

  if (loading) {
    return (
      <div className="text-center py-10 text-lg text-zinc-500">
        Cargando productos...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-zinc-100">
        <h2 className="text-2xl font-bold text-zinc-800">
          Gestión de Productos
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-lg font-semibold cursor-pointer border-none text-sm transition-all duration-200 bg-zinc-800 text-white hover:bg-zinc-700 hover:-translate-y-0.5"
        >
          {showForm ? "Cancelar" : "+ Nuevo Producto"}
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
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
                className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-zinc-800"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-zinc-700 text-sm">
                Categoría *
              </label>
              <select
                value={formData.categoria}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
                required
                className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-zinc-800"
              >
                <option value="hamburguesas">Hamburguesas</option>
                <option value="empanadas">Empanadas</option>
                <option value="pizzas">Pizzas</option>
                <option value="bebidas">Bebidas</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="font-semibold text-zinc-700 text-sm">
              Descripción *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              required
              rows="3"
              className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm resize-y min-h-[80px] transition-colors duration-200 focus:outline-none focus:border-zinc-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-zinc-700 text-sm">
                Precio *
              </label>
              <input
                type="number"
                value={formData.precio}
                onChange={(e) =>
                  setFormData({ ...formData, precio: e.target.value })
                }
                required
                min="0"
                step="0.01"
                className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-zinc-800"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-zinc-700 text-sm">
                Unidad *
              </label>
              <select
                value={formData.unidad}
                onChange={(e) =>
                  setFormData({ ...formData, unidad: e.target.value })
                }
                required
                className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-zinc-800"
              >
                <option value="unidad">Unidad</option>
                <option value="docena">Docena</option>
                <option value="kg">Kilogramo</option>
                <option value="litro">Litro</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="font-semibold text-zinc-700 text-sm">
              Imagen {!editingProduct && "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!editingProduct}
              className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm"
            />
            <small className="text-zinc-500 text-xs">
              JPG, PNG o WEBP. Máximo 5MB
            </small>
          </div>

          {(formData.imagen || imageFile) && (
            <div className="mt-3 text-center">
              <img
                src={
                  imageFile ? URL.createObjectURL(imageFile) : formData.imagen
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
                : editingProduct
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

      <div className="flex items-center gap-3 mb-5 p-4 bg-zinc-50 rounded-lg">
        <label className="font-semibold text-zinc-700">
          Filtrar por categoría:
        </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border-2 border-zinc-200 rounded-lg text-sm cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {filteredProducts.length === 0 ? (
          <p className="text-center py-10 text-zinc-400 text-base">
            No hay productos para mostrar
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.firebaseId}
              className="flex gap-4 p-4 bg-white border-2 border-zinc-200 rounded-xl transition-all duration-200 hover:border-zinc-800 hover:shadow-lg flex-wrap md:flex-nowrap"
            >
              <img
                src={product.imagen}
                alt={product.nombre}
                className="w-full md:w-[120px] h-auto md:h-[120px] object-cover rounded-lg shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-800 mb-2">
                  {product.nombre}
                </h3>
                <span className="inline-block bg-zinc-800 text-white px-3 py-1 rounded-xl text-xs font-semibold mb-2 capitalize">
                  {product.categoria}
                </span>
                <p className="text-zinc-500 text-sm leading-relaxed mb-2">
                  {product.descripcion}
                </p>
                <p className="text-lg font-bold text-zinc-800">
                  ${product.precio.toLocaleString("es-AR")}/{product.unidad}
                </p>
              </div>
              <div className="flex flex-row md:flex-col gap-2 justify-center w-full md:w-auto">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 md:flex-none px-5 py-2.5 rounded-lg font-semibold cursor-pointer border-none text-sm transition-all duration-200 bg-emerald-500 text-white min-w-[100px] hover:bg-emerald-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product)}
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

export default ProductManager;
