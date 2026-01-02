import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "../shared/utils/cn";

/**
 * Contexto y sistema de notificaciones Toast
 * Reemplaza los alerts nativos con toasts profesionales
 */

const ToastContext = createContext(undefined);

// Configuración de variantes de toast
const toastVariants = {
  success: {
    icon: CheckCircle,
    className:
      "bg-success-50 dark:bg-success-950/80 border-success-200 dark:border-success-800 text-success-800 dark:text-success-200",
    iconClassName: "text-success-500 dark:text-success-400",
  },
  error: {
    icon: AlertCircle,
    className:
      "bg-error-50 dark:bg-error-950/80 border-error-200 dark:border-error-800 text-error-800 dark:text-error-200",
    iconClassName: "text-error-500 dark:text-error-400",
  },
  warning: {
    icon: AlertTriangle,
    className:
      "bg-warning-50 dark:bg-warning-950/80 border-warning-200 dark:border-warning-800 text-warning-800 dark:text-warning-200",
    iconClassName: "text-warning-500 dark:text-warning-400",
  },
  info: {
    icon: Info,
    className:
      "bg-info-50 dark:bg-info-950/80 border-info-200 dark:border-info-800 text-info-800 dark:text-info-200",
    iconClassName: "text-info-500 dark:text-info-400",
  },
};

// Componente Toast individual
const Toast = ({ id, message, variant = "info", onClose }) => {
  const config = toastVariants[variant] || toastVariants.info;
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg",
        "animate-toast-in min-w-75 max-w-105",
        "backdrop-blur-sm",
        config.className
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", config.iconClassName)} />
      <p className="flex-1 text-sm font-medium leading-relaxed m-0">
        {message}
      </p>
      <button
        onClick={() => onClose(id)}
        className={cn(
          "shrink-0 p-1 rounded-lg transition-all duration-200",
          "hover:bg-black/10 dark:hover:bg-white/10",
          "focus:outline-none focus:ring-2 focus:ring-current/30"
        )}
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Contenedor de Toasts
const ToastContainer = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-9999 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};

// Provider del contexto
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message, variant = "info", duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const newToast = {
        id,
        message,
        variant,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto-remove después de la duración
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  // Métodos helper para cada tipo de toast
  const toast = useCallback(
    (message, duration) => addToast(message, "info", duration),
    [addToast]
  );

  const success = useCallback(
    (message, duration) => addToast(message, "success", duration),
    [addToast]
  );

  const error = useCallback(
    (message, duration) => addToast(message, "error", duration),
    [addToast]
  );

  const warning = useCallback(
    (message, duration) => addToast(message, "warning", duration),
    [addToast]
  );

  const info = useCallback(
    (message, duration) => addToast(message, "info", duration),
    [addToast]
  );

  const value = {
    toast,
    success,
    error,
    warning,
    info,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook para usar el sistema de toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast debe usarse dentro de un ToastProvider");
  }
  return context;
};

export default ToastProvider;
