import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const inputVariants = cva(
  "flex w-full rounded-md border bg-card px-3 py-2 text-sm text-primary transition-all duration-200 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium",
  {
    variants: {
      variant: {
        default:
          "border-border-primary focus:border-border-focus focus:ring-accent-500/20 hover:border-border-hover",
        error:
          "border-error-500 focus:border-error-500 focus:ring-error-500/20 text-error-600",
        success:
          "border-success-500 focus:border-success-500 focus:ring-success-500/20 text-success-600",
        ghost:
          "border-transparent bg-transparent focus:border-border-focus focus:bg-card",
      },
      inputSize: {
        sm: "h-8 text-xs px-2",
        md: "h-10 text-sm px-3",
        lg: "h-12 text-base px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

const Input = forwardRef(
  (
    {
      className,
      variant,
      inputSize,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const inputVariant = error ? "error" : variant;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-secondary-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              inputVariants({ variant: inputVariant, inputSize }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          {rightIcon && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
              {rightIcon}
            </div>
          )}
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              "text-xs",
              error ? "text-red-500" : "text-secondary-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
