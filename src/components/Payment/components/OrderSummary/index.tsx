'use client';

/**
 * @fileoverview OrderSummary 컴포넌트
 * @description 주문 상품 정보를 표시하는 컴포넌트 (Figma 디자인 기반)
 */

import React from 'react';
import type { OrderSummaryProps } from './types';
import styles from './styles.module.css';

/**
 * 가격 계산 함수
 * 참여 인원수와 옵션에 따라 가격을 계산합니다.
 * 
 * 계산 방식:
 * - 사진: 인원수 × 사진 개수 × 500원
 * - 음악: 인원수 × 1,000원
 * - 동영상: 인원수 × 2,000원
 */
function calculateItemPrice(
  basePrice: number,
  headcount: number,
  quantity?: number
): number {
  if (quantity !== undefined) {
    // 사진의 경우: 인원수 × 사진 개수 × basePrice
    return headcount * quantity * basePrice;
  }
  // 음악/동영상의 경우: 인원수 × basePrice
  return headcount * basePrice;
}

/**
 * OrderSummary 컴포넌트
 * 
 * Figma 디자인에 따른 주문 상품 정보를 표시합니다.
 * - 참여 인원
 * - 사진 (500원 x 개수)
 * - 음악 (1,000원 x 인원수)
 * - 동영상 (1,000원 x 인원수)
 * - 합계
 */
export function OrderSummary({ data }: OrderSummaryProps) {
  // 각 항목별 가격 계산
  const photoPrice = data.photoCount > 0 
    ? calculateItemPrice(500, data.headcount, data.photoCount)
    : 0;
  const musicPrice = data.addMusic 
    ? calculateItemPrice(1000, data.headcount)
    : 0;
  const videoPrice = data.addVideo 
    ? calculateItemPrice(2000, data.headcount)
    : 0;

  // 합계는 주문 데이터의 totalAmount 사용 (타임 옵션 가격 포함)
  const totalPrice = data.totalAmount;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>주문 상품</h2>
      </div>
      
      <div className={styles.content}>
        {/* 참여 인원 */}
        <div className={styles.row}>
          <span className={styles.label}>참여 인원</span>
          <span className={styles.value}>{data.headcount}명</span>
        </div>
        
        {/* 사진 */}
        {data.photoCount > 0 && (
          <div className={styles.row}>
            <span className={styles.label}>사진</span>
            <div className={styles.priceInfo}>
              <span className={styles.priceDetail}>
                500원 x {data.photoCount}개
              </span>
              <span className={styles.priceValue}>{photoPrice.toLocaleString('ko-KR')}원</span>
            </div>
          </div>
        )}
        
        {/* 음악 */}
        {data.addMusic && (
          <div className={styles.row}>
            <span className={styles.label}>음악</span>
            <div className={styles.priceInfo}>
              <span className={styles.priceDetail}>1,000원</span>
              <span className={styles.priceValue}>{musicPrice.toLocaleString('ko-KR')}원</span>
            </div>
          </div>
        )}
        
        {/* 동영상 */}
        {data.addVideo && (
          <div className={styles.row}>
            <span className={styles.label}>동영상</span>
            <div className={styles.priceInfo}>
              <span className={styles.priceDetail}>2,000원</span>
              <span className={styles.priceValue}>{videoPrice.toLocaleString('ko-KR')}원</span>
            </div>
          </div>
        )}
        
        {/* 합계 */}
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>합계</span>
          <span className={styles.totalValue}>{totalPrice.toLocaleString('ko-KR')}원</span>
        </div>
      </div>
    </div>
  );
}
