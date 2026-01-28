/**
 * 채팅 메시지 관련 유틸리티 함수
 */

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

export function getFileIconName(mimeType?: string): string {
  if (!mimeType) return 'file-line';
  if (mimeType.startsWith('image/')) return 'image-line';
  if (mimeType.startsWith('video/')) return 'video-line';
  if (mimeType.startsWith('audio/')) return 'music-line';
  if (mimeType.includes('pdf')) return 'file-pdf-line';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'file-word-line';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'file-excel-line';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'file-zip-line';
  return 'file-line';
}

export function handleFileDownload(url: string): void {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  if (messageDate.getTime() === today.getTime()) {
    return timeStr;
  }
  if (messageDate.getTime() === yesterday.getTime()) {
    return `어제 ${timeStr}`;
  }
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day} ${timeStr}`;
}
