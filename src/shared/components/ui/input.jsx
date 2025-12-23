import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const inputVariants = cva(
  "flex w-full rounded-lg border-2 bg-white dark:bg-secondary-800 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 transition-all duration-200 placeholder:text-secondary-400 dark:placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-secondary-300 dark:border-secondary-600 focus:border-primary-500 focus:ring-primary-500/20",
        error: "border-red-500 focus:border-red-500 focus:ring-red-500/20",
        success:
          "border-green-500 focus:border-green-500 focus:ring-green-500/20",
      },
      inputSize: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
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
