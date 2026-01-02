import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

const cardVariants = cva(
  "rounded-lg bg-card border border-primary transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "shadow-sm hover:shadow-md",
        elevated: "shadow-md hover:shadow-lg",
        outline:
          "border-2 border-secondary-300 dark:border-secondary-600 shadow-none",
        ghost:
          "bg-secondary-50 dark:bg-secondary-800/50 border-secondary-200 dark:border-secondary-700",
        interactive:
          "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:border-accent-300 dark:hover:border-accent-600",
        minimal: "border-none shadow-none bg-transparent",
      },
      padding: {
        none: "p-0",
        xs: "p-2",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

const Card = forwardRef(
  ({ className, variant, padding, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
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
