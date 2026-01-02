import {
  Phone,
  Clock,
  Instagram,
  MessageCircle,
  Truck,
  Store,
  MapPin,
  Heart,
} from "lucide-react";
import { useRealTimeSchedules } from "../shared/hooks/useRealTimeSchedules";

/**
 * Componente Footer - Pie de página profesional y minimalista
 * Los horarios se actualizan automáticamente desde la configuración
 * Diseño optimizado para dark/light mode con alto contraste
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { config, schedules } = useRealTimeSchedules();

  /**
   * Generar horarios dinámicos basados en la configuración
   */
  const getScheduleDisplay = () => {
    if (!config || !schedules) {
      return [{ label: "Lunes - Domingo", hours: "19:00 - 22:00" }];
    }

    // Si hay configuración específica, usar horario general de apertura y cierre
    if (config.horario_apertura && config.horario_cierre) {
      // Obtener días laborales de la configuración
      const workingDays = config.dias_laborales || [
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
      ];

      // Formatear días laborales para mostrar
      const formatDays = (days) => {
        if (
          days.length === 7 ||
          (days.length === 6 && !days.includes("domingo"))
        ) {
          const hasWeekdays = [
            "lunes",
            "martes",
            "miércoles",
            "jueves",
            "viernes",
          ].every((d) => days.includes(d));
          const hasSaturday = days.includes("sábado");

          if (hasWeekdays && hasSaturday) {
            return days.includes("domingo")
              ? "Lunes - Domingo"
              : "Lunes - Sábado";
          }
        }

        // Si no es un patrón estándar, mostrar días individuales
        const dayNames = {
          lunes: "Lun",
          martes: "Mar",
          miércoles: "Mié",
          jueves: "Jue",
          viernes: "Vie",
          sábado: "Sáb",
          domingo: "Dom",
        };

        return days.map((day) => dayNames[day] || day).join(", ");
      };

      return [
        {
          label: formatDays(workingDays),
          hours: `${config.horario_apertura} - ${config.horario_cierre}`,
        },
      ];
    }

    // Fallback por defecto
    return [{ label: "Lunes - Domingo", hours: "19:00 - 22:00" }];
  };

  const scheduleDisplay = getScheduleDisplay();

  return (
    <footer className="bg-secondary-900 dark:bg-secondary-950 text-secondary-200 mt-20 transition-colors duration-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:px-4 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
              LA COCINA DE LAU
            </h3>
            <p className="text-secondary-400 dark:text-secondary-500 text-sm leading-relaxed mb-6">
              Comida casera con todo el sabor de siempre. Preparamos cada plato
              con dedicación y los mejores ingredientes.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-secondary-800 dark:bg-secondary-800/80 flex items-center justify-center text-secondary-400 transition-all duration-300 hover:bg-primary-500 hover:text-white hover:-translate-y-1 border border-secondary-700 dark:border-secondary-700"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-secondary-800 dark:bg-secondary-800/80 flex items-center justify-center text-secondary-400 transition-all duration-300 hover:bg-green-500 hover:text-white hover:-translate-y-1 border border-secondary-700 dark:border-secondary-700"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary-400" />
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="text-secondary-400 dark:text-secondary-500 text-sm flex items-center gap-3 transition-colors hover:text-secondary-200">
                <MapPin className="h-4 w-4 text-primary-400 shrink-0" />
                <span>Olavarría, Buenos Aires</span>
              </li>
              <li className="text-secondary-400 dark:text-secondary-500 text-sm flex items-center gap-3 transition-colors hover:text-secondary-200">
                <Phone className="h-4 w-4 text-primary-400 shrink-0" />
                <span>+54 2284 229601</span>
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-400" />
              Horarios
            </h4>
            <ul className="space-y-3">
              {scheduleDisplay.map((schedule, index) => (
                <li
                  key={index}
                  className="text-secondary-400 dark:text-secondary-500 text-sm flex justify-between py-1.5 border-b border-secondary-800 dark:border-secondary-800/70 last:border-b-0"
                >
                  <span>{schedule.label}</span>
                  <span className="font-medium text-secondary-200">
                    {schedule.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
              <Store className="h-4 w-4 text-primary-400" />
              Servicios
            </h4>
            <ul className="space-y-3">
              <li className="text-secondary-400 dark:text-secondary-500 text-sm flex items-center gap-3 transition-colors hover:text-secondary-200">
                <Truck className="h-4 w-4 text-primary-400 shrink-0" />
                <span>Envíos a domicilio</span>
              </li>
              <li className="text-secondary-400 dark:text-secondary-500 text-sm flex items-center gap-3 transition-colors hover:text-secondary-200">
                <Store className="h-4 w-4 text-primary-400 shrink-0" />
                <span>Retiro en local</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800 dark:border-secondary-800/70">
        <div className="max-w-7xl mx-auto px-6 py-6 md:px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary-500 dark:text-secondary-600 flex items-center gap-1.5">
              © {currentYear} LA COCINA DE LAU. Todos los derechos reservados.
            </p>
            <p className="text-sm text-secondary-500 dark:text-secondary-600 flex items-center gap-1.5">
              Hecho con <Heart className="h-4 w-4 text-red-500 fill-red-500" />{" "}
              en Olavarría
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
