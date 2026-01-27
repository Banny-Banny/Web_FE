/**
 * @fileoverview 타임캡슐 생성 페이지
 * @description 타임캡슐 생성 페이지 라우팅
 */

import { TimecapsuleCreate } from '@/components/TimecapsuleCreate';

/**
 * 타임캡슐 생성 페이지
 * 
 * 라우팅 전용 페이지입니다.
 * 실제 컴포넌트는 TimecapsuleCreate에서 구현됩니다.
 */
export default function TimecapsuleCreatePage() {
  return <TimecapsuleCreate />;
}
