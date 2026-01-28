/**
 * PageHeader 컴포넌트 타입 정의
 */

export interface PageHeaderProps {
  /** 제목 */
  title: string;
  /** 닫기 버튼 클릭 핸들러 */
  onButtonPress?: () => void;
  /** 서브타이틀 (선택) */
  subtitle?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}
