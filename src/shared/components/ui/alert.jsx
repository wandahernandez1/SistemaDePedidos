import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const alertVariants = cva(
  "relative flex items-start gap-3 rounded-card p-4 text-sm",
  {
    variants: {
      variant: {
        default:
          "bg-secondary-50 text-secondary-800 border border-secondary-200",
        info: "bg-blue-50 text-blue-800 border border-blue-200",
        success: "bg-green-50 text-green-800 border border-green-200",
        warning: "bg-yellow-50 text-yellow-800 border border-yellow-200",
        error: "bg-red-50 text-red-800 border border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const Alert = forwardRef(
  (
    {
      className,
      variant = "default",
      title,
      children,
      onClose,
      icon: CustomIcon,
      ...props
    },
    ref
  ) => {
    const Icon = CustomIcon || iconMap[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {title && <h5 className="font-medium mb-1">{title}</h5>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
            aria-label="Cerrar alerta"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export { Alert, alertVariants };
