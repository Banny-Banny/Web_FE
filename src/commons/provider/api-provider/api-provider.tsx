'use client';

import React from 'react';

interface ApiProviderProps {
  children: React.ReactNode;
}

/**
 * API Provider 컴포넌트
 * API 클라이언트 설정을 제공하는 컨텍스트 프로바이더
 */
export function ApiProvider({ children }: ApiProviderProps) {
  return <>{children}</>;
}

export default ApiProvider;