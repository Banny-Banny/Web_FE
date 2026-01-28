/**
 * WebSocket 연결 관리 훅 (한 유저당 채팅방 1개)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io, type Socket } from 'socket.io-client';
import { getAccessToken } from '@/commons/utils/auth';
import type { ConnectionStatus } from '../types';

interface UseSocketOptions {
  onConnectionChange?: (status: ConnectionStatus) => void;
  onRoomIdReceived?: (roomId: string) => void;
  onError?: (message: string) => void;
}

interface UseSocketReturn {
  connectionStatus: ConnectionStatus;
  roomId: string | null;
  isRoomEntered: boolean;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  joinRoom: () => Promise<void>;
  socket: Socket | null;
}

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;
const NAMESPACE = '/user-chat';

/** Socket.IO 서버 URL (API 베이스에서 /api 제거, 유저 채팅 네임스페이스) */
function getSocketUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  if (!url || url === 'your_api_url' || url.includes('your_api')) return null;
  let base = url.trim().replace(/\/+$/, '');
  base = base.replace(/\/api$/i, '');
  return base;
}

export function useSocket({
  onConnectionChange,
  onRoomIdReceived,
  onError,
}: UseSocketOptions): UseSocketReturn {
  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isRoomEntered, setIsRoomEntered] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isConnectingRef = useRef(false);
  const connectRef = useRef<() => void>(() => {});

  const updateConnectionStatus = useCallback(
    (status: ConnectionStatus) => {
      setConnectionStatus(status);
      onConnectionChange?.(status);
    },
    [onConnectionChange]
  );

  const disconnect = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current.close();
      socketRef.current = null;
    }
    updateConnectionStatus('disconnected');
    setIsRoomEntered(false);
    setRoomId(null);
    isConnectingRef.current = false;
    retryCountRef.current = 0;
  }, [updateConnectionStatus]);

  const connect = useCallback(() => {
    if (isConnectingRef.current || connectionStatus === 'connecting') return;
    if (connectionStatus === 'connected' && socketRef.current?.connected) return;

    if (socketRef.current) disconnect();

    const socketUrl = getSocketUrl();
    if (!socketUrl) {
      updateConnectionStatus('error');
      onError?.('서버 주소가 설정되지 않았습니다.');
      return;
    }

    const token = getAccessToken();
    if (!token) {
      updateConnectionStatus('error');
      onError?.('인증 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    isConnectingRef.current = true;
    updateConnectionStatus('connecting');

    try {
      const socket = io(`${socketUrl}${NAMESPACE}`, {
        auth: { token },
        transports: ['websocket'],
        reconnection: false,
        timeout: 10000,
        forceNew: true,
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        updateConnectionStatus('connected');
        retryCountRef.current = 0;
        isConnectingRef.current = false;
      });

      socket.on('connect_error', () => {
        retryCountRef.current += 1;
        isConnectingRef.current = false;
        if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
          updateConnectionStatus('error');
          onError?.('연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
          socket.disconnect();
          socket.close();
          socketRef.current = null;
          setTimeout(() => router.push('/customer-center'), 2000);
        } else {
          retryTimeoutRef.current = setTimeout(() => {
            socket.removeAllListeners();
            socket.disconnect();
            socket.close();
            socketRef.current = null;
            connectRef.current();
          }, RETRY_DELAY);
        }
      });

      socket.on('disconnect', (reason: string) => {
        if (reason === 'io server disconnect') {
          updateConnectionStatus('error');
          socketRef.current = null;
          isConnectingRef.current = false;
        } else {
          updateConnectionStatus('disconnected');
        }
      });
    } catch {
      updateConnectionStatus('error');
      onError?.('연결 중 오류가 발생했습니다.');
      isConnectingRef.current = false;
    }
  }, [connectionStatus, disconnect, onError, router, updateConnectionStatus]);

  connectRef.current = connect;

  const reconnect = useCallback(() => {
    disconnect();
    retryCountRef.current = 0;
    connect();
  }, [connect, disconnect]);

  const joinRoom = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected) throw new Error('WebSocket이 연결되지 않았습니다.');

    return new Promise<void>((resolve, reject) => {
      let isResolved = false;
      const timeoutId = setTimeout(() => {
        if (isResolved) return;
        isResolved = true;
        updateConnectionStatus('error');
        onError?.('방 입장 시간이 초과되었습니다.');
        disconnect();
        setTimeout(() => router.push('/customer-center'), 1000);
        reject(new Error('방 입장 시간이 초과되었습니다.'));
      }, 10000);

      socket.emit('join_room', {}, (response: { error?: string; roomId?: string }) => {
        if (isResolved) return;
        isResolved = true;
        clearTimeout(timeoutId);
        if (response?.error) {
          updateConnectionStatus('error');
          onError?.('채팅방 생성에 실패했습니다');
          disconnect();
          setTimeout(() => router.push('/customer-center'), 1000);
          reject(new Error(response.error));
          return;
        }
        if (response?.roomId) {
          setRoomId(response.roomId);
          setIsRoomEntered(true);
          onRoomIdReceived?.(response.roomId);
          resolve();
        } else {
          reject(new Error('roomId를 받지 못했습니다.'));
        }
      });
    });
  }, [updateConnectionStatus, disconnect, router, onError, onRoomIdReceived]);

  useEffect(() => {
    connect();
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount: connect, unmount: disconnect only
  }, []);

  return {
    connectionStatus,
    roomId,
    isRoomEntered,
    connect,
    disconnect,
    reconnect,
    joinRoom,
    socket: socketRef.current,
  };
}
