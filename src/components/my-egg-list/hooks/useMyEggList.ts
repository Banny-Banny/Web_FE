/**
 * useMyEggList Hook
 * 이스터에그 목록 비즈니스 로직 훅
 */

'use client';

import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyEggs, getEggDetail } from '@/commons/apis/easter-egg';
import { formatDate } from '@/commons/utils';
import { default as BrokenEggSvg } from '@/assets/images/broken_egg.svg';
import { default as FilledEggSvg } from '@/assets/images/filled_egg.svg';
import type { 
  MyEggItem, 
  EggDetailResponse,
} from '@/commons/apis/easter-egg/types';
import type { ItemProps } from '../components/item';
import type { ModalEggDetailData } from '../components/modal';

interface UseMyEggListProps {
  onItemPress?: (item: { id: string; eggId: number }, index: number) => void;
  onHeaderButtonPress?: () => void;
}

/**
 * MyEggItem을 ItemProps로 변환
 */
function transformEggItemToItemProps(item: MyEggItem & { status?: 'ACTIVE' | 'EXPIRED' }): ItemProps {
  // 활성/소멸 상태 판단
  // 백엔드에서 status를 제공하면 그것을 사용, 없으면 expiredAt 기준으로 판단
  let status: 'ACTIVE' | 'EXPIRED' = 'ACTIVE';
  if (item.status) {
    status = item.status;
  } else if (item.expiredAt) {
    status = new Date(item.expiredAt) < new Date() ? 'EXPIRED' : 'ACTIVE';
  }

  // 날짜: FOUND 타입은 foundAt, PLANTED 타입은 createdAt
  const dateString = item.type === 'FOUND' && item.foundAt 
    ? item.foundAt 
    : item.createdAt;

  // 알 아이콘: PLANTED 타입이고 소멸된 경우 broken_egg.svg 사용
  const eggIcon = item.type === 'PLANTED' && status === 'EXPIRED'
    ? BrokenEggSvg
    : FilledEggSvg;

  return {
    id: item.eggId,
    title: item.title,
    description: item.message,
    location: item.location?.address,
    latitude: item.location?.latitude,
    longitude: item.location?.longitude,
    date: formatDate(dateString),
    eggIcon,
    // 백엔드에서 제공하는 hasImage, hasAudio, hasVideo를 직접 사용
    // MyEggItem에 이 필드들이 추가되어야 함
    hasImage: (item as any).hasImage ?? !!(item.imageMediaId || item.imageObjectKey),
    hasAudio: (item as any).hasAudio ?? !!(item.audioMediaId || item.audioObjectKey),
    hasVideo: (item as any).hasVideo ?? !!(item.videoMediaId || item.videoObjectKey),
    viewCount: item.discoveredCount,
    showViewCount: item.type === 'PLANTED',
    status: item.type === 'PLANTED' ? status : undefined,
    onPress: undefined, // handleItemPress에서 설정
  };
}

/**
 * EggDetailResponse를 모달 데이터로 변환
 * 새로운 데이터 구조에 맞게 변환
 */
function transformEggDetailToModalData(detail: EggDetailResponse | any): ModalEggDetailData {
  // message 필드 처리 (content 우선, 없으면 message)
  const message = detail.content || detail.message || '';

  // type 필드 처리 (viewers 길이로 PLANTED 판단)
  // PLANTED: 내가 심은 알 (viewers가 있으면 PLANTED)
  // FOUND: 내가 발견한 알 (viewers가 없거나 비어있으면 FOUND)
  const type = detail.type || (detail.viewers && detail.viewers.length > 0 ? 'PLANTED' : 'FOUND');

  // 미디어 항목에서 이미지/오디오/비디오 추출
  const imageItem = detail.media_items?.find((item: any) => item.type === 'IMAGE');
  const audioItem = detail.media_items?.find((item: any) => item.type === 'AUDIO');
  const videoItem = detail.media_items?.find((item: any) => item.type === 'VIDEO');
  
  // 디버깅: 미디어 항목 확인
  console.log('[transformEggDetailToModalData] detail.media_items:', detail.media_items);
  console.log('[transformEggDetailToModalData] imageItem:', imageItem);
  console.log('[transformEggDetailToModalData] imageItem?.media_id:', imageItem?.media_id);

  // eggId: id 필드 또는 eggId 필드 사용
  const eggId = detail.id || detail.eggId || '';
  
  // 좌표: latitude, longitude 또는 location 객체에서 추출
  const latitude = detail.latitude ?? detail.location?.latitude ?? undefined;
  const longitude = detail.longitude ?? detail.location?.longitude ?? undefined;
  
  // 생성일: created_at 또는 createdAt 또는 createdDate
  const createdAt = detail.created_at || detail.createdAt || detail.createdDate || '';
  
  // 발견일: found_at 또는 foundAt 또는 foundDate
  const foundAt = detail.found_at || detail.foundAt || detail.foundDate || null;

  return {
    eggId,
    type,
    isMine: detail.isMine ?? false, // detail API에서 isMine 정보를 제공할 수도 있음
    title: detail.title || '',
    message,
    imageMediaId: imageItem?.media_id || null,
    imageObjectKey: imageItem?.object_key || null,
    audioMediaId: audioItem?.media_id || null,
    audioObjectKey: audioItem?.object_key || null,
    videoMediaId: videoItem?.media_id || null,
    videoObjectKey: videoItem?.object_key || null,
    location: {
      address: detail.location?.address || detail.address || null, // 주소는 모달에서 Kakao API로 변환
      latitude: latitude, // undefined 허용 (모달에서 처리)
      longitude: longitude, // undefined 허용 (모달에서 처리)
    },
    author: {
      id: detail.author?.id || '',
      nickname: detail.author?.nickname || '',
      profileImg: detail.author?.profile_img || detail.author?.profileImg || null,
    },
    createdAt,
    foundAt,
    expiredAt: detail.expiredAt || detail.expired_at || null,
    discoveredCount: detail.view_count || detail.discoveredCount || detail.viewCount || 0,
    viewers: detail.viewers?.map((viewer: any) => ({
      id: viewer.id || '',
      nickname: viewer.nickname || '',
      profileImg: viewer.profile_img || viewer.profileImg || null,
      viewedAt: viewer.viewed_at || viewer.viewedAt || '',
    })) || [],
  };
}

export function useMyEggList({ onItemPress, onHeaderButtonPress }: UseMyEggListProps) {
  const queryClient = useQueryClient();
  
  // 탭 관련
  const [activeTab, setActiveTab] = useState<'discovered' | 'planted'>('discovered');
  
  // 필터 관련
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'latest' | 'oldest'>('latest');
  
  // 모달 관련
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEggId, setSelectedEggId] = useState<string | null>(null);

  // 발견한 알 목록 조회
  // 백엔드에서 sort 파라미터에 따라 정렬된 데이터를 반환하므로 프론트엔드에서 추가 정렬 불필요
  const {
    data: foundEggsData,
    isLoading: isLoadingFound,
    isError: isErrorFound,
    error: foundError,
  } = useQuery({
    queryKey: ['myEggs', 'FOUND', selectedFilter],
    queryFn: () => getMyEggs({ 
      type: 'FOUND', 
      sort: selectedFilter === 'latest' ? 'LATEST' : 'OLDEST' // 백엔드에서 정렬 처리
    }),
    staleTime: 1000 * 60 * 5, // 5분
    retry: 2,
  });

  // 심은 알 목록 조회
  const {
    data: plantedEggsData,
    isLoading: isLoadingPlanted,
    isError: isErrorPlanted,
    error: plantedError,
  } = useQuery({
    queryKey: ['myEggs', 'PLANTED'],
    queryFn: () => getMyEggs({ type: 'PLANTED' }),
    staleTime: 1000 * 60 * 5, // 5분
    retry: 2,
  });

  // 상세 정보 조회 (모달 열기 시)
  // 모달이 열릴 때마다 항상 최신 데이터를 가져오기 위해 staleTime을 0으로 설정
  const {
    data: eggDetailData,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
  } = useQuery({
    queryKey: ['eggDetail', selectedEggId],
    queryFn: () => {
      if (!selectedEggId) {
        throw new Error('Egg ID is required');
      }
      return getEggDetail(selectedEggId);
    },
    enabled: !!selectedEggId && modalVisible, // 모달이 열려있고 ID가 있을 때만 조회
    staleTime: 0, // 항상 최신 데이터를 가져오기 위해 캐시 사용 안 함
    gcTime: 1000 * 60 * 5, // 5분 후 가비지 컬렉션
    retry: 2,
  });

  // 데이터 변환 및 필터링
  const {
    currentItems,
    discoveredCount,
    plantedCount,
    activeCount,
  } = useMemo(() => {
    // 발견한 알 데이터 변환 (MyEggsFoundResponse)
    const foundItems: (MyEggItem & { hasImage?: boolean; hasAudio?: boolean; hasVideo?: boolean })[] = foundEggsData && 'data' in foundEggsData && Array.isArray(foundEggsData.data)
      ? foundEggsData.data.map((item) => ({
          eggId: item.eggId,
          type: 'FOUND' as const,
          isMine: false, // 발견한 알은 내가 만든 것이 아님
          title: item.title,
          message: item.content || '',
          imageMediaId: undefined, // API에서 미디어 ID를 제공하지 않음
          imageObjectKey: undefined,
          audioMediaId: undefined,
          audioObjectKey: undefined,
          videoMediaId: undefined,
          videoObjectKey: undefined,
          location: {
            address: '', // API에서 주소를 제공하지 않음, Item 컴포넌트에서 Kakao API로 조회
            latitude: item.latitude,
            longitude: item.longitude,
          },
          author: {
            id: '',
            nickname: '',
            profileImg: undefined,
          },
          createdAt: item.createdDate,
          foundAt: item.foundDate,
          discoveredCount: item.viewCount,
          // 백엔드에서 제공하는 hasImage, hasAudio, hasVideo를 직접 전달
          hasImage: item.hasImage,
          hasAudio: item.hasAudio,
          hasVideo: item.hasVideo,
        }))
      : [];

    // 심은 알 데이터 변환 (MyEggsPlantedResponse)
    // 백엔드에서 activeEggs와 expiredEggs로 분리되어 있으므로 각각 변환
    // status 필드를 직접 사용하여 활성/소멸 구분
    const activePlantedItems: (MyEggItem & { hasImage?: boolean; hasAudio?: boolean; hasVideo?: boolean; status?: 'ACTIVE' | 'EXPIRED' })[] = plantedEggsData && 
      'data' in plantedEggsData && 
      !Array.isArray(plantedEggsData.data) &&
      'activeEggs' in plantedEggsData.data
      ? (plantedEggsData.data.activeEggs || []).map((item) => ({
          eggId: item.eggId,
          type: 'PLANTED' as const,
          isMine: true,
          title: item.title,
          message: item.content || '',
          imageMediaId: undefined,
          imageObjectKey: undefined,
          audioMediaId: undefined,
          audioObjectKey: undefined,
          videoMediaId: undefined,
          videoObjectKey: undefined,
          location: {
            address: '', // API에서 주소를 제공하지 않음, Item 컴포넌트에서 Kakao API로 조회
            latitude: item.latitude,
            longitude: item.longitude,
          },
          author: {
            id: '',
            nickname: '',
            profileImg: undefined,
          },
          createdAt: item.createdDate,
          expiredAt: undefined, // 활성 알은 expiredAt 없음
          discoveredCount: item.viewCount,
          status: 'ACTIVE' as const, // 백엔드에서 제공하는 status 사용
          // 백엔드에서 제공하는 hasImage, hasAudio, hasVideo를 직접 전달
          hasImage: item.hasImage,
          hasAudio: item.hasAudio,
          hasVideo: item.hasVideo,
        }))
      : [];

    const expiredPlantedItems: (MyEggItem & { hasImage?: boolean; hasAudio?: boolean; hasVideo?: boolean; status?: 'ACTIVE' | 'EXPIRED' })[] = plantedEggsData && 
      'data' in plantedEggsData && 
      !Array.isArray(plantedEggsData.data) &&
      'expiredEggs' in plantedEggsData.data
      ? (plantedEggsData.data.expiredEggs || []).map((item) => ({
          eggId: item.eggId,
          type: 'PLANTED' as const,
          isMine: true,
          title: item.title,
          message: item.content || '',
          imageMediaId: undefined,
          imageObjectKey: undefined,
          audioMediaId: undefined,
          audioObjectKey: undefined,
          videoMediaId: undefined,
          videoObjectKey: undefined,
          location: {
            address: '', // API에서 주소를 제공하지 않음, Item 컴포넌트에서 Kakao API로 조회
            latitude: item.latitude,
            longitude: item.longitude,
          },
          author: {
            id: '',
            nickname: '',
            profileImg: undefined,
          },
          createdAt: item.createdDate,
          expiredAt: new Date().toISOString(), // 소멸된 알
          discoveredCount: item.viewCount,
          status: 'EXPIRED' as const, // 백엔드에서 제공하는 status 사용
          // 백엔드에서 제공하는 hasImage, hasAudio, hasVideo를 직접 전달
          hasImage: item.hasImage,
          hasAudio: item.hasAudio,
          hasVideo: item.hasVideo,
        }))
      : [];

    // 탭별 데이터 선택
    // 발견한 알: foundItems 그대로 사용
    // 심은 알: activeEggs와 expiredEggs를 분리해서 전달 (ItemList에서 섹션 구분)
    // status 필드를 포함하여 전달하여 ItemList에서 활성/소멸 구분 가능하도록 함
    const currentTabItems = activeTab === 'discovered' 
      ? foundItems 
      : [...activePlantedItems, ...expiredPlantedItems]; // 순서: 활성 알 먼저, 소멸된 알 나중

    // ItemProps로 변환 (status는 transformEggItemToItemProps에서 설정됨)
    const transformedItems = currentTabItems.map(transformEggItemToItemProps);

    // 통계 계산
    const discovered = foundItems.length;
    const planted = activePlantedItems.length + expiredPlantedItems.length;
    const active = activePlantedItems.length; // 백엔드에서 이미 활성 알 개수 제공

    return {
      currentItems: transformedItems,
      discoveredCount: discovered,
      plantedCount: planted,
      activeCount: active,
    };
  }, [foundEggsData, plantedEggsData, activeTab, selectedFilter]);

  // 모달 데이터 변환 (detail API 응답을 모달에서 사용할 수 있는 형태로 변환)
  const selectedEggData = useMemo<ModalEggDetailData | null>(() => {
    if (!eggDetailData) return null;
    return transformEggDetailToModalData(eggDetailData);
  }, [eggDetailData]);

  const handleFilterPress = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterOptionSelect = (option: 'latest' | 'oldest') => {
    setSelectedFilter(option);
    setFilterOpen(false);
  };

  const handleItemPress = (item: ItemProps, index: number) => {
    if (item.id) {
      setSelectedEggId(item.id);
      setModalVisible(true);
      onItemPress?.({ id: item.id, eggId: parseInt(item.id, 10) || 0 }, index);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    // 모달이 닫힐 때 해당 쿼리 캐시를 무효화하여 다음에 열 때 최신 데이터를 가져오도록 함
    if (selectedEggId) {
      queryClient.removeQueries({ queryKey: ['eggDetail', selectedEggId] });
    }
    setSelectedEggId(null);
  };

  const handleHeaderButtonPress = () => {
    onHeaderButtonPress?.();
  };

  return {
    // 탭 관련
    activeTab,
    setActiveTab,
    // 필터 관련
    filterOpen,
    selectedFilter,
    handleFilterPress,
    handleFilterOptionSelect,
    // 모달 관련
    modalVisible,
    selectedEggData,
    isLoadingDetail,
    isErrorDetail,
    handleItemPress,
    handleModalClose,
    // 헤더 관련
    handleHeaderButtonPress,
    // 데이터
    currentItems,
    discoveredCount,
    plantedCount,
    activeCount,
    // 로딩/에러 상태
    isLoading: isLoadingFound || isLoadingPlanted || isLoadingDetail,
    isError: isErrorFound || isErrorPlanted || isErrorDetail,
    error: foundError || plantedError,
    refetch: () => {
      // 두 쿼리 모두 재조회
      queryClient.invalidateQueries({ queryKey: ['myEggs'] });
    },
  };
}
