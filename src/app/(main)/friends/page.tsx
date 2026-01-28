/**
 * Friends Page
 * 
 * @description
 * - 친구 목록 페이지
 * - GNB 표시 (Main Layout 적용)
 */

'use client';

import { useRouter } from 'next/navigation';
import { Mypage } from '@/components/Mypage';
import { FriendList } from '@/components/Mypage/activity-stats/friend';

export default function FriendsPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/profile');
  };

  return (
    <>
      <Mypage />
      <FriendList onClose={handleClose} />
    </>
  );
}
