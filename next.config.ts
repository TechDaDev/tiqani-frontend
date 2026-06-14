import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  eslint: {
    dirs: ["app", "components", "lib", "hooks", "types"],
  },
};

export default withNextIntl(nextConfig);
