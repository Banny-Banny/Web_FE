/**
 * @fileoverview TimeCapsuleHeader 컴포넌트 타입 정의
 * @description 타임캡슐 헤더 공통 컴포넌트의 Props 및 관련 타입
 */

import type { IconName } from '../icon/types';

/**
 * lucide-react 아이콘 이름 (추가 지원)
 */
export type LucideIconName = 'arrow-left' | 'more' | 'more-2-fill' | 'close' | 'close-line';

/**
 * 헤더에서 사용 가능한 모든 아이콘 이름
 */
export type HeaderIconName = IconName | LucideIconName;

/**
 * 오른쪽 아이콘 버튼 타입
 */
export interface RightIcon {
  /** Icon 컴포넌트의 아이콘 이름 또는 lucide-react 아이콘 이름 (icon 또는 imageSource 중 하나 필수) */
  icon?: HeaderIconName;
  /** 이미지 소스 URL 또는 경로 (icon 또는 imageSource 중 하나 필수) */
  imageSource?: string;
  /** 아이콘 크기 (기본값: 24) */
  size?: number;
  /** 아이콘 색상 (기본값: Colors.black[500], imageSource 사용 시 무시) */
  color?: string;
  /** 버튼 클릭 핸들러 */
  onPress: () => void;
  /** 접근성 라벨 */
  accessibilityLabel?: string;
}

/**
 * TimeCapsuleHeader Props 타입
 */
export interface TimeCapsuleHeaderProps {
  /** 헤더 제목 (필수) */
  title: string;
  /** 뒤로가기 핸들러 (선택, 있으면 뒤로가기 버튼 표시) */
  onBack?: () => void;
  /** 오른쪽 아이콘 버튼들 (선택) */
  rightIcons?: RightIcon[];
  /** 하단 보더 표시 여부 (기본값: true) */
  showBorder?: boolean;
  /** 배경색 (기본값: Colors.white[500]) */
  backgroundColor?: string;
  /** 제목 정렬 (기본값: 'center') */
  titleAlign?: 'left' | 'center';
  /** 추가 CSS 클래스 */
  className?: string;
}
