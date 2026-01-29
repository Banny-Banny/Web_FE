/**
 * My Eggs Page
 * 
 * @description
 * - 이스터에그 목록 페이지
 * - GNB 표시 (Main Layout 적용)
 * - X 버튼: 마이페이지(/profile)로 이동
 */

'use client';

import { useRouter } from 'next/navigation';
import MyEggList from '@/components/my-egg-list';

export default function MyEggsPage() {
  const router = useRouter();
  return (
    <MyEggList onHeaderButtonPress={() => router.push('/profile')} />
  );
}
