/**
 * Lighthouse CI 설정
 * 성능, 접근성, 모범 사례, SEO 등을 자동으로 측정
 */

module.exports = {
  ci: {
    // 수집 설정
    collect: {
      // 테스트할 URL들
      url: [
        'http://localhost:3000',
        'http://localhost:3000/login',
        // 추가 페이지들을 여기에 추가
      ],
      // 각 URL당 실행 횟수
      numberOfRuns: 3,
      // 서버 시작 명령어 (선택적)
      startServerCommand: 'npm run start',
      // 서버 준비 대기 시간
      startServerReadyPattern: 'ready on',
      // 서버 준비 타임아웃
      startServerReadyTimeout: 30000,
    },

    // 업로드 설정 (Lighthouse CI 서버 사용 시)
    upload: {
      // 임시 공개 스토리지 사용 (개발/테스트용)
      target: 'temporary-public-storage',
      // 또는 자체 LHCI 서버 사용
      // target: 'lhci',
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: 'your-build-token',
    },

    // 어설션 설정 (성능 기준)
    assert: {
      // 전체 카테고리 점수 기준
      assertions: {
        // 성능 점수 최소 90점
        'categories:performance': ['error', { minScore: 0.9 }],
        // 접근성 점수 최소 95점
        'categories:accessibility': ['error', { minScore: 0.95 }],
        // 모범 사례 점수 최소 90점
        'categories:best-practices': ['error', { minScore: 0.9 }],
        // SEO 점수 최소 90점
        'categories:seo': ['error', { minScore: 0.9 }],

        // Core Web Vitals 기준
        // Largest Contentful Paint (LCP) - 2.5초 이하
        'categories.performance.auditRefs[largest-contentful-paint].result.numericValue': ['error', { maxNumericValue: 2500 }],
        // First Input Delay (FID) - 100ms 이하
        'categories.performance.auditRefs[max-potential-fid].result.numericValue': ['error', { maxNumericValue: 100 }],
        // Cumulative Layout Shift (CLS) - 0.1 이하
        'categories.performance.auditRefs[cumulative-layout-shift].result.numericValue': ['error', { maxNumericValue: 0.1 }],

        // 기타 성능 지표
        // First Contentful Paint (FCP) - 1.8초 이하
        'categories.performance.auditRefs[first-contentful-paint].result.numericValue': ['error', { maxNumericValue: 1800 }],
        // Speed Index - 3.4초 이하
        'categories.performance.auditRefs[speed-index].result.numericValue': ['error', { maxNumericValue: 3400 }],
        // Time to Interactive (TTI) - 3.8초 이하
        'categories.performance.auditRefs[interactive].result.numericValue': ['error', { maxNumericValue: 3800 }],

        // 접근성 관련
        'categories.accessibility.auditRefs[color-contrast].result.score': ['error', { minScore: 1 }],
        'categories.accessibility.auditRefs[image-alt].result.score': ['error', { minScore: 1 }],

        // SEO 관련
        'categories.seo.auditRefs[meta-description].result.score': ['error', { minScore: 1 }],
        'categories.seo.auditRefs[document-title].result.score': ['error', { minScore: 1 }],
      },
      // 어설션 실패 시 종료 코드 설정
      assertMatrix: [
        {
          matchingUrlPattern: '.*',
          assertions: {
            // 모든 페이지에 공통 적용되는 기준
            'categories:performance': ['warn', { minScore: 0.8 }],
            'categories:accessibility': ['error', { minScore: 0.9 }],
          },
        },
        {
          // 홈페이지에만 적용되는 엄격한 기준
          matchingUrlPattern: 'http://localhost:3000/$',
          assertions: {
            'categories:performance': ['error', { minScore: 0.95 }],
          },
        },
      ],
    },

    // 서버 설정 (자체 LHCI 서버 운영 시)
    server: {
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './lhci.db',
      },
    },

    // 마법사 설정 (초기 설정 시 사용)
    wizard: {
      // GitHub Actions와 연동할지 여부
      githubActions: true,
      // Heroku에 LHCI 서버 배포할지 여부
      heroku: false,
    },
  },

  // Chrome 설정
  chrome: {
    // Chrome 실행 옵션
    chromeFlags: [
      '--headless',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  },

  // 추가 설정
  settings: {
    // 모바일 시뮬레이션
    emulatedFormFactor: 'mobile',
    // 네트워크 스로틀링
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    // 스크린샷 캡처
    auditMode: false,
    gatherMode: false,
    // 로케일 설정
    locale: 'ko',
  },
};