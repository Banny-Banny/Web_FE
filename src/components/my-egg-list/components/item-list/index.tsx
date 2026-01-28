/**
 * components/my-egg-list/components/item-list/index.tsx
 * 이스터에그 목록 아이템 리스트 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (div 등 기본 HTML 태그 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.module.css에서 import하여 사용
 * - [✓] 피그마 디자인 1:1 대응
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 *
 * Figma 노드 ID: 585:2855
 * 생성 시각: 2026-01-28
 */

'use client';

import React, { useMemo } from 'react';
import { Item } from '../item';
import type { ItemProps } from '../item';
import styles from './styles.module.css';

interface ItemListProps {
  items?: ItemProps[];
  tabType?: 'discovered' | 'planted';
  onItemPress?: (item: ItemProps, index: number) => void;
}

export function ItemList({
  items = [],
  tabType = 'discovered',
  onItemPress,
}: ItemListProps) {
  // items가 없으면 빈 배열 사용
  const displayItems = items;

  // 심은 알인 경우 활성/소멸 구분
  const { activeItems, expiredItems } = useMemo(() => {
    if (tabType !== 'planted') {
      return { activeItems: displayItems, expiredItems: [] };
    }

    const active: ItemProps[] = [];
    const expired: ItemProps[] = [];

    displayItems.forEach((item) => {
      if (item.status === 'EXPIRED') {
        expired.push(item);
      } else {
        active.push(item);
      }
    });

    return { activeItems: active, expiredItems: expired };
  }, [displayItems, tabType]);

  // 항상 같은 구조를 반환하여 React 내부 에러 방지
  const showSections = tabType === 'planted' && expiredItems.length > 0;

  // 렌더링할 아이템 목록 준비
  const renderContent = useMemo(() => {
    if (showSections) {
      return (
        <>
          {/* 활성 알 섹션 */}
          {activeItems.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>활성 알 ({activeItems.length})</h2>
              </div>
              {activeItems.map((item, index) => {
                const originalIndex = displayItems.findIndex((i) => i.id === item.id);
                return (
                  <Item
                    key={item.id || `active-${item.title}-${index}`}
                    {...item}
                    showViewCount={true}
                    onPress={() => onItemPress?.(item, originalIndex >= 0 ? originalIndex : index)}
                  />
                );
              })}
            </div>
          )}

          {/* 소멸된 알 섹션 */}
          {expiredItems.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitleExpired}>소멸된 알 ({expiredItems.length})</h2>
              </div>
              {expiredItems.map((item, index) => {
                const originalIndex = displayItems.findIndex((i) => i.id === item.id);
                return (
                  <Item
                    key={item.id || `expired-${item.title}-${index}`}
                    {...item}
                    showViewCount={true}
                    onPress={() => onItemPress?.(item, originalIndex >= 0 ? originalIndex : index)}
                  />
                );
              })}
            </div>
          )}
        </>
      );
    }

    // 발견한 알 또는 활성 알만 있는 경우
    return displayItems.map((item, index) => (
      <Item
        key={item.id || `${item.title}-${index}`}
        {...item}
        showViewCount={tabType === 'planted'}
        onPress={() => onItemPress?.(item, index)}
      />
    ));
  }, [showSections, activeItems, expiredItems, displayItems, tabType, onItemPress]);

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>{renderContent}</div>
    </div>
  );
}
