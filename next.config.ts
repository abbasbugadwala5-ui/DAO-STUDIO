import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Heavy 3D / animation packages have huge transitive trees. Telling Next to
  // tree-shake them at the import level cuts cold dev compile from minutes to
  // seconds. Hot reloads are fast either way.
  experimental: {
    optimizePackageImports: [
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "gsap",
      "@gsap/react",
      "lenis",
    ],
  },
};

export default nextConfig;
