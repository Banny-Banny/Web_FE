/**
 * useMyEggList Hook
 * 이스터에그 목록 비즈니스 로직 훅
 * 
 * TODO: API 연결 후 구현 예정
 */

'use client';

import { useState } from 'react';

interface UseMyEggListProps {
  onItemPress?: (item: { id: string; eggId: number }, index: number) => void;
  onHeaderButtonPress?: () => void;
}

export function useMyEggList({ onItemPress, onHeaderButtonPress }: UseMyEggListProps) {
  // 탭 관련
  const [activeTab, setActiveTab] = useState<'discovered' | 'planted'>('discovered');
  
  // 필터 관련
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'latest' | 'oldest'>('latest');
  
  // 모달 관련
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEggData, setSelectedEggData] = useState<any>(null);
  
  // 데이터 (임시)
  const currentItems: any[] = [];
  const discoveredCount = 0;
  const plantedCount = 0;
  const activeCount = 0;

  const handleFilterPress = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterOptionSelect = (option: 'latest' | 'oldest') => {
    setSelectedFilter(option);
  };

  const handleItemPress = (item: any, index: number) => {
    setSelectedEggData(item);
    setModalVisible(true);
    onItemPress?.(item, index);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedEggData(null);
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
    handleItemPress,
    handleModalClose,
    // 헤더 관련
    handleHeaderButtonPress,
    // 데이터
    currentItems,
    discoveredCount,
    plantedCount,
    activeCount,
  };
}
