/**
 * @fileoverview 공지사항 컴포넌트 타입
 */

import type { NoticeListItem, NoticeDetail } from '@/commons/apis/notices/types';

/** 목록 컨테이너 Props */
export interface NoticeListProps {
  className?: string;
}

/** 상세 컨테이너 Props */
export interface NoticeDetailProps {
  id: string;
  className?: string;
}

/** 목록 아이템 Props (내부 컴포넌트용) */
export interface NoticeListItemProps {
  item: NoticeListItem;
  onPress: (id: string) => void;
}

/** 상세 본문 표시용 (NoticeDetail 데이터) */
export type NoticeDetailData = NoticeDetail;
