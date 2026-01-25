/**
 * UI 관련 훅 (추후 구현 예정)
 * 현재는 기본 구조만 제공
 */

import type { UIContextType, Theme, ToastMessage } from '@/commons/types/ui';

/**
 * UI 상태 및 액션에 접근하는 커스텀 훅
 * TODO: 실제 UI 상태 관리 로직 구현 필요
 */
export function useUI(): UIContextType {
  // 임시 구현 - 추후 실제 UI 상태 관리 로직으로 교체
  return {
    theme: 'system',
    modal: {
      isOpen: false,
      type: null,
      data: undefined,
    },
    toasts: [],
    loading: {},
    sidebarOpen: false,
    setTheme: (theme: Theme) => {
      console.log('SetTheme function - to be implemented', theme);
    },
    openModal: (type: string, data?: any) => {
      console.log('OpenModal function - to be implemented', type, data);
    },
    closeModal: () => {
      console.log('CloseModal function - to be implemented');
    },
    addToast: (toast: Omit<ToastMessage, 'id'>) => {
      console.log('AddToast function - to be implemented', toast);
    },
    removeToast: (id: string) => {
      console.log('RemoveToast function - to be implemented', id);
    },
    setLoading: (key: string, isLoading: boolean) => {
      console.log('SetLoading function - to be implemented', key, isLoading);
    },
    toggleSidebar: () => {
      console.log('ToggleSidebar function - to be implemented');
    },
    setSidebarOpen: (open: boolean) => {
      console.log('SetSidebarOpen function - to be implemented', open);
    },
  };
}

/**
 * 테마 관련 상태와 액션만 반환하는 훅
 */
export function useTheme() {
  const { theme, setTheme } = useUI();
  
  return {
    theme,
    setTheme,
  };
}

/**
 * 모달 관련 상태와 액션만 반환하는 훅
 */
export function useModal() {
  const { modal, openModal, closeModal } = useUI();
  
  return {
    modal,
    openModal,
    closeModal,
  };
}

/**
 * 토스트 관련 상태와 액션만 반환하는 훅
 */
export function useToast() {
  const { toasts, addToast, removeToast } = useUI();
  
  return {
    toasts,
    addToast,
    removeToast,
  };
}

/**
 * 로딩 상태 관련 훅
 */
export function useLoading() {
  const { loading, setLoading } = useUI();
  
  return {
    loading,
    setLoading,
  };
}

/**
 * 사이드바 관련 상태와 액션만 반환하는 훅
 */
export function useSidebar() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUI();
  
  return {
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
  };
}