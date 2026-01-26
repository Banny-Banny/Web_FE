/**
 * 카카오 지도 스크립트 로더
 * 카카오 지도 JavaScript SDK를 동적으로 로딩합니다.
 */

import { getKakaoMapApiKey } from './config';

/**
 * 스크립트 로딩 상태
 */
let isLoading = false;
let isLoaded = false;
let loadPromise: Promise<void> | null = null;

/**
 * 카카오 지도 스크립트를 동적으로 로딩합니다.
 * 중복 로딩을 방지하며, Promise 기반으로 비동기 처리됩니다.
 * 
 * @returns 스크립트 로딩 완료 Promise
 * @throws {Error} 스크립트 로딩 실패 시
 */
export function loadKakaoMapScript(): Promise<void> {
  // 이미 로드된 경우
  if (isLoaded && window.kakao?.maps) {
    return Promise.resolve();
  }

  // 로딩 중인 경우 기존 Promise 반환
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // 새로운 로딩 시작
  isLoading = true;
  
  loadPromise = new Promise<void>((resolve, reject) => {
    try {
      // API 키 가져오기
      const apiKey = getKakaoMapApiKey();
      
      // 스크립트 태그 생성
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
      script.async = true;
      
      // 로딩 완료 핸들러
      script.onload = () => {
        // kakao.maps.load를 사용하여 지도 API 초기화
        if (window.kakao?.maps) {
          window.kakao.maps.load(() => {
            isLoaded = true;
            isLoading = false;
            resolve();
          });
        } else {
          isLoading = false;
          reject(new Error('카카오 지도 API를 로드하는데 실패했습니다.'));
        }
      };
      
      // 로딩 실패 핸들러
      script.onerror = () => {
        isLoading = false;
        loadPromise = null;
        reject(new Error('카카오 지도 스크립트를 로드하는데 실패했습니다. 네트워크 연결을 확인해주세요.'));
      };
      
      // 문서에 스크립트 추가
      document.head.appendChild(script);
    } catch (error) {
      isLoading = false;
      loadPromise = null;
      reject(error);
    }
  });
  
  return loadPromise;
}

/**
 * 스크립트 로딩 상태를 초기화합니다.
 * 주로 테스트 용도로 사용됩니다.
 */
export function resetScriptLoader(): void {
  isLoading = false;
  isLoaded = false;
  loadPromise = null;
}
