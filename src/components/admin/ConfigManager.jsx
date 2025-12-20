import { useState, useEffect } from "react";
import { getConfig, updateConfig } from "../../supabase/supabaseService";
import "./Manager.css";

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

    // Validaciones
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
    return <div className="manager-loading">Cargando configuración...</div>;
  }

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Configuración del Negocio</h2>
        <div className="config-status">
          {message && (
            <span
              className={
                message.includes("✅") ? "success-message" : "error-message"
              }
            >
              {message}
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="manager-form config-form">
        {/* Horarios */}
        <div className="config-section">
          <h3>⏰ Horarios de Atención</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Horario de Apertura *</label>
              <input
                type="time"
                value={formData.horario_apertura}
                onChange={(e) =>
                  setFormData({ ...formData, horario_apertura: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Horario de Cierre *</label>
              <input
                type="time"
                value={formData.horario_cierre}
                onChange={(e) =>
                  setFormData({ ...formData, horario_cierre: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Días Laborales *</label>
            <div className="dias-selector">
              {diasSemana.map((dia) => (
                <button
                  key={dia.value}
                  type="button"
                  className={`dia-button ${
                    formData.dias_laborales.includes(dia.value) ? "active" : ""
                  }`}
                  onClick={() => toggleDiaLaboral(dia.value)}
                >
                  {dia.label}
                </button>
              ))}
            </div>
            <small>Selecciona los días en que el negocio está abierto</small>
          </div>
        </div>

        {/* Demora */}
        <div className="config-section">
          <h3>🕒 Tiempo de Preparación</h3>

          <div className="form-group">
            <label>Tiempo de Demora (minutos) *</label>
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
            />
            <small>Tiempo estimado de preparación de los pedidos</small>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="config-section">
          <h3>📱 Contacto</h3>

          <div className="form-group">
            <label>Teléfono WhatsApp *</label>
            <input
              type="text"
              value={formData.telefono_whatsapp}
              onChange={(e) =>
                setFormData({ ...formData, telefono_whatsapp: e.target.value })
              }
              required
              placeholder="549111234567"
            />
            <small>
              Formato internacional sin espacios ni guiones. Ej: 5491112345678
            </small>
          </div>

          <div className="form-group">
            <label>Mensaje de Bienvenida</label>
            <textarea
              value={formData.mensaje_bienvenida}
              onChange={(e) =>
                setFormData({ ...formData, mensaje_bienvenida: e.target.value })
              }
              rows="3"
              placeholder="¡Bienvenido a La Cocina de Lau!"
            />
            <small>Mensaje que aparece al inicio de la tienda</small>
          </div>
        </div>

        {/* Vista Previa */}
        <div className="config-section preview-section">
          <h3>👀 Vista Previa</h3>
          <div className="config-preview">
            <p>
              <strong>Horario:</strong> {formData.horario_apertura} a{" "}
              {formData.horario_cierre}
            </p>
            <p>
              <strong>Días:</strong>{" "}
              {formData.dias_laborales.length > 0
                ? formData.dias_laborales
                    .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
                    .join(", ")
                : "No seleccionados"}
            </p>
            <p>
              <strong>Demora:</strong> {formData.tiempo_demora} minutos
            </p>
            <p>
              <strong>WhatsApp:</strong>{" "}
              {formData.telefono_whatsapp || "No configurado"}
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "💾 Guardar Configuración"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigManager;
