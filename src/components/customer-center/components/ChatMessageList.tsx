'use client';

/**
 * 채팅 메시지 리스트
 */

import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import type { ChatMessageWithStatus } from '../types';
import styles from './ChatMessageList.module.css';

interface ChatMessageListProps {
  messages: ChatMessageWithStatus[];
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export function ChatMessageList({
  messages,
  onLoadMore: _onLoadMore,
  isLoading = false,
}: ChatMessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0 && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length]);

  const renderItem = (item: ChatMessageWithStatus, index: number) => {
    const prev = index > 0 ? messages[index - 1] : null;
    const showTime =
      !prev ||
      new Date(item.created_at).getTime() - new Date(prev.created_at).getTime() >
        5 * 60 * 1000;
    return (
      <MessageBubble
        key={item.id}
        message={item}
        showTime={showTime}
        showStatus
      />
    );
  };

  return (
    <div className={styles.container} ref={listRef}>
      <div className={styles.content}>
        {messages.map((msg, index) => renderItem(msg, index))}
      </div>
      {isLoading && (
        <div className={styles.loading}>
          <span className={styles.loadingText}>불러오는 중...</span>
        </div>
      )}
    </div>
  );
}
