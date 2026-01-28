/**
 * 고객센터 채팅 WebSocket URL 유틸
 */

export const CHAT_NAMESPACE = '/user-chat';

/**
 * Socket.IO 서버 URL (API 베이스에서 /api 제거, 유저 채팅 네임스페이스용)
 */
export function getChatSocketUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  if (!url || url === 'your_api_url' || url.includes('your_api')) return null;
  let base = url.trim().replace(/\/+$/, '');
  base = base.replace(/\/api$/i, '');
  return base;
}
