import { useState, useEffect } from "react";
import { getConfig, updateConfig } from "../../supabase/supabaseService";

/**
 * Gestor de Configuración del Negocio - Diseño Profesional
 */
const ConfigManager = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    horario_apertura: "09:00",
    horario_cierre: "21:00",
    tiempo_demora: 30,
    telefono_whatsapp: "",
    mensaje_bienvenida: "",
    dias_laborales: [],
  });

  const diasSemana = [
    { value: "lunes", label: "Lun", fullLabel: "Lunes" },
    { value: "martes", label: "Mar", fullLabel: "Martes" },
    { value: "miércoles", label: "Mié", fullLabel: "Miércoles" },
    { value: "jueves", label: "Jue", fullLabel: "Jueves" },
    { value: "viernes", label: "Vie", fullLabel: "Viernes" },
    { value: "sábado", label: "Sáb", fullLabel: "Sábado" },
    { value: "domingo", label: "Dom", fullLabel: "Domingo" },
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
      setMessage({ text: "Error al cargar la configuración", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    const errors = [];
    if (!formData.telefono_whatsapp) errors.push("El teléfono de WhatsApp es obligatorio");
    if (formData.tiempo_demora < 0 || formData.tiempo_demora > 180) errors.push("El tiempo de demora debe estar entre 0 y 180 minutos");
    if (formData.horario_apertura >= formData.horario_cierre) errors.push("El horario de cierre debe ser posterior al de apertura");
    if (formData.dias_laborales.length === 0) errors.push("Debes seleccionar al menos un día laboral");

    if (errors.length > 0) {
      setMessage({ text: errors[0], type: "error" });
      return;
    }

    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      await updateConfig(formData);
      setMessage({ text: "Configuración guardada correctamente", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      setMessage({ text: "Error al guardar la configuración", type: "error" });
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
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header con mensaje */}
      {message.text && (
        <div className={`
          mb-6 px-5 py-4 rounded-xl flex items-center gap-3
          ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}
        `}>
          {message.type === 'success' ? (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Horarios */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Horarios de Atención</h3>
              <p className="text-sm text-slate-500">Configura los horarios de apertura y cierre</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Apertura</label>
              <input
                type="time"
                value={formData.horario_apertura}
                onChange={(e) => setFormData({ ...formData, horario_apertura: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cierre</label>
              <input
                type="time"
                value={formData.horario_cierre}
                onChange={(e) => setFormData({ ...formData, horario_cierre: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Días Laborales</label>
            <div className="flex flex-wrap gap-2">
              {diasSemana.map((dia) => (
                <button
                  key={dia.value}
                  type="button"
                  onClick={() => toggleDiaLaboral(dia.value)}
                  className={`
                    px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border-2 cursor-pointer
                    ${formData.dias_laborales.includes(dia.value)
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    }
                  `}
                >
                  <span className="hidden sm:inline">{dia.fullLabel}</span>
                  <span className="sm:hidden">{dia.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tiempo de Preparación */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Tiempo de Preparación</h3>
              <p className="text-sm text-slate-500">Tiempo estimado de preparación de pedidos</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              value={formData.tiempo_demora}
              onChange={(e) => setFormData({ ...formData, tiempo_demora: Number(e.target.value) })}
              min="5"
              max="120"
              step="5"
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
            />
            <div className="w-24 text-center">
              <span className="text-2xl font-bold text-slate-800">{formData.tiempo_demora}</span>
              <span className="text-sm text-slate-500 ml-1">min</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>5 min</span>
            <span>60 min</span>
            <span>120 min</span>
          </div>
        </div>

        {/* Contacto WhatsApp */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Contacto WhatsApp</h3>
              <p className="text-sm text-slate-500">Número para recibir pedidos</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Número de WhatsApp</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">+</span>
                <input
                  type="text"
                  value={formData.telefono_whatsapp}
                  onChange={(e) => setFormData({ ...formData, telefono_whatsapp: e.target.value })}
                  placeholder="549111234567"
                  className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">Formato internacional sin espacios. Ej: 5491112345678</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mensaje de Bienvenida</label>
              <textarea
                value={formData.mensaje_bienvenida}
                onChange={(e) => setFormData({ ...formData, mensaje_bienvenida: e.target.value })}
                rows={3}
                placeholder="¡Bienvenido a nuestro restaurante!"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Vista Previa */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Vista Previa
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Horario</p>
              <p className="font-semibold">{formData.horario_apertura} - {formData.horario_cierre}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Días</p>
              <p className="font-semibold">{formData.dias_laborales.length} días</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Demora</p>
              <p className="font-semibold">{formData.tiempo_demora} min</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">WhatsApp</p>
              <p className="font-semibold truncate">{formData.telefono_whatsapp || "No configurado"}</p>
            </div>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-slate-800 text-white rounded-xl font-semibold
              hover:bg-slate-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              border-none cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Guardar Configuración</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigManager;
