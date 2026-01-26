/**
 * @fileoverview 홈 페이지
 * @description TimeEgg 홈 페이지 - 카카오 지도 표시
 */

import { HomeFeature } from '@/components/home';

export default function HomePage() {
  return (
    <div style={{ height: 'calc(100vh - 60px)', width: '100%', overflow: 'hidden' }}>
      {/* 지도 */}
      <HomeFeature />
    </div>
  );
}
