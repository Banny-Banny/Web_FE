'use client';

import React from 'react';
import { QueryProvider } from './query-provider/query-provider';
import { ToastProvider } from './toast-provider';
import { ModalProvider } from './modal-provider';

// 개별 프로바이더 export
export { QueryProvider } from './query-provider/query-provider';
export { queryClient } from './query-provider/query-client';
export { ToastProvider } from './toast-provider';
export { useToast } from './toast-provider';
export type { ToastOptions } from './toast-provider';
export { ModalProvider } from './modal-provider';
export { useModal } from './modal-provider';
export type { ModalState } from './modal-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ModalProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ModalProvider>
    </QueryProvider>
  );
}

export default Providers;