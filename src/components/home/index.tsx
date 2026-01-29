/**
 * Home Feature Container
 * 홈 페이지의 메인 컨테이너
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { loadKakaoMapScript } from '@/commons/utils/kakao-map/script-loader';
import { useKakaoMap } from './hooks/useKakaoMap';
import { useGeolocation } from './hooks/useGeolocation';
import { useLocationTracking } from './hooks/useLocationTracking';
import { useAutoDiscovery } from './hooks/useAutoDiscovery';
import { useCapsuleDetail } from './hooks/useCapsuleDetail';
import { useRecordCapsuleView } from './hooks/useRecordCapsuleView';
import { MapView } from './components/map-view';
import { MapControls } from './components/map-controls';
import { LocationDisplay } from './components/location-display';
import { CapsuleMarkers } from './components/capsule-markers';
import { FabButton } from './components/fab-button';
import { EggSlot } from './components/egg-slot';
import { EggSlotModal } from './components/egg-slot-modal';
import { EasterEggBottomSheet } from './components/easter-egg-bottom-sheet';
import { MyCapsuleModal } from './components/my-capsule-modal';
import { DiscoveryModal } from './components/discovery-modal';
import { HintModal } from './components/hint-modal';
import { Toast } from '@/commons/components/toast';
import type { HomeFeatureProps } from './types';
import { useSlotManagement } from './hooks/useSlotManagement';
import { useCapsuleMarkers } from './hooks/useCapsuleMarkers';
import type { CapsuleItem, GetCapsuleResponse } from '@/commons/apis/easter-egg/types';

/**
 * 두 지점 간의 방향(각도)을 계산합니다.
 * @param lat1 현재 위치 위도
 * @param lng1 현재 위치 경도
 * @param lat2 목표 위치 위도
 * @param lng2 목표 위치 경도
 * @returns 방향 (0-360도, 북쪽이 0도, 시계방향)
 */
function calculateDirection(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;

  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

export function HomeFeature({ className = '' }: HomeFeatureProps) {
  const router = useRouter();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [easterEggSheetOpen, setEasterEggSheetOpen] = useState(false);
  
  // 마커 클릭 시 선택된 캡슐 상태 관리
  const [selectedCapsuleId, setSelectedCapsuleId] = useState<string | null>(null);
  const [selectedCapsule, setSelectedCapsule] = useState<CapsuleItem | null>(null);
  
  // 모달 표시 상태 관리
  const [showMyCapsuleModal, setShowMyCapsuleModal] = useState(false);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);

  // 30m 이내 발견 모달 순차 표시용 큐 (가까운 순)
  const [discoveryQueue, setDiscoveryQueue] = useState<CapsuleItem[]>([]);
  const [discoveryQueueIndex, setDiscoveryQueueIndex] = useState(0);
  
  // Toast 상태 관리 (단일 객체로 통합)
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    visible: boolean;
  }>({
    message: '',
    type: 'info',
    visible: false,
  });
  
  const geolocation = useGeolocation();
  
  // 슬롯 관리 훅
  const { slotInfo, isLoading: isSlotLoading } = useSlotManagement();
  
  // 실시간 위치 추적 훅
  const locationTracking = useLocationTracking();
  
  // 자동 발견 감지 훅
  const {
    discoveredCapsule,
    checkDiscovery,
    clearDiscovery,
    markAsDiscovered,
  } = useAutoDiscovery();

  // 지도 진입 시 30m 이내 발견 큐는 한 번만 트리거 (재실행 방지)
  const entryDiscoveryTriggeredRef = useRef(false);
  
  // 캡슐 상세 정보 조회 훅
  const { capsule: capsuleDetail, error: capsuleDetailError } = useCapsuleDetail({
    id: selectedCapsuleId,
    lat: geolocation.latitude,
    lng: geolocation.longitude,
  });

  // 발견 기록 저장 (내 캡슐 모달에서 위치 클릭 시 호출)
  const { recordView } = useRecordCapsuleView();
  
  // Geolocation 값을 useKakaoMap에 전달
  const { map, isLoading, error, initializeMap } = useKakaoMap({
    initialLat: geolocation.latitude,
    initialLng: geolocation.longitude,
  });

  // 캡슐 마커 관리 훅
  // 위치가 없어도 기본 위치 기준으로 Mock 데이터 표시
  const { capsules, isLoading: isCapsulesLoading } = useCapsuleMarkers({
    lat: geolocation.latitude,
    lng: geolocation.longitude,
    radius_m: 300,
  });

  // 지도 로드 시 위치 추적 시작
  useEffect(() => {
    if (map && !locationTracking.isTracking) {
      locationTracking.startTracking();
    }

    // 컴포넌트 언마운트 시 위치 추적 중지
    return () => {
      if (locationTracking.isTracking) {
        locationTracking.stopTracking();
      }
    };
  }, [map, locationTracking.isTracking, locationTracking.startTracking, locationTracking.stopTracking]); // startTracking, stopTracking은 useCallback으로 메모이제이션됨

  // 지도 진입 시 30m 이내 친구 이스터에그를 가까운 순으로 발견 모달 순차 표시 (한 번만)
  useEffect(() => {
    if (
      !map ||
      isCapsulesLoading ||
      capsules.length === 0 ||
      geolocation.latitude === null ||
      geolocation.longitude === null ||
      entryDiscoveryTriggeredRef.current
    ) {
      return;
    }

    entryDiscoveryTriggeredRef.current = true;

    const queue = capsules
      .filter(
        (c) =>
          !c.is_mine &&
          c.type === 'EASTER_EGG' &&
          (c.distance_m ?? Infinity) <= 30
      )
      .sort(
        (a, b) =>
          (a.distance_m ?? Infinity) - (b.distance_m ?? Infinity)
      );

    if (queue.length === 0) return;

    markAsDiscovered(queue.map((c) => c.id));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDiscoveryQueue(queue);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDiscoveryQueueIndex(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCapsuleId(queue[0].id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCapsule(queue[0]);
  }, [
    map,
    isCapsulesLoading,
    capsules,
    geolocation.latitude,
    geolocation.longitude,
    markAsDiscovered,
  ]);

  // 위치 추적 업데이트 시 자동 발견 감지 (지속적인 감지)
  useEffect(() => {
    if (
      locationTracking.latitude !== null &&
      locationTracking.longitude !== null &&
      capsules.length > 0
    ) {
      checkDiscovery(
        locationTracking.latitude,
        locationTracking.longitude,
        capsules
      );
    }
  }, [locationTracking.latitude, locationTracking.longitude, capsules, checkDiscovery]);

  // 위치 업데이트로 자동 발견된 캡슐이 있을 때 처리 (큐 1개로 표시)
  useEffect(() => {
    if (!discoveredCapsule) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowHintModal(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowMyCapsuleModal(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDiscoveryQueue([discoveredCapsule]);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDiscoveryQueueIndex(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCapsule(discoveredCapsule);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCapsuleId(discoveredCapsule.id);
  }, [discoveredCapsule]);

  // 캡슐 상세 정보 조회 완료 시 조건별 모달 표시
  useEffect(() => {
    if (!capsuleDetail || !selectedCapsule) return;

    // 조건별 모달 표시 로직
    if (selectedCapsule.is_mine) {
      // 내 캡슐: 발견자 목록 표시 (발견 큐 초기화)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDiscoveryQueue([]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDiscoveryQueueIndex(0);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowMyCapsuleModal(true);
    } else {
      // 친구 캡슐: 거리에 따라 분기
      const distance = selectedCapsule.distance_m ?? Number.MAX_VALUE;

      if (distance <= 30) {
        // 30m 이내: 큐가 있으면 순차 표시(지도 진입/위치 업데이트), 없으면 단일 모달(마커 클릭)
        if (discoveryQueue.length > 0 &&
            discoveryQueue[discoveryQueueIndex]?.id === selectedCapsule.id &&
            capsuleDetail.id === selectedCapsule.id) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setShowDiscoveryModal(true);
        } else if (discoveryQueue.length === 0) {
          // 마커 클릭으로 열린 경우: 해당 캡슐만 발견 모달 표시
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setShowDiscoveryModal(true);
        }
      } else {
        // 30m 밖: 힌트 모달 표시 (발견 큐 초기화)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDiscoveryQueue([]);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDiscoveryQueueIndex(0);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShowHintModal(true);
      }
    }
  // capsuleDetail/selectedCapsule 변경 시에만 실행 (discoveryQueue 등은 내부에서 참조만 하고
  // 여기서 setState하면 의존성 변경 → 재실행 → 무한 루프 방지)
  }, [capsuleDetail, selectedCapsule]);

  // 캡슐 상세 정보 조회 에러 처리
  useEffect(() => {
    if (!capsuleDetailError) return;

    // Toast로 에러 메시지 표시
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToast({
      message: '캡슐 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.',
      type: 'error',
      visible: true,
    });
    
    // 모든 모달 닫기
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowMyCapsuleModal(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowDiscoveryModal(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowHintModal(false);
    
    // 상태 초기화는 별도 함수로 처리
    const resetCapsuleSelection = () => {
      setSelectedCapsuleId(null);
      setSelectedCapsule(null);
    };
    resetCapsuleSelection();
  }, [capsuleDetailError]);

  // 마커 클릭 핸들러
  // ⚠️ 참고: 이 task 내 기능은 이스터에그만 대상입니다. 타임캡슐은 마커 표시만 됩니다.
  const handleMarkerClick = useCallback((capsule: CapsuleItem) => {
    // 타임캡슐은 기능 대상이 아니므로 무시
    if (capsule.type === 'TIME_CAPSULE') return;

    // 기존에 열려있는 모달 모두 닫기
    setShowHintModal(false);
    setShowDiscoveryModal(false);
    setShowMyCapsuleModal(false);
    setDiscoveryQueue([]);
    setDiscoveryQueueIndex(0);

    // 캡슐 정보 조회 시작
    setSelectedCapsule(capsule);
    setSelectedCapsuleId(capsule.id);
  }, []);

  // 재시도 핸들러
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setScriptError(null);
    setScriptLoaded(false);
  }, []);

  // 이스터에그 선택 핸들러
  const handleEasterEggClick = useCallback(() => {
    setEasterEggSheetOpen(true);
  }, []);

  // 타임캡슐 선택 핸들러
  const handleTimeCapsuleClick = useCallback(() => {
    router.push('/timecapsule/create');
  }, [router]);

  // 이스터에그 바텀시트 닫기 핸들러
  const handleEasterEggSheetClose = useCallback(() => {
    setEasterEggSheetOpen(false);
  }, []);

  // 이스터에그 작성 완료 핸들러
  const handleEasterEggConfirm = useCallback((_formData: import('./components/easter-egg-bottom-sheet/types').EasterEggFormData) => {
    // 제출 로직은 바텀시트 컴포넌트 내부에서 처리됨
    // 성공 시 지도 업데이트 등 추가 작업이 필요하면 여기서 처리
    setEasterEggSheetOpen(false);
  }, []);

  // 알 슬롯 클릭 핸들러 (슬롯 모달 열기)
  const handleEggSlotClick = useCallback(() => {
    setSlotModalOpen(true);
  }, []);

  // 슬롯 모달 닫기 핸들러
  const handleSlotModalClose = useCallback(() => {
    setSlotModalOpen(false);
  }, []);

  // 내 캡슐 모달 닫기 핸들러
  const handleMyCapsuleModalClose = useCallback(() => {
    setShowMyCapsuleModal(false);
    setSelectedCapsuleId(null);
    setSelectedCapsule(null);
  }, []);

  // 내 캡슐 모달에서 위치 클릭 시 recordView 한 번만 호출
  const handleMyCapsuleLocationClick = useCallback(
    (capsule: GetCapsuleResponse) => {
      if (geolocation.latitude !== null && geolocation.longitude !== null) {
        recordView(capsule.id, {
          lat: geolocation.latitude,
          lng: geolocation.longitude,
        });
      }
    },
    [geolocation.latitude, geolocation.longitude, recordView]
  );

  // 발견 성공 모달 닫기 핸들러 (다음 30m 이내 캡슐이 있으면 순차 표시)
  const handleDiscoveryModalClose = useCallback(() => {
    setShowDiscoveryModal(false);

    const nextIndex = discoveryQueueIndex + 1;
    if (nextIndex < discoveryQueue.length) {
      const nextCapsule = discoveryQueue[nextIndex];
      setDiscoveryQueueIndex(nextIndex);
      setSelectedCapsuleId(nextCapsule.id);
      setSelectedCapsule(nextCapsule);
    } else {
      setDiscoveryQueue([]);
      setDiscoveryQueueIndex(0);
      setSelectedCapsuleId(null);
      setSelectedCapsule(null);
      clearDiscovery();
    }
  }, [
    clearDiscovery,
    discoveryQueue,
    discoveryQueueIndex,
  ]);

  // 힌트 모달 닫기 핸들러
  const handleHintModalClose = useCallback(() => {
    setShowHintModal(false);
    setSelectedCapsuleId(null);
    setSelectedCapsule(null);
  }, []);

  // 카카오 지도 스크립트 로딩
  useEffect(() => {
    if (scriptLoaded || scriptError) return;

    let isMounted = true;

    loadKakaoMapScript()
      .then(() => {
        if (isMounted) {
          setScriptLoaded(true);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : '지도 스크립트를 로드하는데 실패했습니다.';
          setScriptError(errorMessage);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [scriptLoaded, scriptError]);

  // 스크립트 로딩 중 또는 Geolocation 로딩 중
  if (!scriptLoaded && !scriptError) {
    return (
      <div className={`h-full w-full ${className}`}>
        <MapView
          onMapInit={initializeMap}
          map={null}
          isLoading={true}
        />
      </div>
    );
  }

  // Geolocation 로딩 중 (스크립트는 로드됨)
  if (scriptLoaded && geolocation.isLoading) {
    return (
      <div className={`h-full w-full ${className}`}>
        <MapView
          onMapInit={initializeMap}
          map={null}
          isLoading={true}
        />
      </div>
    );
  }

  // 스크립트 로딩 실패
  if (scriptError) {
    // 환경 변수 미설정 에러인지 확인
    const isEnvError = scriptError.includes('API 키가 설정되지 않았습니다');
    // 네트워크 에러인지 확인
    const isNetworkError = scriptError.includes('네트워크');
    
    const errorMessage = isEnvError
      ? '지도를 표시할 수 없습니다. 관리자에게 문의해주세요.'
      : scriptError;

    return (
      <div className={`h-full w-full relative ${className}`}>
        <MapView
          onMapInit={initializeMap}
          map={null}
          error={errorMessage}
        />
        {/* 네트워크 에러인 경우 재시도 버튼 표시 */}
        {isNetworkError && (
          <div style={{ 
            position: 'absolute', 
            bottom: '50%', 
            left: '50%', 
            transform: 'translate(-50%, 50%)',
            marginTop: '40px'
          }}>
            <button
              onClick={handleRetry}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
              aria-label="지도 다시 불러오기"
            >
              다시 시도 {retryCount > 0 && `(${retryCount})`}
            </button>
          </div>
        )}
        {/* 개발 환경에서만 상세 에러 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            padding: '8px', 
            backgroundColor: '#fee', 
            fontSize: '12px',
            borderTop: '1px solid #fcc'
          }}>
            <strong>개발자 정보:</strong> {scriptError}
          </div>
        )}
      </div>
    );
  }

  // 지도 렌더링
  return (
    <div className={`h-full w-full relative ${className}`}>
      <MapView
        onMapInit={initializeMap}
        map={map}
        isLoading={isLoading}
        error={error}
      />
      {map && (
        <>
          <LocationDisplay 
            map={map}
            userLat={geolocation.latitude}
            userLng={geolocation.longitude}
          />
          <MapControls 
            map={map}
            userLat={geolocation.latitude}
            userLng={geolocation.longitude}
          />
          {/* 캡슐 마커 표시 */}
          <CapsuleMarkers
            map={map}
            capsules={capsules}
            onMarkerClick={handleMarkerClick}
          />
          {/* FAB 버튼은 항상 표시 (GNB 위에 위치) */}
          <FabButton
            onEasterEggClick={handleEasterEggClick}
            onTimeCapsuleClick={handleTimeCapsuleClick}
          />
          {/* 알 슬롯 (우측 상단) */}
          <EggSlot
            count={slotInfo?.remainingSlots ?? 0}
            onClick={handleEggSlotClick}
            isLoading={isSlotLoading}
          />
        </>
      )}

      {/* 슬롯 정보 모달 */}
      <EggSlotModal
        isOpen={slotModalOpen}
        onClose={handleSlotModalClose}
      />

      {/* 이스터에그 바텀시트 */}
      <EasterEggBottomSheet
        isOpen={easterEggSheetOpen}
        onClose={handleEasterEggSheetClose}
        onConfirm={handleEasterEggConfirm}
      />

      {/* 내 캡슐 모달 */}
      <MyCapsuleModal
        isOpen={showMyCapsuleModal}
        capsule={capsuleDetail}
        onClose={handleMyCapsuleModalClose}
        onLocationClick={handleMyCapsuleLocationClick}
      />

      {/* 발견 성공 모달 */}
      <DiscoveryModal
        isOpen={showDiscoveryModal}
        capsule={capsuleDetail}
        onClose={handleDiscoveryModalClose}
      />

      {/* 힌트 모달 */}
      <HintModal
        isOpen={showHintModal}
        capsule={capsuleDetail}
        distance={selectedCapsule?.distance_m}
        direction={
          selectedCapsule && geolocation.latitude && geolocation.longitude
            ? calculateDirection(
                geolocation.latitude,
                geolocation.longitude,
                selectedCapsule.latitude,
                selectedCapsule.longitude
              )
            : 0
        }
        onClose={handleHintModalClose}
      />

      {/* Toast 메시지 */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
        type={toast.type}
        duration={3000}
        position="bottom"
      />
    </div>
  );
}
