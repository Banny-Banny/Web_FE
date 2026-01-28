'use client';

/**
 * 채팅방 전체 (헤더 + 연결 상태 + 메시지 리스트 + 입력, 파일 첨부 제외)
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  RiArrowLeftLine,
  RiWifiLine,
  RiWifiOffLine,
  RiErrorWarningLine,
  RiLoader4Line,
} from '@remixicon/react';
import { Toast } from '@/commons/components/toast';
import { ChatMessageList } from '../chat-message';
import { ChatInput } from '../chat-input';
import {
  useInquirySocket,
  useChatMessages,
  useChatHistory,
} from '@/commons/apis/inquiries';
import type { ConnectionStatus } from '../../types';
import styles from './styles.module.css';

interface ChatRoomProps {
  inquiryTitle?: string;
  onBack?: () => void;
}

function ConnectionStatusBadge({
  status,
  onReconnect,
}: {
  status: ConnectionStatus;
  onReconnect?: () => void;
}) {
  const config =
    status === 'connecting'
      ? { icon: RiLoader4Line, text: '연결 중...', class: styles.statusConnecting }
      : status === 'connected'
        ? { icon: RiWifiLine, text: '연결됨', class: styles.statusConnected }
        : status === 'error'
          ? { icon: RiErrorWarningLine, text: '연결 오류', class: styles.statusError }
          : { icon: RiWifiOffLine, text: '연결 끊김', class: styles.statusDisconnected };
  const Icon = config.icon;
  const showReconnect = (status === 'disconnected' || status === 'error') && onReconnect;

  return (
    <div className={`${styles.connectionBadge} ${config.class}`}>
      <Icon size={12} aria-hidden />
      <span>{config.text}</span>
      {showReconnect && (
        <button
          type="button"
          className={styles.reconnectButton}
          onClick={onReconnect}
          aria-label="재연결"
        >
          • 재연결
        </button>
      )}
    </div>
  );
}

export function ChatRoom({ inquiryTitle = '고객센터', onBack }: ChatRoomProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const {
    connectionStatus,
    roomId,
    isRoomEntered,
    joinRoom,
    socket,
    reconnect,
  } = useInquirySocket({
    onRoomIdReceived: () => {},
    onError: showToast,
  });

  const { messages: wsMessages, addMessage, sendReadAlert, isLoading: messagesLoading } =
    useChatMessages({
      roomId,
      socket: socket ?? null,
      isRoomEntered,
      connectionStatus: connectionStatus === 'connected' ? 'connected' : connectionStatus === 'error' ? 'error' : 'disconnected',
    });

  const {
    messages: allMessages,
    isLoading: historyLoading,
    hasNext,
    loadMore,
  } = useChatHistory({ webSocketMessages: wsMessages });

  useEffect(() => {
    if (connectionStatus === 'connected' && !isRoomEntered) {
      joinRoom().catch((err) => {
        setErrorMessage(err instanceof Error ? err.message : '채팅방 입장에 실패했습니다.');
      });
    }
  }, [connectionStatus, isRoomEntered, joinRoom]);

  useEffect(() => {
    if (allMessages.length > 0 && isRoomEntered) {
      sendReadAlert();
    }
  }, [allMessages.length, isRoomEntered, sendReadAlert]);

  const handleSendMessage = async (message: string) => {
    try {
      if (!isRoomEntered) {
        setErrorMessage('먼저 채팅방에 입장해주세요.');
        return;
      }
      await addMessage(message);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : '메시지 전송에 실패했습니다.');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      router.push('/customer-center');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
          aria-label="고객센터로 돌아가기"
        >
          <RiArrowLeftLine size={24} className={styles.backIcon} aria-hidden />
        </button>
        <div className={styles.headerTitleSection}>
          <h1 className={styles.headerTitle}>{inquiryTitle}</h1>
          <ConnectionStatusBadge status={connectionStatus} onReconnect={reconnect} />
        </div>
      </header>

      <div className={styles.messageListWrapper}>
        <ChatMessageList
          messages={allMessages}
          onLoadMore={hasNext ? loadMore : undefined}
          isLoading={historyLoading}
        />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={messagesLoading}
        isRoomEntered={isRoomEntered}
        errorMessage={errorMessage || undefined}
      />

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  );
}
