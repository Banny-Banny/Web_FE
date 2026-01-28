/**
 * components/my-egg-list/index.tsx
 * 이스터에그 목록 Feature Container
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (div, button 등 기본 HTML 태그 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.module.css에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] 컴포넌트 조합 방식
 *
 * Figma 노드 ID: 161:29166 (발견한 알), 161:25846 (심은 알)
 * 생성 시각: 2026-01-28
 */

'use client';

import React from 'react';
import { Filter } from './components/filter';
import { PageHeader } from '@/commons/components/page-header';
import { ItemList } from './components/item-list';
import { EasterEggModal } from './components/modal';
import { Tab } from './components/tab';
import { useMyEggList } from './hooks/useMyEggList';
import styles from './styles.module.css';

interface MyEggListProps {
  onItemPress?: (item: { id: string; eggId: number }, index: number) => void;
  onHeaderButtonPress?: () => void;
}

export default function MyEggList({ onItemPress, onHeaderButtonPress }: MyEggListProps) {
  // 모든 비즈니스 로직을 hook에서 가져옴
  const {
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
  } = useMyEggList({
    onItemPress,
    onHeaderButtonPress,
  });

  return (
    <div className={styles.container}>
      <PageHeader
        title="이스터에그"
        subtitle={`발견한 알 ${discoveredCount}개 · 심은 알 ${plantedCount}개 (활성 ${activeCount}/${activeCount})`}
        onButtonPress={handleHeaderButtonPress}
      />
      <Tab
        activeTab={activeTab}
        onTabChange={setActiveTab}
        discoveredCount={discoveredCount}
        plantedCount={plantedCount}
      />
      {activeTab === 'discovered' && (
        <div className={styles.filterContainer}>
          <Filter
            isOpen={filterOpen}
            selectedOption={selectedFilter}
            onPress={handleFilterPress}
            onOptionSelect={handleFilterOptionSelect}
          />
        </div>
      )}
      <ItemList
        key={`item-list-${activeTab}`}
        items={currentItems.length > 0 ? currentItems : undefined}
        tabType={activeTab}
        onItemPress={handleItemPress}
      />

      {/* 이스터에그 상세 모달 */}
      <EasterEggModal visible={modalVisible} onClose={handleModalClose} data={selectedEggData} />
    </div>
  );
}
