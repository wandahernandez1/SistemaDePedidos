import { useState, useEffect } from "react";
import {
  getAll,
  create,
  update,
  remove,
  TABLES as COLLECTIONS,
} from "../../supabase/supabaseService";
import { services as initialServices } from "../../data/services";

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
    return (
      <div className="text-center py-10 text-lg text-neutral-500">
        Cargando servicios...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-neutral-100">
        <h2 className="text-2xl font-bold text-neutral-800">
          Gestión de Servicios para Eventos
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-lg font-semibold cursor-pointer border-none text-sm transition-all duration-200 bg-primary-500 text-white hover:bg-primary-600 hover:-translate-y-0.5"
        >
          {showForm ? "Cancelar" : "+ Nuevo Servicio"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[3fr_1fr] gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-neutral-700 text-sm">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="px-3 py-3 border-2 border-neutral-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-neutral-700 text-sm">
                Icono
              </label>
              <select
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="px-3 py-3 border-2 border-neutral-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-primary-500"
              >
                {commonIcons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="font-semibold text-neutral-700 text-sm">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows="3"
              className="px-3 py-3 border-2 border-neutral-200 rounded-lg text-sm resize-y min-h-[80px] transition-colors duration-200 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="font-semibold text-neutral-700 text-sm">
              Características
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
                placeholder="Agregar característica y presionar Enter"
                className="flex-1 px-3 py-3 border-2 border-neutral-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-primary-500"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-3 bg-primary-500 text-white border-none rounded-lg cursor-pointer font-semibold transition-colors duration-200 hover:bg-primary-600"
              >
                Agregar
              </button>
            </div>
            <ul className="list-none p-0 mt-3">
              {formData.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2.5 px-3 bg-white border border-neutral-200 rounded-lg mb-2"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="bg-red-500 text-white border-none w-6 h-6 rounded-full cursor-pointer text-base transition-colors duration-200 hover:bg-red-600"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 mt-6 pt-5 border-t border-neutral-200">
            <button
              type="submit"
              className="px-5 py-3 rounded-lg font-semibold cursor-pointer border-none text-sm transition-all duration-200 bg-primary-500 text-white hover:bg-primary-600 hover:-translate-y-0.5"
            >
              {editingService ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-3 rounded-lg font-semibold cursor-pointer border-none text-sm transition-all duration-200 bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-4">
        {services.length === 0 ? (
          <p className="text-center py-10 text-neutral-400 text-base">
            No hay servicios configurados
          </p>
        ) : (
          services.map((service) => (
            <div
              key={service.firebaseId}
              className="flex gap-4 p-4 bg-white border-2 border-neutral-200 rounded-xl transition-all duration-200 hover:border-primary-500 hover:shadow-lg flex-wrap md:flex-nowrap items-start"
            >
              <div className="text-5xl w-20 h-20 flex items-center justify-center bg-neutral-100 rounded-xl shrink-0">
                {service.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-2">
                  {service.description}
                </p>
                <ul className="list-none p-0 m-0">
                  {service.features?.map((feature, index) => (
                    <li key={index} className="text-neutral-600 text-sm mb-1">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-row md:flex-col gap-2 justify-center w-full md:w-auto">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 md:flex-none px-5 py-2.5 rounded-lg font-semibold cursor-pointer border-none text-sm transition-all duration-200 bg-primary-500 text-white min-w-[100px] hover:bg-primary-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(service)}
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

export default ServiceManager;
