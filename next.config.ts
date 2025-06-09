
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://6000-firebase-studio-1749393796145.cluster-etsqrqvqyvd4erxx7qq32imrjk.cloudworkstations.dev',
      'https://9000-firebase-studio-1749393796145.cluster-etsqrqvqyvd4erxx7qq32imrjk.cloudworkstations.dev',
      // Mantendo a anterior por precaução, caso o ambiente mude novamente
      'https://6000-firebase-studio-1747760580324.cluster-uf6urqn4lned4spwk4xorq6bpo.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
