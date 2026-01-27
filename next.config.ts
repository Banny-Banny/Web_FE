import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // 실험적 기능 설정
  experimental: {
    // 최적화된 패키지 임포트
    optimizePackageImports: ['@tanstack/react-query', '@remixicon/react'] as string[],
  },

  // 이미지 최적화 설정
  images: {
    // 허용된 이미지 도메인 (새로운 방식)
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'timeegg.com',
      },
      {
        protocol: 'https',
        hostname: 'api.timeegg.com',
      },
    ],
    // 이미지 형식 최적화
    formats: ['image/webp', 'image/avif'],
    // 이미지 크기 설정
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 컴파일러 최적화
  compiler: {
    // 프로덕션에서 console 제거
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // 압축 설정
  compress: true,

  // 정적 파일 최적화
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.CDN_URL || '' : '',

  // 헤더 설정
  async headers() {
    return [
      {
        // 모든 API 라우트에 CORS 헤더 적용
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
      {
        // 정적 파일 캐싱
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // 정적 자산 캐싱
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 리다이렉트 설정
  async redirects() {
    return [
      // 예시: 기본 리다이렉트
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },

  // 리라이트 설정
  async rewrites() {
    return [
      // API 프록시 설정 (개발 환경)
      ...(process.env.NODE_ENV === 'development' ? [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'}/:path*`,
        },
      ] : []),
    ];
  },

  // 웹팩 설정 커스터마이징
  webpack: (config, { buildId: _buildId, dev: _dev, isServer: _isServer, defaultLoaders: _defaultLoaders, webpack: _webpack }) => {
    // SVG 파일을 React 컴포넌트로 처리
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    // 번들 분석기 설정 (환경 변수로 활성화)
    if (process.env.ANALYZE === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }

    return config;
  },

  // 환경 변수 설정
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 출력 설정
  output: 'standalone',
  
  // Workspace root 명시 (lockfile 경고 제거)
  outputFileTracingRoot: path.join(__dirname),

  // 전력 소비 최적화
  poweredByHeader: false,

  // React Strict Mode
  reactStrictMode: true,

  // 타입스크립트 설정
  typescript: {
    // 빌드 시 타입 체크 무시 (CI에서 별도 체크)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
