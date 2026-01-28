/**
 * 고객센터 채팅 메시지 송수신 훅 (텍스트만, 파일 첨부 제외)
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Socket } from 'socket.io-client';
import type { ChatMessage, ChatMessageWithStatus, MessageStatus } from '../types';

interface UseChatMessagesOptions {
  roomId: string | null;
  socket: Socket | null;
  isRoomEntered: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'error';
}

interface UseChatMessagesReturn {
  messages: ChatMessageWithStatus[];
  addMessage: (content: string) => Promise<void>;
  sendReadAlert: () => void;
  isLoading: boolean;
}

const READ_ALERT_DEBOUNCE = 500;

export function useChatMessages({
  roomId,
  socket,
  isRoomEntered,
  connectionStatus: _connectionStatus,
}: UseChatMessagesOptions): UseChatMessagesReturn {
  const [messages, setMessages] = useState<ChatMessageWithStatus[]>([]);
  const readAlertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (readAlertTimeoutRef.current) clearTimeout(readAlertTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (data: Record<string, unknown>) => {
      const message: ChatMessage = {
        id: String(data.id),
        customer_service_id: '',
        sender_type: (data.senderType as 'USER' | 'ADMIN') ?? 'ADMIN',
        sender_user_id: data.senderUserId as string | undefined,
        sender_admin_id: data.senderAdminId as string | undefined,
        content: String(data.content ?? ''),
        attachments: data.attachments as ChatMessage['attachments'],
        is_read_by_admin: Boolean(data.isReadByAdmin),
        is_read_by_user: Boolean(data.isReadByUser),
        created_at: String(data.createdAt),
        updated_at: String(data.updatedAt ?? data.createdAt),
      };
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === message.id);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = { ...message, status: 'sent' as MessageStatus };
          return next;
        }
        return [...prev, { ...message, status: 'sent' as MessageStatus }];
      });
    };
    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    const handleReadAlert = (data: { messageId: string; isRead: boolean }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === data.messageId ? { ...m, is_read_by_admin: data.isRead } : m
        )
      );
    };
    socket.on('read_alert', handleReadAlert);
    return () => {
      socket.off('read_alert', handleReadAlert);
    };
  }, [socket]);

  const addMessage = useCallback(
    async (content: string) => {
      if (!isRoomEntered) throw new Error('먼저 채팅방에 입장해주세요.');
      if (!socket?.connected) throw new Error('WebSocket이 연결되지 않았습니다.');

      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const newMessage: ChatMessageWithStatus = {
        id: tempId,
        customer_service_id: '',
        sender_type: 'USER',
        sender_user_id: undefined,
        content: content || '',
        is_read_by_admin: false,
        is_read_by_user: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'sending',
      };
      setMessages((prev) => [...prev, newMessage]);

      return new Promise<void>((resolve, reject) => {
        socket.emit(
          'send_message',
          { roomId, content: content || '', attachments: undefined },
          (response: { success?: boolean; messageId?: string; error?: string }) => {
            if (response?.success && response?.messageId) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === tempId ? { ...m, id: response.messageId!, status: 'sent' as MessageStatus } : m
                )
              );
              resolve();
            } else {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === tempId ? { ...m, status: 'failed' as MessageStatus } : m
                )
              );
              reject(new Error(response?.error ?? '메시지 전송에 실패했습니다.'));
            }
          }
        );
      });
    },
    [isRoomEntered, socket, roomId]
  );

  const sendReadAlert = useCallback(() => {
    if (!socket?.connected || !isRoomEntered || !roomId) return;
    if (readAlertTimeoutRef.current) clearTimeout(readAlertTimeoutRef.current);
    readAlertTimeoutRef.current = setTimeout(() => {
      socket.emit('read_alert', { roomId });
    }, READ_ALERT_DEBOUNCE);
  }, [socket, isRoomEntered, roomId]);

  return { messages, addMessage, sendReadAlert, isLoading: false };
}
