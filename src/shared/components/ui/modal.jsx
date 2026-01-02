import { forwardRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";
import { Button } from "./button";

const modalOverlayVariants = cva(
  "fixed inset-0 z-50 bg-overlay backdrop-blur-sm transition-all duration-300 ease-in-out",
  {
    variants: {
      isOpen: {
        true: "opacity-100",
        false: "opacity-0 pointer-events-none",
      },
    },
  }
);

const modalContentVariants = cva(
  "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-card border border-primary rounded-lg shadow-xl transition-all duration-300 ease-in-out max-h-[90vh] overflow-hidden flex flex-col",
  {
    variants: {
      isOpen: {
        true: "opacity-100 scale-100",
        false: "opacity-0 scale-95 pointer-events-none",
      },
      size: {
        xs: "w-full max-w-xs",
        sm: "w-full max-w-sm",
        md: "w-full max-w-md",
        lg: "w-full max-w-lg",
        xl: "w-full max-w-xl",
        "2xl": "w-full max-w-2xl",
        "3xl": "w-full max-w-3xl",
        full: "w-full max-w-4xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const Modal = forwardRef(
  (
    {
      isOpen,
      onClose,
      size,
      className,
      children,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      ...props
    },
    ref
  ) => {
    const handleEscape = useCallback(
      (event) => {
        if (closeOnEscape && event.key === "Escape") {
          onClose?.();
        }
      },
      [closeOnEscape, onClose]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }, [isOpen, handleEscape]);

    const handleOverlayClick = (event) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose?.();
      }
    };

    if (typeof window === "undefined") return null;

    return createPortal(
      <>
        {/* Overlay */}
        <div
          className={modalOverlayVariants({ isOpen })}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Content */}
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn(modalContentVariants({ isOpen, size }), className)}
          {...props}
        >
          {showCloseButton && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-4 top-4 text-secondary-400 hover:text-secondary-600"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {children}
        </div>
      </>,
      document.body
    );
  }
);

Modal.displayName = "Modal";

const ModalHeader = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("px-6 pt-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
});

ModalHeader.displayName = "ModalHeader";

const ModalTitle = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn(
        "font-display text-xl font-semibold text-secondary-900",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
});

ModalTitle.displayName = "ModalTitle";

const ModalDescription = forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("mt-1 text-sm text-secondary-500", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

ModalDescription.displayName = "ModalDescription";

const ModalBody = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
});

ModalBody.displayName = "ModalBody";

const ModalFooter = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

ModalFooter.displayName = "ModalFooter";

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
};
