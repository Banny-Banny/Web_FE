/**
 * @fileoverview 이스터에그 모달 관련 타입 정의
 */

/** 모달에서 사용하는 이스터에그 상세 데이터 (detail API 응답을 변환한 형태) */
export interface ModalEggDetailData {
  eggId: string;
  type: 'FOUND' | 'PLANTED';
  isMine: boolean;
  title: string;
  message: string;
  imageMediaId: string | null;
  imageObjectKey: string | null;
  audioMediaId: string | null;
  audioObjectKey: string | null;
  videoMediaId: string | null;
  videoObjectKey: string | null;
  location: {
    address: string | null;
    latitude: number | undefined;
    longitude: number | undefined;
  };
  author: {
    id: string;
    nickname: string;
    profileImg: string | null;
  };
  createdAt: string;
  foundAt: string | null;
  expiredAt: string | null;
  discoveredCount: number;
  viewers: Array<{
    id: string;
    nickname: string;
    profileImg: string | null;
    viewedAt: string;
  }>;
}

export interface EasterEggModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 이스터에그 상세 데이터 (detail API 응답을 변환한 데이터) */
  data: ModalEggDetailData | null;
  /** 상세 정보 로딩 중 여부 */
  isLoading?: boolean;
  /** 상세 정보 로딩 에러 여부 */
  isError?: boolean;
}
