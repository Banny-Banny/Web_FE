'use client';

import React from 'react';
import { QueryProvider } from './query-provider/query-provider';

// 개별 프로바이더 export
export { QueryProvider } from './query-provider/query-provider';
export { queryClient } from './query-provider/query-client';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}

export default Providers;