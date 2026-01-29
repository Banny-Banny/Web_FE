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
  // 디버깅: 전체 API 응답 확인
  console.log('[transformEggDetailToModalData] 전체 detail 응답:', JSON.stringify(detail, null, 2));
  
  // message 필드 처리 (content 우선, 없으면 message)
  const message = detail.content || detail.message || '';

  // type 필드 처리 (viewers 길이로 PLANTED 판단)
  // PLANTED: 내가 심은 알 (viewers가 있으면 PLANTED)
  // FOUND: 내가 발견한 알 (viewers가 없거나 비어있으면 FOUND)
  const type = detail.type || (detail.viewers && detail.viewers.length > 0 ? 'PLANTED' : 'FOUND');

  // eggId: id 필드 또는 eggId 필드 사용
  const eggId = detail.id || detail.eggId || '';
  
  // 좌표: latitude, longitude 또는 location 객체에서 추출 (API가 문자열로 올 수 있으므로 숫자로 변환)
  const latRaw = detail.latitude ?? detail.location?.latitude ?? undefined;
  const lngRaw = detail.longitude ?? detail.location?.longitude ?? undefined;
  const latitude = latRaw != null ? Number(latRaw) : undefined;
  const longitude = lngRaw != null ? Number(lngRaw) : undefined;
  
  // 생성일: created_at 또는 createdAt 또는 createdDate
  const createdAt = detail.created_at || detail.createdAt || detail.createdDate || '';
  
  // 발견일: found_at 또는 foundAt 또는 foundDate
  const foundAt = detail.found_at || detail.foundAt || detail.foundDate || null;

  // 미디어 정보 추출
  // 1. 이미 변환된 데이터인 경우 (imageMediaId, imageObjectKey 등이 이미 있음)
  // 2. 원본 API 응답인 경우 (media_items 배열에서 추출)
  let imageMediaId: string | null = null;
  let imageObjectKey: string | null = null;
  let audioMediaId: string | null = null;
  let audioObjectKey: string | null = null;
  let videoMediaId: string | null = null;
  let videoObjectKey: string | null = null;

  // 이미 변환된 데이터인지 확인 (imageMediaId, imageObjectKey 등이 이미 있음)
  if (detail.imageMediaId !== undefined || detail.imageObjectKey !== undefined) {
    // 이미 변환된 데이터: 직접 사용
    imageMediaId = detail.imageMediaId ?? null;
    imageObjectKey = detail.imageObjectKey ?? null;
    audioMediaId = detail.audioMediaId ?? null;
    audioObjectKey = detail.audioObjectKey ?? null;
    videoMediaId = detail.videoMediaId ?? null;
    videoObjectKey = detail.videoObjectKey ?? null;
  } else {
    // 원본 API 응답: media_items 배열에서 추출
    const mediaItems = detail.media_items || detail.mediaItems || detail.medias || [];
    
    // 미디어 항목에서 이미지/오디오/비디오 추출
    const imageItem = Array.isArray(mediaItems) 
      ? mediaItems.find((item: any) => item.type === 'IMAGE' || item.media_type === 'IMAGE')
      : null;
    const audioItem = Array.isArray(mediaItems)
      ? mediaItems.find((item: any) => item.type === 'AUDIO' || item.media_type === 'AUDIO')
      : null;
    const videoItem = Array.isArray(mediaItems)
      ? mediaItems.find((item: any) => item.type === 'VIDEO' || item.media_type === 'VIDEO')
      : null;
    
    // media_id 추출 (다양한 필드명 지원: media_id, mediaId, id)
    const getMediaId = (item: any) => {
      if (!item) return null;
      return item.media_id || item.mediaId || item.id || null;
    };
    
    // object_key 추출 (다양한 필드명 지원: object_key, objectKey, key)
    const getObjectKey = (item: any) => {
      if (!item) return null;
      return item.object_key || item.objectKey || item.key || null;
    };

    imageMediaId = getMediaId(imageItem);
    imageObjectKey = getObjectKey(imageItem);
    audioMediaId = getMediaId(audioItem);
    audioObjectKey = getObjectKey(audioItem);
    videoMediaId = getMediaId(videoItem);
    videoObjectKey = getObjectKey(videoItem);
  }

  return {
    eggId,
    type,
    isMine: detail.isMine ?? false, // detail API에서 isMine 정보를 제공할 수도 있음
    title: detail.title || '',
    message,
    imageMediaId,
    imageObjectKey,
    audioMediaId,
    audioObjectKey,
    videoMediaId,
    videoObjectKey,
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
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지 (구 cacheTime)
    retry: 2,
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재조회 방지
    refetchOnMount: false, // 마운트 시 자동 재조회 방지 (staleTime 내에서는)
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
    staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지 (구 cacheTime)
    retry: 2,
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재조회 방지
    refetchOnMount: false, // 마운트 시 자동 재조회 방지 (staleTime 내에서는)
  });

  // 상세 정보 조회 (모달 열기 시)
  // 모달이 열릴 때마다 항상 최신 데이터를 가져오기 위해 staleTime을 0으로 설정
  const {
    data: eggDetailData,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
  } = useQuery({
    queryKey: ['eggDetail', selectedEggId],
    queryFn: async () => {
      if (!selectedEggId) {
        throw new Error('Egg ID is required');
      }
      const response = await getEggDetail(selectedEggId);
      // 디버깅: 실제 API 응답 확인
      console.log('[useMyEggList] 실제 API 응답 (getEggDetail):', JSON.stringify(response, null, 2));
      return response;
    },
    enabled: !!selectedEggId && modalVisible, // 모달이 열려있고 ID가 있을 때만 조회
    staleTime: 0, // 항상 최신 데이터를 가져오기 위해 캐시 사용 안 함
    gcTime: 1000 * 60 * 5, // 5분 후 가비지 컬렉션
    retry: 2,
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재조회 방지 (모달이 열려있을 때만 조회)
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
