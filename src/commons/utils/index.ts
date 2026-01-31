/**
 * @fileoverview commons/utils 모듈의 배럴 파일
 * 
 * 이 파일은 utils 디렉토리의 모든 유틸리티 함수들을 중앙에서 관리하고 export합니다.
 * 다른 모듈에서 utils의 기능을 사용할 때 이 파일을 통해 import할 수 있습니다.
 * 
 * @example
 * ```typescript
 * import { performanceCollector, reportWebVitals } from '@/commons/utils';
 * ```
 */

// 성능 측정 유틸리티
export {
  performanceCollector,
  reportWebVitals,
  measureResourceLoading,
  monitorMemoryUsage,
  measureInteraction,
  initPerformanceMonitoring,
  generatePerformanceReport,
  PerformanceCollector,
  type WebVitalsMetric,
  type CustomMetric,
} from './performance';

// 결제 관련 유틸리티
export {
  extractPaymentInfoFromUrl,
  convertErrorCodeToMessage,
} from './payment';

// 날짜 포맷팅 유틸리티
export {
  formatDate,
  formatShortDateWithTime,
  formatLocaleDateShort,
  formatRelativeTime,
} from './date';
// 컨텐츠 관련 유틸리티
export {
  formatFileSize,
  validateFileType,
  validateFileSize,
  isImageFile,
  isAudioFile,
  isVideoFile,
} from './content';

// 초대/참여 관련 유틸리티
export {
  generateInviteLink,
  validateInviteCodeFormat,
  normalizeInviteCode,
  isAlreadyJoinedError,
  extractSlotNumberFromError,
  convertAlreadyJoinedToJoinResponse,
  getInviteErrorMessage,
} from './invite';

// 포맷팅 관련 유틸리티
export {
  formatCurrency,
} from './format';
