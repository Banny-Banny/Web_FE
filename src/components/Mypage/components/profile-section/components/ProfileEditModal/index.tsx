'use client';

/**
 * 프로필 수정 모달
 * Figma 노드 161-24140 기준. 프로필 사진 변경·닉네임 수정 후 저장.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { MeResponse } from '@/commons/apis/auth/types';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { useUploadProfileImage } from '../../hooks/useUploadProfileImage';
import styles from './styles.module.css';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  profile: MeResponse | null;
  onSuccess?: () => void;
}

export function ProfileEditModal({
  open,
  onClose,
  profile,
  onSuccess,
}: ProfileEditModalProps) {
  const [nickname, setNickname] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const updateProfile = useUpdateProfile();
  const uploadProfileImage = useUploadProfileImage();

  const isSubmitting =
    updateProfile.isPending || uploadProfileImage.isPending;

  const resetFromProfile = useCallback(() => {
    setNickname(profile?.nickname ?? '');
    setPreviewImageUrl(profile?.profileImg ?? null);
    setUploadedFile(null);
    setError(null);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, [profile?.nickname, profile?.profileImg]);

  useEffect(() => {
    if (open && profile) {
      resetFromProfile();
    }
  }, [open, profile, resetFromProfile]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('파일 형식이 올바르지 않습니다. (jpeg, png, webp만 가능)');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('파일 크기는 5MB 이하여야 합니다.');
      e.target.value = '';
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setPreviewImageUrl(url);
    setUploadedFile(file);
    e.target.value = '';
  };

  const handlePhotoChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setError(null);

    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    try {
      if (uploadedFile) {
        await uploadProfileImage.mutateAsync(uploadedFile);
      }
      await updateProfile.mutateAsync({ nickname: trimmedNickname });
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const apiError = err as { status?: number; message?: string };
      if (apiError.status === 409) {
        setError('이미 사용 중인 닉네임입니다.');
      } else if (apiError.status === 400 && uploadedFile) {
        setError(
          apiError.message ||
            '파일 형식이 올바르지 않거나 크기를 확인해주세요.'
        );
      } else {
        setError(
          apiError.message ||
            '일시적인 오류가 발생했습니다. 다시 시도해주세요.'
        );
      }
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!open) return null;

  const displayImageUrl =
    previewImageUrl ?? profile?.profileImg ?? null;
  const hasProfileImage = displayImageUrl && displayImageUrl.trim() !== '';

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-edit-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 id="profile-edit-title" className={styles.title}>
          프로필 수정
        </h2>

        <div className={styles.profilePreviewWrap}>
          <div className={styles.profilePreview}>
            {hasProfileImage ? (
              <img
                src={displayImageUrl}
                alt="프로필 미리보기"
                className={styles.profilePreviewImg}
              />
            ) : (
              <span className={styles.profileEmoji} aria-hidden>
                🐰
              </span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className={styles.hiddenInput}
            aria-hidden
            tabIndex={-1}
          />
          <button
            type="button"
            className={styles.photoChangeButton}
            onClick={handlePhotoChangeClick}
            disabled={isSubmitting}
          >
            사진 변경
          </button>
        </div>

        <div className={styles.nicknameField}>
          <label htmlFor="profile-edit-nickname" className={styles.nicknameLabel}>
            닉네임
          </label>
          <input
            id="profile-edit-nickname"
            type="text"
            className={styles.nicknameInput}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            disabled={isSubmitting}
            autoComplete="nickname"
          />
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSubmitting || !nickname.trim()}
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditModal;
