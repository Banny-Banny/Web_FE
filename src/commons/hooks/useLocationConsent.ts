/**
 * LocalStorage에 저장된 위치 권한 동의 여부를 구독하는 훅
 * - null: 아직 로드 전 (SSR/저장된 값 없음)
 * - true/false: 저장된 값
 */

import { useState } from 'react';
import { getLocationConsent } from '@/commons/utils/location-consent';

export function useLocationConsent(): boolean | null {
  const [locationConsent] = useState<boolean | null>(() => getLocationConsent());

  return locationConsent;
}
