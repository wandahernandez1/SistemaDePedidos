import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

const radioVariants = cva(
  "w-5 h-5 border-2 border-secondary-300 dark:border-secondary-700 rounded-full appearance-none checked:bg-primary-500 checked:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-colors duration-200 cursor-pointer",
  {
    variants: {
      size: {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const Radio = forwardRef(({ className, size, ...props }, ref) => (
  <input
    ref={ref}
    type="radio"
    className={cn(radioVariants({ size }), className)}
    {...props}
  />
));

Radio.displayName = "Radio";

export { Radio, radioVariants };
