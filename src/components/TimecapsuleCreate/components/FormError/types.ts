/**
 * @fileoverview FormError 컴포넌트 타입 정의
 * @description 에러 메시지 표시 컴포넌트의 Props 타입
 */

/**
 * FormError 컴포넌트 Props
 */
export interface FormErrorProps {
  /** 에러 메시지 */
  message: string;
  /** 필드 이름 (접근성용, 선택적) */
  fieldName?: string;
  /** 추가 CSS 클래스명 (선택적) */
  className?: string;
}
