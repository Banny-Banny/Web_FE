'use client';

/**
 * @fileoverview ThemeSelector 컴포넌트
 * @description 캡슐 테마/디자인 선택 필드 컴포넌트
 */

import React from 'react';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';
import type { ThemeSelectorProps, ThemeOption } from './types';
import styles from './styles.module.css';

/**
 * ThemeSelector 컴포넌트
 * 
 * 캡슐 테마/디자인을 선택하는 컴포넌트입니다.
 * 여러 테마 옵션 중 하나를 선택할 수 있습니다.
 * React Hook Form과 통합되어 있으며, 실시간 유효성 검사를 지원합니다.
 * 
 * @param {ThemeSelectorProps} props - ThemeSelector 컴포넌트의 props
 */
export function ThemeSelector({
  themes,
}: Omit<ThemeSelectorProps, 'register' | 'errors'>) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<TimecapsuleFormData>();

  const error = (errors as any).theme;
  const selectedTheme = watch('theme' as any);

  return (
    <div className={styles.container}>
      <label htmlFor="theme" className={styles.label}>
        캡슐 테마/디자인
      </label>
      <div
        className={styles.themeGrid}
        role="radiogroup"
        aria-labelledby="theme-label"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'theme-error' : undefined}
      >
        {themes.map((theme: ThemeOption) => {
          const isSelected = selectedTheme === theme.id;
          return (
            <label
              key={theme.id}
              className={`${styles.themeOption} ${isSelected ? styles.themeOptionSelected : ''}`}
              htmlFor={`theme-${theme.id}`}
            >
              <input
                id={`theme-${theme.id}`}
                type="radio"
                {...register('theme' as any)}
                value={theme.id}
                className={styles.hiddenInput}
                aria-label={theme.name}
              />
              {theme.image && (
                <Image
                  src={theme.image}
                  alt={theme.name}
                  width={80}
                  height={80}
                  className={styles.themeImage}
                />
              )}
              <span className={styles.themeName}>{theme.name}</span>
              {theme.description && (
                <span className={styles.themeDescription}>{theme.description}</span>
              )}
            </label>
          );
        })}
      </div>
      {error && (
        <span
          id="theme-error"
          className={styles.error}
          role="alert"
          aria-live="polite"
        >
          {error.message}
        </span>
      )}
    </div>
  );
}
