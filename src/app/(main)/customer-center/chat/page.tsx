/**
 * 고객센터 채팅방 페이지 (한 유저당 채팅방 1개)
 * GNB 포함 레이아웃, 하단 60px 여백으로 입력창이 GNB에 가리지 않음
 */

'use client';

import React from 'react';
import { ChatRoom } from '@/components/customer-center/components/chat-room';
import styles from './page.module.css';

export default function CustomerCenterChatPage() {
  return (
    <div className={styles.wrapper}>
      <ChatRoom inquiryTitle="고객센터" />
    </div>
  );
}
