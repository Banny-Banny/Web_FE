/**
 * LocalStorage에 저장된 위치 권한 동의 여부를 구독하는 훅
 * - null: 아직 로드 전 (SSR/초기 마운트)
 * - true/false: 저장된 값
 */

import { useState, useEffect } from 'react';
import { getLocationConsent } from '@/commons/utils/location-consent';

export function useLocationConsent(): boolean | null {
  const [locationConsent, setLocationConsent] = useState<boolean | null>(null);

  useEffect(() => {
    setLocationConsent(getLocationConsent());
  }, []);

  return locationConsent;
}
