export function UnreadCount({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      data-testid="notification-unread-count"
      className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-medium leading-none text-white"
      aria-label={`${count} unread notifications`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
