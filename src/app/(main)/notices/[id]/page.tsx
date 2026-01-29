/**
 * 공지사항 상세 페이지
 */

'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import NoticeDetail from '@/components/notice/notice-detail';

export default function NoticeDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';

  return <NoticeDetail id={id} />;
}
