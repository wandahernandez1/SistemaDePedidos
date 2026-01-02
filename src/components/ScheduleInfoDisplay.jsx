import { Clock, Calendar, Beef, Pizza, CircleDot, Info } from "lucide-react";
import { formatScheduleDisplay } from "../shared/constants/schedules";

/**
 * Componente que muestra los horarios de disponibilidad al usuario
 * Muestra información clara sobre cuándo puede realizar pedidos de cada categoría
 */
const ScheduleInfoDisplay = ({ schedules, compact = false }) => {
  if (!schedules) return null;

  const categories = [
    {
      key: "hamburguesas",
      name: "Hamburguesas",
      icon: Beef,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500",
      borderColor: "border-amber-200",
    },
    {
      key: "empanadas",
      name: "Empanadas",
      icon: CircleDot,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
      borderColor: "border-orange-200",
    },
    {
      key: "pizzas",
      name: "Pizzas",
      icon: Pizza,
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
      borderColor: "border-red-200",
    },
  ];

  // Versión compacta para mostrar en el navbar o header
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 items-center text-sm">
        <Clock className="w-4 h-4 text-secondary-400" />
        <span className="text-secondary-500 dark:text-secondary-400">
          Horarios de pedidos:
        </span>
        {categories.map(({ key, name }) => {
          const schedule = schedules[key];
          if (!schedule?.habilitado) return null;
          return (
            <span
              key={key}
              className="bg-secondary-100 dark:bg-secondary-800 px-2 py-0.5 rounded text-xs font-medium text-secondary-600 dark:text-secondary-300"
            >
              {name}: {schedule.horario_pedidos_inicio} -{" "}
              {schedule.horario_pedidos_fin}
            </span>
          );
        })}
      </div>
    );
  }

  // Versión completa para mostrar en sección dedicada
  return (
    <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Horarios de Pedidos</h3>
            <p className="text-primary-100 text-sm">
              Consultá la disponibilidad de cada producto
            </p>
          </div>
        </div>
      </div>

      {/* Lista de horarios */}
      <div className="p-5 space-y-4">
        {categories.map(
          ({ key, name, icon: Icon, bgColor, iconColor, borderColor }) => {
            const schedule = schedules[key];
            if (!schedule?.habilitado) return null;

            const deliveryInfo =
              schedule.horario_entrega_fin &&
              schedule.horario_entrega_fin !== schedule.horario_pedidos_fin
                ? `Entregas hasta las ${schedule.horario_entrega_fin} hs`
                : null;

            return (
              <div
                key={key}
                className={`${bgColor} dark:bg-secondary-800 rounded-xl p-4 border ${borderColor} dark:border-secondary-700`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-secondary-700 shadow-sm`}
                  >
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-secondary-800 dark:text-secondary-100 mb-1">
                      {name}
                    </h4>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      {formatScheduleDisplay(schedule)}
                    </p>
                    {deliveryInfo && (
                      <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-1 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        {deliveryInfo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        )}

        {/* Nota informativa */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Los pedidos fuera de horario no podrán ser procesados. Las bebidas y
            postres están disponibles durante todos los horarios de servicio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInfoDisplay;
