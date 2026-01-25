/**
 * 테마 타입
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * 모달 상태 타입
 */
export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: any;
}

/**
 * 토스트 메시지 타입
 */
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

/**
 * 로딩 상태 타입
 */
export interface LoadingState {
  [key: string]: boolean;
}

/**
 * UI 상태 타입
 */
export interface UIState {
  theme: Theme;
  modal: ModalState;
  toasts: ToastMessage[];
  loading: LoadingState;
  sidebarOpen: boolean;
}

/**
 * UI 액션 타입
 */
export interface UIActions {
  setTheme: (theme: Theme) => void;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  setLoading: (key: string, isLoading: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

/**
 * UI 컨텍스트 타입
 */
export interface UIContextType extends UIState, UIActions {}

/**
 * 디바이스 타입
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * 브레이크포인트 타입
 */
export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}