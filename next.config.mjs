/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // top-level, enables static export
  devIndicators: {
    autoPrerender: false,     // hides auto prerender indicator
  },
  images: {
    unoptimized: true,        // required if you use <Image>
  },
};

export default nextConfig;
