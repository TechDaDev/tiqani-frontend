export function buildSecurityHeaders(isProduction: boolean) {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: http://127.0.0.1:8000 http://localhost:8000",
    "font-src 'self' data:",
    "connect-src 'self' http://127.0.0.1:8000 http://localhost:8000",
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
