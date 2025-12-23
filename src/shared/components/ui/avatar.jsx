import { forwardRef, useState } from "react";
import { User } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-secondary-100 text-secondary-600",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
        "2xl": "h-20 w-20 text-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const Avatar = forwardRef(
  ({ className, size, src, alt = "", fallback, ...props }, ref) => {
    const [hasError, setHasError] = useState(false);

    const showFallback = !src || hasError;

    const iconSizes = {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
      "2xl": "h-10 w-10",
    };

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {showFallback ? (
          fallback || <User className={iconSizes[size || "md"]} />
        ) : (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setHasError(true)}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

const AvatarGroup = forwardRef(
  ({ children, max = 4, className, size = "md", ...props }, ref) => {
    const childArray = Array.isArray(children) ? children : [children];
    const visibleAvatars = childArray.slice(0, max);
    const remainingCount = childArray.length - max;

    return (
      <div ref={ref} className={cn("flex -space-x-2", className)} {...props}>
        {visibleAvatars.map((child, index) =>
          child ? (
            <div key={index} className="ring-2 ring-white rounded-full">
              {child}
            </div>
          ) : null
        )}
        {remainingCount > 0 && (
          <div
            className={cn(
              avatarVariants({ size }),
              "ring-2 ring-white bg-secondary-200 text-secondary-600 font-medium"
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup, avatarVariants };
