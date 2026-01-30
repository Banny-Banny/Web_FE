import type { MyCapsuleItem, CapsuleDetailSlot } from '@/commons/apis/me/capsules/types';

export interface CapsuleHeaderProps {
  openedCount: number;
  lockedCount: number;
  onClose: () => void;
}

export interface WaitingRoomSectionProps {
  capsules: MyCapsuleItem[];
  onCardClick: (capsuleId: string) => void;
}

export type CapsuleTabType = 'opened' | 'locked';

export interface CapsuleTabsProps {
  activeTab: CapsuleTabType;
  openedCount: number;
  lockedCount: number;
  onTabChange: (tab: CapsuleTabType) => void;
}

export interface OpenedCapsuleListProps {
  capsules: MyCapsuleItem[];
  onCardClick: (capsuleId: string) => void;
}

export interface LockedCapsuleListProps {
  capsules: MyCapsuleItem[];
}

export interface CapsuleDetailModalProps {
  visible: boolean;
  capsuleId: string | null;
  title: string;
  slots: CapsuleDetailSlot[];
  selectedSlotIndex: number;
  onSelectSlot: (index: number) => void;
  onClose: () => void;
  /** 상세 로딩 중 */
  isLoading?: boolean;
  /** 403/404 등 에러 메시지 */
  errorMessage?: string | null;
}
