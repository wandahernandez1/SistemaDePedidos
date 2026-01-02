import { useState, useEffect } from "react";
import {
  Package,
  Clock,
  MapPin,
  Store,
  Truck,
  Phone,
  Check,
  X,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import {
  getOrders,
  subscribeToOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../supabase/supabaseService";
import { formatPrice } from "../../utils/formatPrice";

/**
 * Estados posibles de un pedido
 */
const ORDER_STATUS = {
  PENDING: "pending",
  PREPARING: "preparing",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: {
    label: "Pendiente",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    icon: Clock,
  },
  [ORDER_STATUS.PREPARING]: {
    label: "Preparando",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    icon: RefreshCw,
  },
  [ORDER_STATUS.READY]: {
    label: "Listo",
    color:
      "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
    icon: Check,
  },
  [ORDER_STATUS.DELIVERED]: {
    label: "Entregado",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400",
    icon: Package,
  },
  [ORDER_STATUS.CANCELLED]: {
    label: "Cancelado",
    color: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
    icon: X,
  },
};

/**
 * Componente para mostrar un item del pedido
 */
const OrderItem = ({ item }) => {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-700">
        {item.imagen && (
          <img
            src={item.imagen}
            alt={item.nombre}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-800 dark:text-neutral-200 text-sm">
          {item.nombre}
        </p>
        {item.customizations && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {item.customizations}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            x{item.quantity}
          </span>
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
            {formatPrice(item.precio * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente de tarjeta de pedido individual
 */
const OrderCard = ({ order, onStatusChange, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusConfig =
    STATUS_CONFIG[order.status] || STATUS_CONFIG[ORDER_STATUS.PENDING];
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onStatusChange(order.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de eliminar este pedido?")) {
      await onDelete(order.id);
    }
  };

  const items = order.items || [];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                #{order.order_number || order.id}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}
              >
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(order.created_at)}
              </span>
              <span className="flex items-center gap-1">
                {order.delivery_type === "delivery" ? (
                  <Truck className="w-3 h-3" />
                ) : (
                  <Store className="w-3 h-3" />
                )}
                {order.delivery_type === "delivery" ? "Envío" : "Retiro"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
              {formatPrice(order.total)}
            </span>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </div>
        </div>

        {/* Horario de entrega */}
        {order.delivery_time && (
          <div className="mt-2 flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-medium">
            <Clock className="w-3 h-3" />
            Entrega: {order.delivery_time}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-neutral-200 dark:border-neutral-700">
          {/* Items del pedido */}
          <div className="p-4">
            <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-3 flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" />
              Productos ({items.length})
            </h4>
            <div className="space-y-1">
              {items.map((item, index) => (
                <OrderItem key={index} item={item} />
              ))}
            </div>
          </div>

          {/* Dirección de envío */}
          {order.delivery_type === "delivery" && order.delivery_address && (
            <div className="px-4 pb-4">
              <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Dirección
              </h4>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {order.delivery_address}
              </p>
            </div>
          )}

          {/* Teléfono de contacto */}
          {order.customer_phone && (
            <div className="px-4 pb-4">
              <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Contacto
              </h4>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {order.customer_phone}
              </p>
            </div>
          )}

          {/* Acciones */}
          <div className="px-4 pb-4 flex flex-wrap gap-2">
            {order.status === ORDER_STATUS.PENDING && (
              <button
                onClick={() => handleStatusChange(ORDER_STATUS.PREPARING)}
                disabled={isUpdating}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all hover:bg-blue-600 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3 h-3 ${isUpdating ? "animate-spin" : ""}`}
                />
                Preparando
              </button>
            )}
            {order.status === ORDER_STATUS.PREPARING && (
              <button
                onClick={() => handleStatusChange(ORDER_STATUS.READY)}
                disabled={isUpdating}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-semibold transition-all hover:bg-green-600 disabled:opacity-50"
              >
                <Check className="w-3 h-3" />
                Listo
              </button>
            )}
            {order.status === ORDER_STATUS.READY && (
              <button
                onClick={() => handleStatusChange(ORDER_STATUS.DELIVERED)}
                disabled={isUpdating}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg text-xs font-semibold transition-all hover:bg-gray-600 disabled:opacity-50"
              >
                <Package className="w-3 h-3" />
                Entregado
              </button>
            )}
            {order.status !== ORDER_STATUS.CANCELLED &&
              order.status !== ORDER_STATUS.DELIVERED && (
                <button
                  onClick={() => handleStatusChange(ORDER_STATUS.CANCELLED)}
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 rounded-lg text-xs font-semibold transition-all hover:bg-red-200 dark:hover:bg-red-500/30 disabled:opacity-50"
                >
                  <X className="w-3 h-3" />
                  Cancelar
                </button>
              )}
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold transition-all hover:bg-neutral-200 dark:hover:bg-neutral-600"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Componente principal de gestión de pedidos
 */
const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();

    // Suscribirse a cambios en tiempo real
    const subscription = subscribeToOrders((payload) => {
      if (payload.eventType === "INSERT") {
        setOrders((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === "UPDATE") {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === payload.new.id ? payload.new : order
          )
        );
      } else if (payload.eventType === "DELETE") {
        setOrders((prev) =>
          prev.filter((order) => order.id !== payload.old.id)
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      // La actualización se manejará por la suscripción en tiempo real
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId);
      // La eliminación se manejará por la suscripción en tiempo real
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const orderCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === ORDER_STATUS.PENDING).length,
    preparing: orders.filter((o) => o.status === ORDER_STATUS.PREPARING).length,
    ready: orders.filter((o) => o.status === ORDER_STATUS.READY).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Cargando pedidos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            {orderCounts.all}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Total pedidos
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4 border border-amber-200 dark:border-amber-500/30">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {orderCounts.pending}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Pendientes
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4 border border-blue-200 dark:border-blue-500/30">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {orderCounts.preparing}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Preparando
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-500/10 rounded-xl p-4 border border-green-200 dark:border-green-500/30">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {orderCounts.ready}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Listos
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "Todos" },
          { key: ORDER_STATUS.PENDING, label: "Pendientes" },
          { key: ORDER_STATUS.PREPARING, label: "Preparando" },
          { key: ORDER_STATUS.READY, label: "Listos" },
          { key: ORDER_STATUS.DELIVERED, label: "Entregados" },
          { key: ORDER_STATUS.CANCELLED, label: "Cancelados" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer ${
              filter === item.key
                ? "bg-primary-500 text-white"
                : "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={loadOrders}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-lg text-sm font-medium transition-all hover:bg-neutral-200 dark:hover:bg-neutral-600 border-none cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-600 dark:text-neutral-400 font-medium">
            No hay pedidos
          </p>
          <p className="text-neutral-400 dark:text-neutral-500 text-sm mt-1">
            Los pedidos aparecerán aquí cuando los clientes realicen compras
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
