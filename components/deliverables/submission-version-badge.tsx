/**
 * Submission version badge.
 */
interface SubmissionVersionBadgeProps {
  version: number;
  className?: string;
}

export function SubmissionVersionBadge({
  version,
  className = "",
}: SubmissionVersionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-600 dark:bg-gray-700 dark:text-gray-300 ${className}`}
    >
      v{version}
    </span>
  );
}
