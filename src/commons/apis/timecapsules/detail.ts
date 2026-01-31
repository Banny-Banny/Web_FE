/**
 * 열린 타임캡슐 상세 API (GET /api/timecapsules/:id?user_id=)
 * 서버 snake_case 응답 시 camelCase로 변환
 */

import { apiClient } from '@/commons/provider/api-provider/api-client';
import { CAPSULE_ENDPOINTS } from '@/commons/apis/endpoints';
import type {
  CapsuleDetailResponse,
  CapsuleDetailSlot,
  CapsuleDetailSlotAuthor,
  SlotContent,
  SlotContentImage,
  SlotContentVideo,
  SlotContentAudio,
} from '@/commons/apis/me/capsules/types';

/** 서버 snake_case 응답 (예시) */
interface SnakeSlotAuthor {
  id: string;
  name: string;
  emoji: string;
  profile_img?: string;
}

interface SnakeSlotContent {
  text?: string;
  images?: Array<{ id: string; url: string; thumbnail_url?: string }>;
  video?: { id: string; url: string; thumbnail_url: string };
  audio?: { id: string; title: string; url: string };
}

interface SnakeSlot {
  slot_id: string;
  author?: SnakeSlotAuthor | null;
  is_written: boolean;
  content?: SnakeSlotContent;
}

interface SnakeDetailResponse {
  id: string;
  title: string;
  headcount: number;
  is_locked: boolean;
  slots: SnakeSlot[];
  stats?: { total_slots: number; filled_slots: number; empty_slots: number };
}

function toCamelSlotAuthor(s: SnakeSlotAuthor | null | undefined): CapsuleDetailSlotAuthor {
  // author가 없으면 기본값 반환 (빈 슬롯)
  if (!s) {
    return {
      id: '',
      name: '빈 슬롯',
      emoji: '🥚',
    };
  }
  return {
    id: s.id,
    name: s.name,
    emoji: s.emoji,
    profileImg: s.profile_img,
  };
}

function toCamelContent(c: SnakeSlotContent): SlotContent {
  const content: SlotContent = {};
  if (c.text != null) content.text = c.text;
  if (c.images?.length) {
    content.images = c.images.map(
      (img): SlotContentImage => ({
        id: img.id,
        url: img.url,
        thumbnailUrl: img.thumbnail_url,
      })
    );
  }
  if (c.video) {
    content.video = {
      id: c.video.id,
      url: c.video.url,
      thumbnailUrl: c.video.thumbnail_url,
    } as SlotContentVideo;
  }
  if (c.audio) {
    content.audio = {
      id: c.audio.id,
      title: c.audio.title,
      url: c.audio.url,
    } as SlotContentAudio;
  }
  return content;
}

function toCamelSlot(s: SnakeSlot): CapsuleDetailSlot {
  return {
    slotId: s.slot_id,
    author: toCamelSlotAuthor(s.author),
    isWritten: s.is_written,
    content: s.content ? toCamelContent(s.content) : undefined,
  };
}

function toCamelDetail(raw: SnakeDetailResponse): CapsuleDetailResponse {
  return {
    id: raw.id,
    title: raw.title,
    headcount: raw.headcount,
    isLocked: raw.is_locked,
    slots: raw.slots.map(toCamelSlot),
    stats: raw.stats
      ? {
          totalSlots: raw.stats.total_slots,
          filledSlots: raw.stats.filled_slots,
          emptySlots: raw.stats.empty_slots,
        }
      : undefined,
  };
}

/** 이미 camelCase인지 여부 (items 등으로 판단) */
function isSnakeResponse(raw: unknown): raw is SnakeDetailResponse {
  if (raw && typeof raw === 'object' && Array.isArray((raw as SnakeDetailResponse).slots)) {
    const first = (raw as SnakeDetailResponse).slots[0];
    if (first && 'slot_id' in first) return true;
  }
  return false;
}

/**
 * 타임캡슐 상세 조회
 *
 * GET /api/timecapsules/:id?user_id=
 * 401/403/404/500 시 throw (훅에서 처리)
 */
export async function getCapsuleDetail(
  id: string,
  userId: string
): Promise<CapsuleDetailResponse> {
  try {
    const response = await apiClient.get<CapsuleDetailResponse | SnakeDetailResponse>(
      CAPSULE_ENDPOINTS.TIMECAPSULE_DETAIL(id),
      {
        params: { user_id: userId },
      }
    );
    const raw = response.data;

    if (isSnakeResponse(raw)) {
      return toCamelDetail(raw);
    }
    return raw as CapsuleDetailResponse;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('권한이 없어요');
    }
    if (error.response?.status === 404) {
      throw new Error('캡슐을 찾을 수 없어요');
    }
    if (error.response?.status === 401) {
      throw new Error('로그인이 필요해요');
    }
    throw new Error('불러오지 못했어요');
  }
}
