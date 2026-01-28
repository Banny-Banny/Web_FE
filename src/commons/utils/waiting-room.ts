/**
 * @fileoverview 대기실 관련 유틸리티 함수
 * @description 대기실 상태, 날짜, 참여자 역할 등을 사용자 친화적인 텍스트로 변환하는 함수
 */

/**
 * 대기실 상태를 사용자 친화적인 텍스트로 변환
 * 
 * @param {string} status - 대기실 상태 ('WAITING' | 'IN_PROGRESS' | 'COMPLETED')
 * @returns {string} 사용자 친화적인 상태 텍스트
 * 
 * @example
 * ```typescript
 * const statusText = getWaitingRoomStatusText('WAITING'); // '대기 중'
 * ```
 */
export function getWaitingRoomStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    WAITING: '대기 중',
    IN_PROGRESS: '진행 중',
    COMPLETED: '완료됨',
  };
  
  return statusMap[status] || '알 수 없음';
}

/**
 * 날짜를 사용자 친화적인 형식으로 포맷팅
 * 
 * @param {string} dateString - ISO 8601 형식의 날짜 문자열
 * @returns {string} 포맷팅된 날짜 문자열 (예: "2026년 1월 27일")
 * 
 * @example
 * ```typescript
 * const formattedDate = formatOpenDate('2026-01-27T00:00:00Z'); // '2026년 1월 27일'
 * ```
 */
export function formatOpenDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 참여자 역할을 사용자 친화적인 텍스트로 변환
 * 
 * @param {string} role - 참여자 역할 ('HOST' | 'PARTICIPANT')
 * @returns {string} 사용자 친화적인 역할 텍스트
 * 
 * @example
 * ```typescript
 * const roleText = getParticipantRoleText('HOST'); // '방장'
 * ```
 */
export function getParticipantRoleText(role: string): string {
  const roleMap: Record<string, string> = {
    HOST: '방장',
    PARTICIPANT: '참여자',
  };
  
  return roleMap[role] || '참여자';
}
