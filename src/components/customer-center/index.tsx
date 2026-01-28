'use client';

/**
 * 고객센터 문의 목록 컨테이너 (헤더 + 문의 리스트)
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/commons/components/page-header';
import { Toast } from '@/commons/components/toast';
import { InquiryList } from './components/InquiryList';
import { useInquiries } from './hooks/useInquiries';
import type { Inquiry } from './types';
import styles from './styles.module.css';

export default function CustomerCenter() {
  const router = useRouter();
  const { inquiries, isLoading, error } = useInquiries({ sortBy: 'latest' });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => {
      setToastMessage(error);
      setToastVisible(true);
    }, 0);
    return () => clearTimeout(id);
  }, [error]);

  const handleInquiryPress = (_inquiry: Inquiry) => {
    router.push('/customer-center/chat');
  };

  const handleNewInquiryPress = () => {
    router.push('/customer-center/chat');
  };

  const handleClose = () => {
    router.push('/profile');
  };

  const subtitle =
    inquiries.length > 0 ? `총 ${inquiries.length}개의 문의` : undefined;

  return (
    <div className={styles.container}>
      <PageHeader
        title="고객센터"
        subtitle={subtitle}
        onButtonPress={handleClose}
      />
      <InquiryList
        inquiries={inquiries}
        onInquiryPress={handleInquiryPress}
        onNewInquiryPress={handleNewInquiryPress}
        isLoading={isLoading}
      />
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  );
}
