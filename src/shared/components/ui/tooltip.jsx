import { useState, cloneElement, forwardRef } from 'react';
import { cn } from '@/shared/utils/cn';

const Tooltip = forwardRef(
  (
    {
      children,
      content,
      position = 'top',
      delay = 200,
      className,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    const positionClasses = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowClasses = {
      top: 'top-full left-1/2 -translate-x-1/2 border-t-secondary-800 border-x-transparent border-b-transparent',
      bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-secondary-800 border-x-transparent border-t-transparent',
      left: 'left-full top-1/2 -translate-y-1/2 border-l-secondary-800 border-y-transparent border-r-transparent',
      right: 'right-full top-1/2 -translate-y-1/2 border-r-secondary-800 border-y-transparent border-l-transparent',
    };

    const handleMouseEnter = () => {
      const id = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      setTimeoutId(id);
    };

    const handleMouseLeave = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      setIsVisible(false);
    };

    return (
      <div
        ref={ref}
        className="relative inline-flex"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        {...props}
      >
        {children}
        {isVisible && content && (
          <div
            role="tooltip"
            className={cn(
              'absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-secondary-800 rounded-md shadow-lg whitespace-nowrap',
              'animate-in fade-in-0 zoom-in-95 duration-200',
              positionClasses[position],
              className
            )}
          >
            {content}
            <span
              className={cn(
                'absolute w-0 h-0 border-4',
                arrowClasses[position]
              )}
            />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export { Tooltip };
