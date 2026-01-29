'use client';

/**
 * 채팅 입력창 (텍스트만, 파일 첨부 제외)
 */

import React, { useState } from 'react';
import { RiSendPlaneFill, RiLoader4Line } from '@remixicon/react';
import styles from './styles.module.css';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  isRoomEntered?: boolean;
  errorMessage?: string;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  isRoomEntered = true,
  errorMessage,
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRoomEntered) return;
    const trimmed = message.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setMessage('');
  };

  const disabled =
    !isRoomEntered || message.trim().length === 0 || isLoading;

  return (
    <div className={styles.wrapper}>
      {errorMessage?.trim() && (
        <div className={styles.errorContainer} role="alert">
          <p className={styles.errorText}>{errorMessage.trim()}</p>
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            isRoomEntered ? '메시지를 입력하세요' : '먼저 채팅방에 입장해주세요'
          }
          disabled={!isRoomEntered}
          maxLength={1000}
          aria-label="메시지 입력"
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={disabled}
          aria-label="전송"
        >
          {isLoading ? (
            <RiLoader4Line size={20} className={styles.sendIcon} aria-hidden />
          ) : (
            <RiSendPlaneFill size={20} className={styles.sendIcon} aria-hidden />
          )}
        </button>
      </form>
    </div>
  );
}
