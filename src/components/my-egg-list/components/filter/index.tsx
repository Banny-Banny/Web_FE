/**
 * components/my-egg-list/components/filter/index.tsx
 * 이스터에그 목록 필터 컴포넌트
 *
 * 체크리스트:
 * - [✓] JSX 구조만 작성 (div, button 등 기본 HTML 태그 사용)
 * - [✓] 인라인 스타일 0건
 * - [✓] 모든 스타일은 styles.module.css에서 import하여 사용
 * - [✓] @remixicon/react 사용
 * - [✓] 색상 하드코딩 0건 (토큰만 사용)
 *
 * 일반적인 필터 UI 패턴 적용:
 * - 버튼은 항상 표시
 * - 드롭다운은 버튼 아래에 나타남
 * - 선택 시 드롭다운 자동 닫힘
 */

'use client';

import React from 'react';
import { RiArrowUpSLine, RiArrowDownSLine, RiCheckLine } from '@remixicon/react';
import styles from './styles.module.css';

interface FilterProps {
  isOpen?: boolean;
  selectedOption?: 'latest' | 'oldest';
  onPress?: () => void;
  onOptionSelect?: (option: 'latest' | 'oldest') => void;
}

export function Filter({
  isOpen = false,
  selectedOption = 'latest',
  onPress,
  onOptionSelect,
}: FilterProps) {
  const handleOptionSelect = (option: 'latest' | 'oldest') => {
    onOptionSelect?.(option);
    onPress?.(); // 드롭다운 닫기
  };

  return (
    <div className={styles.container}>
      {/* 필터 버튼 - 항상 표시 */}
      <button
        className={styles.button}
        onClick={onPress}
        type="button"
        aria-label="필터">
        <span className={styles.buttonText}>
          {selectedOption === 'latest' ? '최신발견순' : '오래된순'}
        </span>
        <span className={styles.iconContainer}>
          {isOpen ? (
            <RiArrowUpSLine size={13} className={styles.icon} />
          ) : (
            <RiArrowDownSLine size={13} className={styles.icon} />
          )}
        </span>
      </button>

      {/* 드롭다운 메뉴 - 열림 상태일 때만 표시 */}
      {isOpen && (
        <div className={styles.dropdownWrapper}>
          <div className={styles.dropdown}>
            <button
              className={`${styles.dropdownItem} ${
                selectedOption === 'latest' ? styles.dropdownItemSelected : ''
              }`}
              onClick={() => handleOptionSelect('latest')}
              type="button"
              aria-label="최신발견순">
              <span
                className={`${styles.dropdownItemText} ${
                  selectedOption === 'latest' ? styles.dropdownItemTextSelected : ''
                }`}>
                최신발견순
              </span>
              {selectedOption === 'latest' && (
                <span className={styles.checkIconContainer}>
                  <RiCheckLine size={16} className={styles.checkIcon} />
                </span>
              )}
            </button>
            <div className={styles.divider} />
            <button
              className={`${styles.dropdownItem} ${
                selectedOption === 'oldest' ? styles.dropdownItemSelected : ''
              }`}
              onClick={() => handleOptionSelect('oldest')}
              type="button"
              aria-label="오래된순">
              <span
                className={`${styles.dropdownItemText} ${
                  selectedOption === 'oldest' ? styles.dropdownItemTextSelected : ''
                }`}>
                오래된순
              </span>
              {selectedOption === 'oldest' && (
                <span className={styles.checkIconContainer}>
                  <RiCheckLine size={16} className={styles.checkIcon} />
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
