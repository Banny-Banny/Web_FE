/**
 * 성능 측정 및 모니터링 유틸리티
 * Core Web Vitals 및 사용자 정의 성능 지표 측정
 */

/**
 * Core Web Vitals 지표 타입 (web-vitals 패키지의 Metric 타입 사용)
 */
export type WebVitalsMetric = any; // web-vitals 패키지의 실제 타입 사용

/**
 * 사용자 정의 성능 지표 타입
 */
export interface CustomMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * 성능 데이터 수집기 클래스
 */
export class PerformanceCollector {
  private metrics: Map<string, CustomMetric> = new Map();
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = typeof window !== 'undefined' && 'performance' in window;
  }

  /**
   * 시간 측정 시작
   */
  startTiming(name: string): void {
    if (!this.isEnabled) return;

    performance.mark(`${name}-start`);
  }

  /**
   * 시간 측정 종료 및 기록
   */
  endTiming(name: string, metadata?: Record<string, any>): number | null {
    if (!this.isEnabled) return null;

    const endMark = `${name}-end`;
    const measureName = `${name}-duration`;

    performance.mark(endMark);
    performance.measure(measureName, `${name}-start`, endMark);

    const measure = performance.getEntriesByName(measureName)[0] as PerformanceMeasure;
    const duration = measure.duration;

    this.recordMetric({
      name,
      value: duration,
      timestamp: Date.now(),
      metadata,
    });

    return duration;
  }

  /**
   * 메트릭 기록
   */
  recordMetric(metric: CustomMetric): void {
    this.metrics.set(metric.name, metric);

    // 개발 환경에서 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance Metric: ${metric.name}`, {
        value: `${metric.value.toFixed(2)}ms`,
        metadata: metric.metadata,
      });
    }
  }

  /**
   * 모든 메트릭 가져오기
   */
  getAllMetrics(): CustomMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * 특정 메트릭 가져오기
   */
  getMetric(name: string): CustomMetric | undefined {
    return this.metrics.get(name);
  }

  /**
   * 메트릭 초기화
   */
  clearMetrics(): void {
    this.metrics.clear();
    if (this.isEnabled) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}

/**
 * 전역 성능 수집기 인스턴스
 */
export const performanceCollector = new PerformanceCollector();

/**
 * Core Web Vitals 측정 및 리포팅
 */
export function reportWebVitals(metric: WebVitalsMetric): void {
  // 개발 환경에서 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎯 Web Vital: ${metric.name}`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // 프로덕션에서는 분석 서비스로 전송
  if (process.env.NODE_ENV === 'production') {
    // TODO: Google Analytics, Sentry 등으로 전송
    sendToAnalytics(metric);
  }
}

/**
 * 분석 서비스로 메트릭 전송
 */
function sendToAnalytics(metric: WebVitalsMetric): void {
  // Google Analytics 4 예시
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.value),
      custom_parameter_1: metric.rating,
    });
  }

  // 사용자 정의 분석 엔드포인트로 전송
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'web-vital',
        metric,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch((error) => {
      console.warn('Failed to send analytics:', error);
    });
  }
}

/**
 * 리소스 로딩 성능 측정
 */
export function measureResourceLoading(): void {
  if (typeof window === 'undefined' || !('performance' in window)) return;

  // 페이지 로드 완료 후 실행
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      // 페이지 로딩 시간 측정
      const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      performanceCollector.recordMetric({
        name: 'page-load-time',
        value: pageLoadTime,
        timestamp: Date.now(),
        metadata: {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          firstByte: navigation.responseStart - navigation.fetchStart,
        },
      });

      // 리소스별 로딩 시간 분석
      const resourceMetrics = resources
        .filter((resource) => resource.duration > 0)
        .map((resource) => ({
          name: resource.name,
          duration: resource.duration,
          size: resource.transferSize || 0,
          type: getResourceType(resource.name),
        }))
        .sort((a, b) => b.duration - a.duration);

      if (process.env.NODE_ENV === 'development') {
        console.log('📈 Resource Loading Performance:', resourceMetrics.slice(0, 10));
      }
    }, 100);
  });
}

/**
 * 리소스 타입 추정
 */
function getResourceType(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  
  if (!extension) return 'other';
  
  if (['js', 'mjs'].includes(extension)) return 'script';
  if (['css'].includes(extension)) return 'stylesheet';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) return 'image';
  if (['woff', 'woff2', 'ttf', 'otf'].includes(extension)) return 'font';
  
  return 'other';
}

/**
 * 메모리 사용량 모니터링
 */
export function monitorMemoryUsage(): void {
  if (typeof window === 'undefined' || !(performance as any).memory) return;

  const memory = (performance as any).memory;
  
  performanceCollector.recordMetric({
    name: 'memory-usage',
    value: memory.usedJSHeapSize,
    timestamp: Date.now(),
    metadata: {
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100),
    },
  });
}

/**
 * 사용자 상호작용 성능 측정
 */
export function measureInteraction(name: string, fn: () => Promise<void> | void): Promise<void> | void {
  performanceCollector.startTiming(`interaction-${name}`);

  const result = fn();

  if (result instanceof Promise) {
    return result.finally(() => {
      performanceCollector.endTiming(`interaction-${name}`, { type: 'async' });
    });
  } else {
    performanceCollector.endTiming(`interaction-${name}`, { type: 'sync' });
    return result;
  }
}

/**
 * 성능 모니터링 초기화
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Web Vitals 측정 시작
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGS === 'true') {
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
      onINP(reportWebVitals);
    }).catch(() => {
      // web-vitals 패키지가 없는 경우 무시
    });
  }

  // 리소스 로딩 측정
  measureResourceLoading();

  // 주기적 메모리 사용량 모니터링 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    setInterval(monitorMemoryUsage, 30000); // 30초마다
  }
}

/**
 * 성능 리포트 생성
 */
export function generatePerformanceReport(): {
  customMetrics: CustomMetric[];
  summary: {
    totalMetrics: number;
    averagePageLoadTime: number;
    slowestInteractions: CustomMetric[];
  };
} {
  const metrics = performanceCollector.getAllMetrics();
  
  const pageLoadMetrics = metrics.filter(m => m.name === 'page-load-time');
  const interactionMetrics = metrics.filter(m => m.name.startsWith('interaction-'));
  
  const averagePageLoadTime = pageLoadMetrics.length > 0
    ? pageLoadMetrics.reduce((sum, m) => sum + m.value, 0) / pageLoadMetrics.length
    : 0;

  const slowestInteractions = interactionMetrics
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return {
    customMetrics: metrics,
    summary: {
      totalMetrics: metrics.length,
      averagePageLoadTime,
      slowestInteractions,
    },
  };
}