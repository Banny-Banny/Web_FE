/**
 * 카카오 지도 API 타입 정의
 */

/**
 * 위도/경도 좌표
 */
export interface LatLng {
  /** 위도를 반환합니다 */
  getLat(): number;
  /** 경도를 반환합니다 */
  getLng(): number;
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
 * 마커 옵션
 */
export interface MarkerOptions {
  /** 마커의 위치 좌표 */
  position: LatLng;
  /** 마커를 표시할 지도 */
  map?: KakaoMap | null;
}

/**
 * 카카오 지도 마커 인스턴스
 */
export interface KakaoMarker {
  /** 마커를 표시할 지도를 설정합니다 */
  setMap(map: KakaoMap | null): void;
  /** 마커의 위치를 설정합니다 */
  setPosition(position: LatLng): void;
  /** 마커의 위치를 가져옵니다 */
  getPosition(): LatLng;
}

/**
 * 카카오 지도 마커 생성자
 */
export interface KakaoMarkerConstructor {
  new (options: MarkerOptions): KakaoMarker;
}

/**
 * 카카오 지도 이벤트 네임스페이스
 */
export interface KakaoMapsEvent {
  /** 이벤트 리스너를 추가합니다 */
  addListener(target: unknown, type: string, handler: () => void): void;
  /** 이벤트 리스너를 제거합니다 */
  removeListener(target: unknown, type: string, handler: () => void): void;
}

/**
 * 커스텀 오버레이 옵션
 */
export interface CustomOverlayOptions {
  /** 오버레이의 위치 좌표 */
  position: LatLng;
  /** 오버레이 내용 (HTML 요소 또는 문자열) */
  content: HTMLElement | string;
  /** 오버레이를 표시할 지도 */
  map?: KakaoMap | null;
  /** x축 방향 위치 오프셋 */
  xAnchor?: number;
  /** y축 방향 위치 오프셋 */
  yAnchor?: number;
  /** z-index */
  zIndex?: number;
}

/**
 * 카카오 지도 커스텀 오버레이 인스턴스
 */
export interface KakaoCustomOverlay {
  /** 오버레이를 표시할 지도를 설정합니다 */
  setMap(map: KakaoMap | null): void;
  /** 오버레이의 위치를 설정합니다 */
  setPosition(position: LatLng): void;
  /** 오버레이의 위치를 가져옵니다 */
  getPosition(): LatLng;
}

/**
 * 카카오 지도 커스텀 오버레이 생성자
 */
export interface KakaoCustomOverlayConstructor {
  new (options: CustomOverlayOptions): KakaoCustomOverlay;
}

/**
 * 카카오 지도 API 네임스페이스
 */
export interface KakaoMaps {
  Map: KakaoMapConstructor;
  LatLng: KakaoLatLngConstructor;
  Marker: KakaoMarkerConstructor;
  CustomOverlay: KakaoCustomOverlayConstructor;
  event: KakaoMapsEvent;
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
