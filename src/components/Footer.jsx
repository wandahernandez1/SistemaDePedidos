import {
  Phone,
  Clock,
  Instagram,
  MessageCircle,
  Truck,
  Store,
  MapPin,
  Heart,
  UtensilsCrossed,
  Pizza,
  Beef,
} from "lucide-react";
import { useRealTimeSchedules } from "../shared/hooks/useRealTimeSchedules";

/**
 * Componente Footer - Pie de página profesional y minimalista
 * Los horarios se actualizan automáticamente desde la configuración por categoría
 * Diseño optimizado para dark/light mode con alto contraste
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { schedules } = useRealTimeSchedules();

  /**
   * Formatear días para mostrar de forma compacta
   */
  const formatDays = (days) => {
    if (!days || days.length === 0) return "";

    const dayOrder = [
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
      "domingo",
    ];
    const sortedDays = [...days].sort(
      (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
    );

    // Detectar rangos consecutivos
    const weekdays = ["lunes", "martes", "miércoles", "jueves", "viernes"];
    const weekend = ["sábado", "domingo"];

    const hasAllWeekdays = weekdays.every((d) => sortedDays.includes(d));
    const hasWeekend = weekend.every((d) => sortedDays.includes(d));
    const hasSaturday = sortedDays.includes("sábado");
    const hasSunday = sortedDays.includes("domingo");

    if (hasAllWeekdays && hasWeekend) {
      return "Lun - Dom";
    }
    if (hasAllWeekdays && hasSaturday && !hasSunday) {
      return "Lun - Sáb";
    }
    if (hasAllWeekdays && !hasSaturday && !hasSunday) {
      return "Lun - Vie";
    }

    // Caso especial: Viernes, Sábado, Domingo
    if (
      sortedDays.length === 3 &&
      sortedDays.includes("viernes") &&
      sortedDays.includes("sábado") &&
      sortedDays.includes("domingo")
    ) {
      return "Vie - Dom";
    }

    // Para otros casos, mostrar abreviados
    const dayNames = {
      lunes: "Lun",
      martes: "Mar",
      miércoles: "Mié",
      jueves: "Jue",
      viernes: "Vie",
      sábado: "Sáb",
      domingo: "Dom",
    };

    return sortedDays.map((day) => dayNames[day]).join(", ");
  };

  /**
   * Obtener los horarios de turnos activos de una categoría
   */
  const getActiveShifts = (schedule) => {
    if (!schedule?.turnos) return [];

    const shifts = [];
    if (schedule.turnos.turno1?.habilitado) {
      shifts.push({
        name: schedule.turnos.turno1.nombre || "Mediodía",
        hours: `${schedule.turnos.turno1.inicio} - ${schedule.turnos.turno1.fin}`,
      });
    }
    if (schedule.turnos.turno2?.habilitado) {
      shifts.push({
        name: schedule.turnos.turno2.nombre || "Noche",
        hours: `${schedule.turnos.turno2.inicio} - ${schedule.turnos.turno2.fin}`,
      });
    }
    return shifts;
  };

  /**
   * Generar datos de horarios por categoría
   */
  const getCategorySchedules = () => {
    if (!schedules) return [];

    const categories = [
      {
        key: "empanadas",
        name: "Empanadas",
        icon: UtensilsCrossed,
      },
      {
        key: "pizzas",
        name: "Pizzas",
        icon: Pizza,
      },
      {
        key: "hamburguesas",
        name: "Hamburguesas",
        icon: Beef,
      },
    ];

    return categories
      .map((cat) => {
        const schedule = schedules[cat.key];
        if (!schedule || !schedule.habilitado) return null;

        const shifts = getActiveShifts(schedule);
        if (shifts.length === 0) return null;

        return {
          ...cat,
          days: formatDays(schedule.dias),
          shifts,
        };
      })
      .filter(Boolean);
  };

  const categorySchedules = getCategorySchedules();

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
                href="https://www.instagram.com/lacocinadelau__"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-secondary-800 dark:bg-secondary-800/80 flex items-center justify-center text-secondary-400 transition-all duration-300 hover:bg-primary-500 hover:text-white hover:-translate-y-1 border border-secondary-700 dark:border-secondary-700"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/542284229601"
                target="_blank"
                rel="noopener noreferrer"
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

          {/* Horarios por Categoría */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-400" />
              Horarios
            </h4>
            <ul className="space-y-4">
              {categorySchedules.map((category) => {
                const IconComponent = category.icon;
                return (
                  <li
                    key={category.key}
                    className="text-secondary-400 dark:text-secondary-500 text-sm"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className="h-4 w-4 text-primary-400 shrink-0" />
                      <span className="font-medium text-secondary-200">
                        {category.name}
                      </span>
                    </div>
                    <div className="pl-6 space-y-0.5">
                      <span className="text-xs text-secondary-500">
                        {category.days}
                      </span>
                      {category.shifts.map((shift, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="text-secondary-500">
                            {shift.name}:{" "}
                          </span>
                          <span className="text-secondary-300">
                            {shift.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </li>
                );
              })}
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
