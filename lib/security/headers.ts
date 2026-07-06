function readMediaSources() {
  return [
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL,
    process.env.NEXT_PUBLIC_MEDIA_ORIGINS,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(/[,\s]+/))
    .map((value) => value.trim())
    .filter(Boolean);
}

export function buildSecurityHeaders(
  isProduction: boolean,
  backendOrigin?: string,
  mediaOrigins: string[] = readMediaSources(),
) {
  const backendSources = [
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    backendOrigin,
  ].filter(Boolean);
  const imageSources = [...backendSources, ...mediaOrigins];

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${imageSources.join(" ")}`,
    "font-src 'self' data:",
    `connect-src 'self' ${backendSources.join(" ")}`,
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
      ? [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ]
      : []),
  ];
}
