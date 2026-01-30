/**
 * 위치 권한 동의 여부를 LocalStorage에 저장/조회하는 유틸
 * (백엔드 프로필 API에 locationConsent가 없어 클라이언트에서만 관리)
 */

const STORAGE_KEY = 'bunny_location_consent';

/**
 * LocalStorage에서 위치 동의 여부를 읽습니다.
 * 키가 없으면 null (미저장/구 사용자 → 기본값으로 true 사용 권장)
 * @returns true | false | null (null = 저장된 값 없음)
 */
export function getLocationConsent(): boolean | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    return null;
  } catch {
    return null;
  }
}

/**
 * 위치 동의 여부를 LocalStorage에 저장합니다.
 */
export function setLocationConsent(consent: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, String(consent));
  } catch {
    // ignore
  }
}
