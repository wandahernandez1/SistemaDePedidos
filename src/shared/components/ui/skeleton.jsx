import { cn } from '@/shared/utils/cn';

/**
 * Skeleton loader component for loading states
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-secondary-200',
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton for text content
 */
function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for card content
 */
function SkeletonCard({ className }) {
  return (
    <div
      className={cn(
        'rounded-card border border-secondary-200 p-6 space-y-4',
        className
      )}
    >
      <Skeleton className="h-40 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-24 rounded-button" />
      </div>
    </div>
  );
}

/**
 * Skeleton for avatar
 */
function SkeletonAvatar({ size = 'md', className }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <Skeleton
      className={cn('rounded-full', sizeClasses[size], className)}
    />
  );
}

/**
 * Skeleton for table rows
 */
function SkeletonTable({ rows = 5, columns = 4, className }) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonTable,
};
