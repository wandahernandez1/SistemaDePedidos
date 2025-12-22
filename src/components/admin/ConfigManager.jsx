import { useState, useEffect } from "react";
import { getConfig, updateConfig } from "../../supabase/supabaseService";

/**
 * Gestor de Configuración del Negocio
 * Horarios, demora, teléfono, etc.
 */
const ConfigManager = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    horario_apertura: "09:00",
    horario_cierre: "21:00",
    tiempo_demora: 30,
    telefono_whatsapp: "",
    mensaje_bienvenida: "",
    dias_laborales: [],
  });

  const diasSemana = [
    { value: "lunes", label: "Lunes" },
    { value: "martes", label: "Martes" },
    { value: "miércoles", label: "Miércoles" },
    { value: "jueves", label: "Jueves" },
    { value: "viernes", label: "Viernes" },
    { value: "sábado", label: "Sábado" },
    { value: "domingo", label: "Domingo" },
  ];

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await getConfig();
      setConfig(data);
      setFormData({
        horario_apertura: data.horario_apertura || "09:00",
        horario_cierre: data.horario_cierre || "21:00",
        tiempo_demora: data.tiempo_demora || 30,
        telefono_whatsapp: data.telefono_whatsapp || "",
        mensaje_bienvenida: data.mensaje_bienvenida || "",
        dias_laborales: data.dias_laborales || [],
      });
    } catch (error) {
      console.error("Error al cargar configuración:", error);
      setMessage("Error al cargar la configuración");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.telefono_whatsapp) {
      setMessage("El teléfono de WhatsApp es obligatorio");
      return;
    }

    if (formData.tiempo_demora < 0 || formData.tiempo_demora > 180) {
      setMessage("El tiempo de demora debe estar entre 0 y 180 minutos");
      return;
    }

    if (formData.horario_apertura >= formData.horario_cierre) {
      setMessage("El horario de cierre debe ser posterior al de apertura");
      return;
    }

    if (formData.dias_laborales.length === 0) {
      setMessage("Debes seleccionar al menos un día laboral");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await updateConfig(formData);
      setMessage("✅ Configuración actualizada correctamente");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      setMessage("❌ Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const toggleDiaLaboral = (dia) => {
    setFormData((prev) => {
      const dias = prev.dias_laborales.includes(dia)
        ? prev.dias_laborales.filter((d) => d !== dia)
        : [...prev.dias_laborales, dia];
      return { ...prev, dias_laborales: dias };
    });
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-lg text-zinc-500">
        Cargando configuración...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-zinc-100">
        <h2 className="text-2xl font-bold text-zinc-800">
          Configuración del Negocio
        </h2>
        <div className="flex items-center">
          {message && (
            <span
              className={`font-semibold text-sm ${
                message.includes("✅") ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {message}
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white">
        {/* Horarios */}
        <div className="mb-8 p-5 bg-zinc-50 rounded-xl border-2 border-zinc-200">
          <h3 className="text-zinc-800 mb-4 text-lg font-semibold">
            ⏰ Horarios de Atención
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-zinc-700 text-sm">
                Horario de Apertura *
              </label>
              <input
                type="time"
                value={formData.horario_apertura}
                onChange={(e) =>
                  setFormData({ ...formData, horario_apertura: e.target.value })
                }
                required
                className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-zinc-800"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-zinc-700 text-sm">
                Horario de Cierre *
              </label>
              <input
                type="time"
                value={formData.horario_cierre}
                onChange={(e) =>
                  setFormData({ ...formData, horario_cierre: e.target.value })
                }
                required
                className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-zinc-800"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-zinc-700 text-sm">
              Días Laborales *
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {diasSemana.map((dia) => (
                <button
                  key={dia.value}
                  type="button"
                  className={`px-4 py-2.5 border-2 rounded-lg cursor-pointer font-semibold transition-all duration-200 ${
                    formData.dias_laborales.includes(dia.value)
                      ? "bg-zinc-800 text-white border-zinc-800"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-800 hover:-translate-y-0.5"
                  }`}
                  onClick={() => toggleDiaLaboral(dia.value)}
                >
                  {dia.label}
                </button>
              ))}
            </div>
            <small className="text-zinc-500 text-xs">
              Selecciona los días en que el negocio está abierto
            </small>
          </div>
        </div>

        {/* Demora */}
        <div className="mb-8 p-5 bg-zinc-50 rounded-xl border-2 border-zinc-200">
          <h3 className="text-zinc-800 mb-4 text-lg font-semibold">
            🕒 Tiempo de Preparación
          </h3>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-zinc-700 text-sm">
              Tiempo de Demora (minutos) *
            </label>
            <input
              type="number"
              value={formData.tiempo_demora}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tiempo_demora: Number(e.target.value),
                })
              }
              required
              min="0"
              max="180"
              step="5"
              className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-zinc-800"
            />
            <small className="text-zinc-500 text-xs">
              Tiempo estimado de preparación de los pedidos
            </small>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="mb-8 p-5 bg-zinc-50 rounded-xl border-2 border-zinc-200">
          <h3 className="text-zinc-800 mb-4 text-lg font-semibold">
            📱 Contacto
          </h3>

          <div className="flex flex-col gap-2 mb-4">
            <label className="font-semibold text-zinc-700 text-sm">
              Teléfono WhatsApp *
            </label>
            <input
              type="text"
              value={formData.telefono_whatsapp}
              onChange={(e) =>
                setFormData({ ...formData, telefono_whatsapp: e.target.value })
              }
              required
              placeholder="549111234567"
              className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:border-zinc-800"
            />
            <small className="text-zinc-500 text-xs">
              Formato internacional sin espacios ni guiones. Ej: 5491112345678
            </small>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-zinc-700 text-sm">
              Mensaje de Bienvenida
            </label>
            <textarea
              value={formData.mensaje_bienvenida}
              onChange={(e) =>
                setFormData({ ...formData, mensaje_bienvenida: e.target.value })
              }
              rows="3"
              placeholder="¡Bienvenido a La Cocina de Lau!"
              className="px-3 py-3 border-2 border-zinc-200 rounded-lg text-sm resize-y min-h-[80px] transition-colors duration-200 focus:outline-none focus:border-zinc-800"
            />
            <small className="text-zinc-500 text-xs">
              Mensaje que aparece al inicio de la tienda
            </small>
          </div>
        </div>

        {/* Vista Previa */}
        <div className="mb-8 p-5 bg-blue-50 rounded-xl border-2 border-zinc-800">
          <h3 className="text-zinc-800 mb-4 text-lg font-semibold">
            👀 Vista Previa
          </h3>
          <div className="p-4 bg-white rounded-lg text-sm">
            <p className="my-2 text-zinc-700">
              <strong className="text-zinc-800">Horario:</strong>{" "}
              {formData.horario_apertura} a {formData.horario_cierre}
            </p>
            <p className="my-2 text-zinc-700">
              <strong className="text-zinc-800">Días:</strong>{" "}
              {formData.dias_laborales.length > 0
                ? formData.dias_laborales
                    .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
                    .join(", ")
                : "No seleccionados"}
            </p>
            <p className="my-2 text-zinc-700">
              <strong className="text-zinc-800">Demora:</strong>{" "}
              {formData.tiempo_demora} minutos
            </p>
            <p className="my-2 text-zinc-700">
              <strong className="text-zinc-800">WhatsApp:</strong>{" "}
              {formData.telefono_whatsapp || "No configurado"}
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-6 pt-5 border-t border-zinc-200">
          <button
            type="submit"
            className="px-5 py-3 rounded-lg font-semibold cursor-pointer border-none text-sm transition-all duration-200 bg-zinc-800 text-white hover:bg-zinc-700 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={saving}
          >
            {saving ? "Guardando..." : "💾 Guardar Configuración"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigManager;
