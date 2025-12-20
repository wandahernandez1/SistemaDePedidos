import { useState, useEffect } from "react";
import {
  getAll,
  create,
  update,
  remove,
  TABLES as COLLECTIONS,
} from "../../supabase/supabaseService";
import { services as initialServices } from "../../data/services";
import "./Manager.css";

/**
 * Gestor de Servicios para Eventos
 */
const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "🍽️",
    features: [],
  });
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getAll(COLLECTIONS.SERVICES);

      if (data.length === 0) {
        const promises = initialServices.map((s) =>
          create(COLLECTIONS.SERVICES, s)
        );
        await Promise.all(promises);
        const newData = await getAll(COLLECTIONS.SERVICES);
        setServices(newData);
      } else {
        setServices(data);
      }
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      alert("Error al cargar servicios");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const serviceData = {
        ...formData,
        id: editingService?.id || Date.now(),
      };

      if (editingService) {
        await update(
          COLLECTIONS.SERVICES,
          editingService.firebaseId,
          serviceData
        );
      } else {
        await create(COLLECTIONS.SERVICES, serviceData);
      }

      await loadServices();
      resetForm();
      alert(editingService ? "Servicio actualizado" : "Servicio creado");
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      alert("Error al guardar servicio");
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      features: service.features || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (service) => {
    if (!window.confirm(`¿Eliminar "${service.title}"?`)) return;

    try {
      await remove(COLLECTIONS.SERVICES, service.firebaseId);
      await loadServices();
      alert("Servicio eliminado");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar servicio");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "🍽️",
      features: [],
    });
    setFeatureInput("");
    setEditingService(null);
    setShowForm(false);
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

  const commonIcons = ["🍽️", "☕", "🎉", "🎂", "🍕", "🥗", "🍰", "🥂"];

  if (loading) {
    return <div className="manager-loading">Cargando servicios...</div>;
  }

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Gestión de Servicios para Eventos</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancelar" : "+ Nuevo Servicio"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="manager-form">
          <div className="form-row">
            <div className="form-group" style={{ flex: 3 }}>
              <label>Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Icono</label>
              <select
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
              >
                {commonIcons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
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
            <label>Características</label>
            <div className="tags-input-container">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
                placeholder="Agregar característica y presionar Enter"
              />
              <button
                type="button"
                onClick={addFeature}
                className="btn-add-tag"
              >
                Agregar
              </button>
            </div>
            <ul className="features-list">
              {formData.features.map((feature, index) => (
                <li key={index}>
                  {feature}
                  <button type="button" onClick={() => removeFeature(feature)}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingService ? "Actualizar" : "Crear"}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="manager-list">
        {services.length === 0 ? (
          <p className="empty-message">No hay servicios configurados</p>
        ) : (
          services.map((service) => (
            <div key={service.firebaseId} className="manager-item service-item">
              <div className="service-icon">{service.icon}</div>
              <div className="item-info">
                <h3>{service.title}</h3>
                <p className="item-description">{service.description}</p>
                <ul className="item-features">
                  {service.features?.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
              <div className="item-actions">
                <button
                  onClick={() => handleEdit(service)}
                  className="btn-edit"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(service)}
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

export default ServiceManager;
