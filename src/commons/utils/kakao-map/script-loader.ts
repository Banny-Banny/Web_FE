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
      
      // 타임아웃 설정 (30초)
      const timeout = setTimeout(() => {
        isLoading = false;
        loadPromise = null;
        const timeoutError = new Error(
          '카카오 지도 스크립트 로딩 시간이 초과되었습니다.\n' +
          '네트워크 연결 상태를 확인하거나 잠시 후 다시 시도해주세요.'
        );
        console.error('[Kakao Map Script Loader]', timeoutError.message);
        reject(timeoutError);
      }, 30000);
      
      // 로딩 완료 핸들러
      script.onload = () => {
        clearTimeout(timeout);
        
        // kakao.maps.load를 사용하여 지도 API 초기화
        if (window.kakao?.maps) {
          try {
            window.kakao.maps.load(() => {
              isLoaded = true;
              isLoading = false;
              console.log('[Kakao Map Script Loader] 카카오 지도 스크립트 로딩 완료');
              resolve();
            });
          } catch (loadError) {
            isLoading = false;
            const error = new Error(
              '카카오 지도 API 초기화에 실패했습니다.\n' +
              'API 키가 올바른지 확인해주세요.'
            );
            console.error('[Kakao Map Script Loader]', error.message, loadError);
            reject(error);
          }
        } else {
          isLoading = false;
          const error = new Error(
            '카카오 지도 API 객체를 찾을 수 없습니다.\n' +
            '스크립트가 올바르게 로드되지 않았습니다.'
          );
          console.error('[Kakao Map Script Loader]', error.message);
          reject(error);
        }
      };
      
      // 로딩 실패 핸들러
      script.onerror = (event) => {
        clearTimeout(timeout);
        isLoading = false;
        loadPromise = null;
        
        const error = new Error(
          '카카오 지도 스크립트를 로드하는데 실패했습니다.\n\n' +
          '가능한 원인:\n' +
          '1. 네트워크 연결 문제\n' +
          '2. 카카오 서버 일시적 장애\n' +
          '3. API 키가 올바르지 않음\n' +
          '4. 브라우저 확장 프로그램이 스크립트를 차단\n\n' +
          '네트워크 연결을 확인하고 잠시 후 다시 시도해주세요.'
        );
        
        console.error('[Kakao Map Script Loader]', error.message, event);
        reject(error);
      };
      
      // 문서에 스크립트 추가
      document.head.appendChild(script);
    } catch (error) {
      isLoading = false;
      loadPromise = null;
      
      if (error instanceof Error) {
        console.error('[Kakao Map Script Loader] 초기화 실패:', error.message);
      }
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
