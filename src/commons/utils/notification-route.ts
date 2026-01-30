/**
 * 알림 type + targetId + notificationId → 이동 path 변환
 * 앱 라우트 및 백엔드 알림 type 값에 맞춰 확장 가능.
 */

/**
 * 알림 타입별 이동 path 반환
 *
 * @param type - 알림 종류 (예: SYSTEM, TIME_CAPSULE_INVITE, FRIEND_REQUEST)
 * @param targetId - 알림이 가리키는 대상 ID (타임캡슐 ID 등), 없으면 null
 * @param notificationId - 알림 자체 ID (SYSTEM 등 알림 상세로 갈 때 사용)
 * @returns 이동할 path 또는 null (대상 없음/미지원 type)
 */
export function getNotificationRoute(
  type: string,
  targetId: string | null,
  notificationId?: string
): string | null {
  if (!type) return null;

  const normalizedType = type.toUpperCase().replace(/-/g, '_');

  switch (normalizedType) {
    case 'SYSTEM':
      if (notificationId) return `/notifications/${notificationId}`;
      return null;
    case 'TIME_CAPSULE_INVITE':
    case 'WAITING_ROOM_INVITE':
      if (targetId) return `/waiting-room/${targetId}`;
      return null;
    case 'FRIEND_REQUEST':
      return '/friends';
    case 'NOTICE':
      if (targetId) return `/notices/${targetId}`;
      return '/notices';
    case 'MY_EGGS':
      return '/my-eggs';
    case 'PROFILE':
      return '/profile';
    default:
      return null;
  }
}
