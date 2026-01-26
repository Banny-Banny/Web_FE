/**
 * EggSlot 컴포넌트 타입 정의
 */

/**
 * EggSlot 컴포넌트 Props
 */
export interface EggSlotProps {
  /** 알림 개수 */
  count: number;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 알림 데이터 타입
 */
export interface NotificationData {
  /** 알림 ID */
  id: string;
  /** 알림 제목 */
  title: string;
  /** 알림 내용 */
  message: string;
  /** 알림 타입 (이스터에그 또는 타임캡슐) */
  type: 'easter-egg' | 'time-capsule';
  /** 생성 일시 */
  createdAt: string;
  /** 읽음 여부 */
  isRead: boolean;
}
