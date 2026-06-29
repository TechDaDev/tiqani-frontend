function configuredBackendOrigins() {
  const origins = new Set([
    "http://127.0.0.1:8000",
    "http://localhost:8000",
  ]);

  for (const value of [
    process.env.BACKEND_INTERNAL_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
  ]) {
    if (!value) continue;
    try {
      origins.add(new URL(value).origin);
    } catch {
      // Ignore invalid env values; request code will surface the bad URL.
    }
  }

  return Array.from(origins);
}

function configuredImageOrigins() {
  const origins = new Set([
    "https://assembled-drop-jjl9wzgk8o.t3.storageapi.dev",
  ]);

  for (const source of [
    process.env.CSP_IMAGE_ORIGINS,
    process.env.NEXT_PUBLIC_IMAGE_ORIGINS,
  ]) {
    if (!source) continue;
    for (const value of source.split(/[,\s]+/)) {
      if (!value) continue;
      try {
        origins.add(new URL(value).origin);
      } catch {
        // Ignore invalid env values; the browser will surface blocked assets.
      }
    }
  }

  return Array.from(origins);
}

export function buildSecurityHeaders(isProduction: boolean) {
  const backendOrigins = configuredBackendOrigins().join(" ");
  const imageOrigins = configuredImageOrigins().join(" ");
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${backendOrigins} ${imageOrigins}`,
    "font-src 'self' data:",
    `connect-src 'self' ${backendOrigins}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  return [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=()",
    },
    ...(isProduction
      ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
      : []),
  ];
}
