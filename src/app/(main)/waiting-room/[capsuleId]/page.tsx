/**
 * @fileoverview 대기실 페이지
 * @description 대기실 페이지 라우팅
 */

'use client';

import { use } from 'react';
import { WaitingRoom } from '@/components/WaitingRoom';

/**
 * 대기실 페이지
 *
 * URL 파라미터에서 capsuleId를 추출하여 WaitingRoom 컴포넌트에 전달합니다.
 *
 * @param {Object} props - 페이지 props
 * @param {Promise<Object>} props.params - URL 파라미터 (Next.js 15+ Promise)
 * @param {string} props.params.capsuleId - 대기실 ID (캡슐 ID)
 */
export default function WaitingRoomPage({
  params,
}: {
  params: Promise<{ capsuleId: string }>;
}) {
  const { capsuleId } = use(params);
  return <WaitingRoom capsuleId={capsuleId} />;
}
