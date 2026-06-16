/**
 * Mock for next-intl components used in tests.
 */

import type { ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function NextIntlMock({ children, locale, messages }: { children: ReactNode; locale?: string; messages?: Record<string, unknown> }) {
  return <>{children}</>;
}
