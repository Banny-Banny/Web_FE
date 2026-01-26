/**
 * 카카오 지도 API 타입 정의
 */

/**
 * 위도/경도 좌표
 */
export interface LatLng {
  /** 위도 */
  lat: number;
  /** 경도 */
  lng: number;
}

/**
 * 지도 옵션
 */
export interface MapOptions {
  /** 지도의 중심 좌표 */
  center: LatLng;
  /** 지도의 확대/축소 레벨 (1-14) */
  level: number;
}

/**
 * 카카오 지도 인스턴스
 */
export interface KakaoMap {
  /** 지도의 중심 좌표를 설정합니다 */
  setCenter(latlng: LatLng): void;
  /** 지도의 중심 좌표를 가져옵니다 */
  getCenter(): LatLng;
  /** 지도의 확대/축소 레벨을 설정합니다 */
  setLevel(level: number): void;
  /** 지도의 확대/축소 레벨을 가져옵니다 */
  getLevel(): number;
  /** 지도를 다시 그립니다 */
  relayout(): void;
  /** 지도 드래그 기능을 설정합니다 */
  setDraggable(draggable: boolean): void;
  /** 지도 확대/축소 기능을 설정합니다 */
  setZoomable(zoomable: boolean): void;
}

/**
 * 카카오 지도 생성자
 */
export interface KakaoMapConstructor {
  new (container: HTMLElement, options: MapOptions): KakaoMap;
}

/**
 * 카카오 지도 LatLng 생성자
 */
export interface KakaoLatLngConstructor {
  new (lat: number, lng: number): LatLng;
}

/**
 * 카카오 지도 API 네임스페이스
 */
export interface KakaoMaps {
  Map: KakaoMapConstructor;
  LatLng: KakaoLatLngConstructor;
  /** 지도 API를 로드합니다 */
  load(callback: () => void): void;
}

/**
 * 카카오 API 네임스페이스
 */
export interface Kakao {
  maps: KakaoMaps;
}

/**
 * Window 인터페이스 확장
 */
declare global {
  interface Window {
    kakao?: Kakao;
  }
}

export {};
