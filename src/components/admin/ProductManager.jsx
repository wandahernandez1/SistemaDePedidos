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
import "./Manager.css";

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

  // Formulario
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

      // Si no hay productos, inicializar con datos locales
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

      // Si hay nueva imagen, subirla
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

      // Eliminar imagen si es de Firebase Storage
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
    return <div className="manager-loading">Cargando productos...</div>;
  }

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Gestión de Productos</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancelar" : "+ Nuevo Producto"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="manager-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <select
                value={formData.categoria}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
                required
              >
                <option value="hamburguesas">Hamburguesas</option>
                <option value="empanadas">Empanadas</option>
                <option value="pizzas">Pizzas</option>
                <option value="bebidas">Bebidas</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              required
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio *</label>
              <input
                type="number"
                value={formData.precio}
                onChange={(e) =>
                  setFormData({ ...formData, precio: e.target.value })
                }
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Unidad *</label>
              <select
                value={formData.unidad}
                onChange={(e) =>
                  setFormData({ ...formData, unidad: e.target.value })
                }
                required
              >
                <option value="unidad">Unidad</option>
                <option value="docena">Docena</option>
                <option value="kg">Kilogramo</option>
                <option value="litro">Litro</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Imagen {!editingProduct && "*"}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!editingProduct}
            />
            <small>JPG, PNG o WEBP. Máximo 5MB</small>
          </div>

          {(formData.imagen || imageFile) && (
            <div className="image-preview">
              <img
                src={
                  imageFile ? URL.createObjectURL(imageFile) : formData.imagen
                }
                alt="Preview"
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading
                ? "Guardando..."
                : editingProduct
                ? "Actualizar"
                : "Crear"}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="manager-filter">
        <label>Filtrar por categoría:</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="manager-list">
        {filteredProducts.length === 0 ? (
          <p className="empty-message">No hay productos para mostrar</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.firebaseId} className="manager-item">
              <img src={product.imagen} alt={product.nombre} />
              <div className="item-info">
                <h3>{product.nombre}</h3>
                <p className="item-category">{product.categoria}</p>
                <p className="item-description">{product.descripcion}</p>
                <p className="item-price">
                  ${product.precio.toLocaleString("es-AR")}/{product.unidad}
                </p>
              </div>
              <div className="item-actions">
                <button
                  onClick={() => handleEdit(product)}
                  className="btn-edit"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product)}
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

export default ProductManager;
