import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        default:
          "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 shadow-sm hover:shadow-md border border-accent-500 dark:border-accent-600",
        secondary:
          "bg-secondary-100 text-secondary-800 border border-secondary-300 hover:bg-secondary-200 hover:text-secondary-900 focus:ring-accent-500 dark:bg-secondary-700 dark:text-secondary-100 dark:border-secondary-600 dark:hover:bg-secondary-600",
        outline:
          "border-2 border-accent-300 bg-white text-accent-700 hover:bg-accent-50 hover:border-accent-400 focus:ring-accent-500 dark:bg-secondary-900 dark:text-accent-300 dark:border-accent-700 dark:hover:bg-secondary-800",
        ghost:
          "bg-transparent text-secondary-700 hover:bg-secondary-100 focus:ring-accent-500 dark:text-secondary-200 dark:hover:bg-secondary-800",
        destructive:
          "bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 shadow-sm hover:shadow-md border border-error-500",
        success:
          "bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 shadow-sm hover:shadow-md border border-success-500",
        warning:
          "bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500 shadow-sm hover:shadow-md border border-warning-500",
        link: "text-accent-600 underline-offset-4 hover:underline focus:ring-accent-500 font-medium dark:text-accent-400",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const Button = forwardRef(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
