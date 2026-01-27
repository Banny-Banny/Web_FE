import { useState, useCallback, useRef } from 'react';
import { CapsuleItem } from '@/commons/apis/easter-egg/types';
import { calculateDistance } from '@/commons/utils/distance/calculate-distance';

/**
 * 자동 발견 감지 훅
 * 사용자 위치와 캡슐 간의 거리를 계산하여 30m 이내 친구 이스터에그를 자동으로 감지합니다.
 * 
 * ⚠️ 참고: 이스터에그만 대상입니다. 타임캡슐은 자동 발견 대상이 아닙니다.
 */
export const useAutoDiscovery = () => {
  const [discoveredCapsule, setDiscoveredCapsule] = useState<CapsuleItem | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const discoveredIdsRef = useRef<Set<string>>(new Set()); // 이미 발견한 캡슐 ID 추적

  /**
   * 발견 여부 확인
   * @param userLat - 사용자 현재 위도
   * @param userLng - 사용자 현재 경도
   * @param capsules - 주변 캡슐 목록
   */
  const checkDiscovery = useCallback(
    (userLat: number | null, userLng: number | null, capsules: CapsuleItem[]) => {
      // 위치 정보가 없으면 종료
      if (userLat === null || userLng === null) {
        return;
      }

      setIsChecking(true);

      try {
        // 이스터에그이고, 친구 것이고, 30m 이내인 캡슐만 필터링
        const discoverable = capsules.filter((capsule) => {
          // 이미 발견한 캡슐은 제외
          if (discoveredIdsRef.current.has(capsule.id)) {
            return false;
          }

          // 타입 체크: 이스터에그만 대상
          if (capsule.type !== 'EASTER_EGG') {
            return false;
          }

          // 소유자 체크: 내 캡슐은 자동 발견 대상이 아님
          if (capsule.is_mine) {
            return false;
          }

          // 거리 계산
          const distance = calculateDistance(
            userLat,
            userLng,
            capsule.latitude,
            capsule.longitude
          );

          // 30m 이내인지 확인
          return distance <= 30;
        });

        // 여러 캡슐이 발견되면 가장 가까운 것 선택
        if (discoverable.length > 0) {
          const nearest = discoverable.reduce((prev, curr) => {
            const prevDistance = calculateDistance(
              userLat,
              userLng,
              prev.latitude,
              prev.longitude
            );
            const currDistance = calculateDistance(
              userLat,
              userLng,
              curr.latitude,
              curr.longitude
            );
            return currDistance < prevDistance ? curr : prev;
          });

          // 발견한 캡슐 ID 기록
          discoveredIdsRef.current.add(nearest.id);
          setDiscoveredCapsule(nearest);
        }
      } catch (error) {
        console.error('자동 발견 감지 중 오류:', error);
      } finally {
        setIsChecking(false);
      }
    },
    []
  );

  /**
   * 발견된 캡슐 초기화
   */
  const clearDiscovery = useCallback(() => {
    setDiscoveredCapsule(null);
  }, []);

  /**
   * 발견 기록 초기화 (테스트 또는 리셋 용도)
   */
  const resetDiscoveryHistory = useCallback(() => {
    discoveredIdsRef.current.clear();
  }, []);

  return {
    discoveredCapsule,
    isChecking,
    checkDiscovery,
    clearDiscovery,
    resetDiscoveryHistory,
  };
};
