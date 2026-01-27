/**
 * GNB (Global Navigation Bar) 컴포넌트
 * 
 * @description
 * - 화면 하단 고정 네비게이션 바
 * - 3개 메뉴 아이콘 표시 (소식, 홈, 마이)
 * - 페이지 전환 기능
 * - 접근성 지원
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RiNotificationLine, RiMapLine, RiUserLine } from '@remixicon/react';
import styles from './styles.module.css';
import type { GNBProps, MenuItem } from './types';

const menuItems: MenuItem[] = [
  {
    icon: RiNotificationLine,
    label: '소식',
    path: '/notifications',
    ariaLabel: '소식',
  },
  {
    icon: RiMapLine,
    label: '홈',
    path: '/',
    ariaLabel: '홈',
  },
  {
    icon: RiUserLine,
    label: '마이',
    path: '/profile',
    ariaLabel: '마이페이지',
  },
];

export default function GNB({ currentPath: _currentPath }: GNBProps) {
  const router = useRouter();

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement>,
    targetPath: string
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // Next.js router를 사용하여 페이지 전환
      router.push(targetPath);
    }
  };

  return (
    <nav role="navigation" className={styles.gnb}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={styles.menuItem}
            aria-label={item.ariaLabel}
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, item.path)}
          >
            <Icon size={24} className={styles.icon} />
          </Link>
        );
      })}
    </nav>
  );
}

export type { GNBProps, MenuItem } from './types';
