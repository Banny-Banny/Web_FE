'use client';

/**
 * 메시지 버블 (텍스트 + 첨부파일 표시만, 입력 첨부 제외)
 */

import React from 'react';
import {
  RiCheckLine,
  RiCheckDoubleLine,
  RiErrorWarningLine,
  RiLoader4Line,
  RiDownloadLine,
} from '@remixicon/react';
import {
  formatFileSize,
  handleFileDownload,
  formatMessageTime,
} from '../utils/message-utils';
import type { ChatMessageWithStatus } from '../types';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: ChatMessageWithStatus;
  showTime?: boolean;
  showStatus?: boolean;
  onRetry?: (messageId: string) => void;
}

function MessageStatusIcon({
  status,
  isRead,
}: {
  status?: 'sending' | 'sent' | 'failed';
  isRead?: boolean;
}) {
  if (status === 'sending') {
    return <RiLoader4Line size={12} className={styles.statusIcon} aria-hidden />;
  }
  if (status === 'failed') {
    return (
      <RiErrorWarningLine size={12} className={styles.statusIconFailed} aria-hidden />
    );
  }
  return isRead ? (
    <RiCheckDoubleLine size={12} className={styles.statusIconRead} aria-hidden />
  ) : (
    <RiCheckLine size={12} className={styles.statusIcon} aria-hidden />
  );
}

export function MessageBubble({
  message,
  showTime = true,
  showStatus = true,
  onRetry,
}: MessageBubbleProps) {
  const isUser = message.sender_type === 'USER';
  const hasAttachments = message.attachments && message.attachments.length > 0;
  const hasContent = message.content?.trim().length > 0;
  const isFailed = message.status === 'failed';

  return (
    <div
      className={`${styles.container} ${isUser ? styles.containerUser : ''}`}
      data-sender={message.sender_type}
    >
      <div
        className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAdmin}`}
      >
        {hasContent && (
          <p className={`${styles.text} ${isUser ? styles.textUser : styles.textAdmin}`}>
            {message.content}
          </p>
        )}
        {hasAttachments && (
          <div className={`${styles.attachments} ${hasContent ? styles.attachmentsWithText : ''}`}>
            {message.attachments!.map((att) => {
              if (att.type === 'IMAGE') {
                return (
                  <a
                    key={att.id}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.imageAttachment}
                    aria-label={`이미지: ${att.name}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={att.url}
                      alt={att.name}
                      className={styles.imageImg}
                    />
                  </a>
                );
              }
              return (
                <button
                  key={att.id}
                  type="button"
                  className={`${styles.fileAttachment} ${isUser ? styles.fileAttachmentUser : ''}`}
                  onClick={() => handleFileDownload(att.url)}
                >
                  <span className={styles.fileIcon}>
                    {/* Remix icon name is dynamic - use span with data attribute for file type */}
                    <RiDownloadLine
                      size={20}
                      className={isUser ? styles.fileIconUser : styles.fileIconAdmin}
                      aria-hidden
                    />
                  </span>
                  <span className={styles.fileContent}>
                    <span
                      className={`${styles.fileName} ${isUser ? styles.fileNameUser : styles.fileNameAdmin}`}
                      title={att.name}
                    >
                      {att.name}
                    </span>
                    {att.size != null && (
                      <span
                        className={`${styles.fileSize} ${isUser ? styles.fileSizeUser : styles.fileSizeAdmin}`}
                      >
                        {formatFileSize(att.size)}
                      </span>
                    )}
                  </span>
                  <RiDownloadLine
                    size={16}
                    className={isUser ? styles.fileIconUser : styles.fileIconAdmin}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
      {isUser && (
        <div className={styles.footer}>
          {showTime && (
            <span className={styles.time}>{formatMessageTime(message.created_at)}</span>
          )}
          {showStatus && message.status && (
            <span className={styles.status}>
              <MessageStatusIcon
                status={message.status}
                isRead={message.is_read_by_admin}
              />
            </span>
          )}
        </div>
      )}
      {isUser && isFailed && onRetry && (
        <button
          type="button"
          className={styles.retryButton}
          onClick={() => onRetry(message.id)}
          aria-label="다시 전송"
        >
          <span className={styles.retryText}>다시 전송</span>
        </button>
      )}
      {!isUser && showTime && (
        <div className={styles.footerAdmin}>
          <span className={styles.time}>{formatMessageTime(message.created_at)}</span>
        </div>
      )}
    </div>
  );
}
