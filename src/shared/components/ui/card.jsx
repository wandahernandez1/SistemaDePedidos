import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

const cardVariants = cva(
  "rounded-2xl bg-white dark:bg-secondary-800 transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "border border-secondary-200 dark:border-secondary-700 shadow-sm",
        elevated:
          "shadow-lg border border-secondary-100 dark:border-secondary-700",
        outline: "border-2 border-secondary-200 dark:border-secondary-600",
        ghost:
          "bg-secondary-100 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700",
      },
      hover: {
        true: "hover:shadow-card-hover hover:-translate-y-0.5",
        false: "",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: false,
      padding: "md",
    },
  }
);

const Card = forwardRef(
  ({ className, variant, hover, padding, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, hover, padding }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        "font-display text-lg font-semibold text-secondary-900",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-secondary-500", className)}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center pt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};
