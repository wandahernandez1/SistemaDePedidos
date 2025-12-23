import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md",
        secondary:
          "bg-secondary-200 text-secondary-800 border border-secondary-300 hover:bg-secondary-300 hover:text-secondary-900 focus:ring-secondary-500 dark:bg-secondary-700 dark:text-secondary-100 dark:border-secondary-600 dark:hover:bg-secondary-600",
        outline:
          "border-2 border-secondary-300 bg-white text-secondary-700 hover:bg-secondary-100 hover:border-secondary-400 focus:ring-secondary-500 dark:bg-secondary-800 dark:text-secondary-200 dark:border-secondary-600 dark:hover:bg-secondary-700",
        ghost:
          "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 focus:ring-secondary-500 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm hover:shadow-md",
        success:
          "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-sm hover:shadow-md",
        link: "text-primary-600 underline-offset-4 hover:underline focus:ring-primary-500 font-semibold",
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
