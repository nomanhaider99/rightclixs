/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Bundle GSAP with the page chunks instead of emitting it as a separate
  // server vendor-chunk (which fails to resolve when the project path
  // contains a space, e.g. "office work").
  transpilePackages: ["gsap"],
};

export default nextConfig;
