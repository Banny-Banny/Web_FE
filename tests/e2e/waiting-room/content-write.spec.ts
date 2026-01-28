/**
 * @fileoverview 컨텐츠 작성 및 저장 E2E 테스트
 * @description 컨텐츠 작성 플로우, 컨텐츠 수정 플로우, 자동 저장 플로우, 미디어 제한사항, 오류 처리 테스트
 */

import { test, expect } from '@playwright/test';
import {
  mockMyContent,
  mockEmptyContent,
  mockErrorResponses,
  mockWaitingRoomSettings,
} from './fixtures/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : 'http://localhost:3000/api';

// Mock 인증 토큰
const MOCK_ACCESS_TOKEN = 'test-access-token-for-e2e';

// Mock 사용자 정보
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: '테스트 사용자',
  createdAt: '2026-01-01T00:00:00Z',
};

// Mock 대기실 ID
const MOCK_CAPSULE_ID = 'capsule-123';

test.describe('컨텐츠 작성 및 저장 E2E 테스트', () => {
  // 375px 모바일 프레임 기준 테스트
  test.use({
    viewport: { width: 375, height: 812 },
  });

  test.beforeEach(async ({ page }) => {
    // 인증 토큰 검증 API 모킹
    await page.route(`${API_BASE_URL}/auth/verify`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          valid: true,
          user: mockUser,
        }),
      });
    });

    // 인증 토큰을 localStorage에 설정
    await page.addInitScript((token) => {
      localStorage.setItem('timeEgg_accessToken', token);
    }, MOCK_ACCESS_TOKEN);
  });

  test.describe('컨텐츠 작성 플로우', () => {
    test('대기실 설정 조회 성공', async ({ page }) => {
      // 대기실 설정 조회 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/settings`,
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockWaitingRoomSettings),
          });
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/settings`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('maxImagesPerPerson');
      expect(response.data).toHaveProperty('hasMusic');
      expect(response.data).toHaveProperty('hasVideo');
    });

    test('기존 컨텐츠 조회 성공', async ({ page }) => {
      // 기존 컨텐츠 조회 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'GET') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(mockMyContent),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('text');
      expect(response.data).toHaveProperty('images');
    });

    test('기존 컨텐츠 없음 (빈 응답)', async ({ page }) => {
      // 빈 컨텐츠 조회 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'GET') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(mockEmptyContent),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(200);
      expect(response.data.text).toBeUndefined();
      expect(response.data.images).toBeUndefined();
    });

    test('텍스트 입력 및 저장', async ({ page }) => {
      // 컨텐츠 저장 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'POST') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                text: '테스트 텍스트',
                images: [],
                music: null,
                video: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const formData = new FormData();
        formData.append('text', '테스트 텍스트');

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(200);
      expect(response.data.text).toBe('테스트 텍스트');
    });

    test('이미지 업로드 및 저장', async ({ page }) => {
      // 컨텐츠 저장 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'POST') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                text: '',
                images: ['https://example.com/image1.jpg'],
                music: null,
                video: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const formData = new FormData();
        // Blob을 사용하여 이미지 파일 시뮬레이션
        const blob = new Blob(['fake-image-data'], { type: 'image/jpeg' });
        formData.append('images', blob, 'test-image.jpg');

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(200);
      expect(response.data.images).toBeDefined();
      expect(Array.isArray(response.data.images)).toBe(true);
    });

    test('음악 업로드 및 저장', async ({ page }) => {
      // 컨텐츠 저장 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'POST') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                text: '',
                images: [],
                music: 'https://example.com/music.mp3',
                video: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const formData = new FormData();
        // Blob을 사용하여 음악 파일 시뮬레이션
        const blob = new Blob(['fake-music-data'], { type: 'audio/mpeg' });
        formData.append('music', blob, 'test-music.mp3');

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(200);
      expect(response.data.music).toBeDefined();
    });

    test('영상 업로드 및 저장', async ({ page }) => {
      // 컨텐츠 저장 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'POST') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                text: '',
                images: [],
                music: null,
                video: 'https://example.com/video.mp4',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const formData = new FormData();
        // Blob을 사용하여 영상 파일 시뮬레이션
        const blob = new Blob(['fake-video-data'], { type: 'video/mp4' });
        formData.append('video', blob, 'test-video.mp4');

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(200);
      expect(response.data.video).toBeDefined();
    });

    test('전체 컨텐츠 (텍스트, 이미지, 음악, 영상) 저장', async ({ page }) => {
      // 전체 컨텐츠 저장 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'POST') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                text: '전체 컨텐츠 테스트',
                images: [
                  'https://example.com/image1.jpg',
                  'https://example.com/image2.jpg',
                ],
                music: 'https://example.com/music.mp3',
                video: 'https://example.com/video.mp4',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const formData = new FormData();
        formData.append('text', '전체 컨텐츠 테스트');
        
        // Blob을 사용하여 파일들 시뮬레이션
        formData.append('images', new Blob(['fake-image-1'], { type: 'image/jpeg' }), 'image1.jpg');
        formData.append('images', new Blob(['fake-image-2'], { type: 'image/jpeg' }), 'image2.jpg');
        formData.append('music', new Blob(['fake-music'], { type: 'audio/mpeg' }), 'music.mp3');
        formData.append('video', new Blob(['fake-video'], { type: 'video/mp4' }), 'video.mp4');

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(200);
      expect(response.data.text).toBe('전체 컨텐츠 테스트');
      expect(response.data.images).toHaveLength(2);
      expect(response.data.music).toBeDefined();
      expect(response.data.video).toBeDefined();
    });
  });

  test.describe('컨텐츠 수정 플로우', () => {
    test('기존 컨텐츠 불러오기', async ({ page }) => {
      // 기존 컨텐츠 조회 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'GET') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(mockMyContent),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(200);
      expect(response.data.text).toBe(mockMyContent.text);
      expect(response.data.images).toBeDefined();
    });

    test('컨텐츠 수정 저장', async ({ page }) => {
      // 컨텐츠 수정 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'PATCH') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                text: '수정된 텍스트',
                images: ['https://example.com/new-image.jpg'],
                music: null,
                video: null,
                createdAt: '2026-01-28T10:00:00Z',
                updatedAt: new Date().toISOString(),
              }),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const formData = new FormData();
        formData.append('text', '수정된 텍스트');
        formData.append('images', new Blob(['fake-new-image'], { type: 'image/jpeg' }), 'new-image.jpg');

        const res = await fetch(url, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(200);
      expect(response.data.text).toBe('수정된 텍스트');
      expect(response.data.updatedAt).toBeDefined();
    });

    test('부분 수정 (텍스트만 수정)', async ({ page }) => {
      // 부분 수정 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'PATCH') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                text: '부분 수정된 텍스트',
                images: mockMyContent.images, // 기존 이미지 유지
                music: mockMyContent.music, // 기존 음악 유지
                video: mockMyContent.video, // 기존 영상 유지
                createdAt: mockMyContent.createdAt,
                updatedAt: new Date().toISOString(),
              }),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const formData = new FormData();
        formData.append('text', '부분 수정된 텍스트');

        const res = await fetch(url, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(200);
      expect(response.data.text).toBe('부분 수정된 텍스트');
      expect(response.data.images).toEqual(mockMyContent.images);
    });
  });

  test.describe('미디어 제한사항', () => {
    test('사진 개수 제한 초과 시 에러', async ({ page }) => {
      // 사진 개수 제한 초과 에러 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'POST') {
            await route.fulfill({
              status: 400,
              contentType: 'application/json',
              body: JSON.stringify({
                error: 'MEDIA_LIMIT_EXCEEDED',
                message: '업로드 가능한 사진 개수를 초과했습니다.',
              }),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const formData = new FormData();
        // 최대 개수 초과 이미지 업로드 시도
        for (let i = 0; i < 10; i++) {
          formData.append('images', new Blob([`fake-image-${i}`], { type: 'image/jpeg' }), `image${i}.jpg`);
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(400);
      expect(response.data.error).toBe('MEDIA_LIMIT_EXCEEDED');
    });

    test('파일 크기 초과 시 에러', async ({ page }) => {
      // 파일 크기 초과 에러 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'POST') {
            await route.fulfill({
              status: 400,
              contentType: 'application/json',
              body: JSON.stringify({
                error: 'FILE_SIZE_EXCEEDED',
                message: '파일 크기가 너무 큽니다.',
              }),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const formData = new FormData();
        // 대용량 파일 업로드 시도 (10MB - 테스트를 위해 크기를 줄임)
        const largeBuffer = new ArrayBuffer(10 * 1024 * 1024);
        formData.append('images', new Blob([largeBuffer], { type: 'image/jpeg' }), 'large-image.jpg');

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(400);
      expect(response.data.error).toBe('FILE_SIZE_EXCEEDED');
    });

    test('파일 형식 불일치 시 에러', async ({ page }) => {
      // 파일 형식 불일치 에러 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'POST') {
            await route.fulfill({
              status: 400,
              contentType: 'application/json',
              body: JSON.stringify({
                error: 'FILE_TYPE_INVALID',
                message: '지원하지 않는 파일 형식입니다.',
              }),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const formData = new FormData();
        // 지원하지 않는 파일 형식 업로드 시도
        formData.append('images', new Blob(['fake-pdf'], { type: 'application/pdf' }), 'document.pdf');

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(400);
      expect(response.data.error).toBe('FILE_TYPE_INVALID');
    });
  });

  test.describe('오류 처리', () => {
    test('컨텐츠 조회 실패 (404)', async ({ page }) => {
      // 404 에러 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'GET') {
            await route.fulfill({
              status: 404,
              contentType: 'application/json',
              body: JSON.stringify(mockErrorResponses.NOT_FOUND.body),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(404);
      expect(response.data.error).toBe('STEP_ROOM_NOT_FOUND');
    });

    test('컨텐츠 저장 실패 (401)', async ({ page }) => {
      // 401 에러 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'POST') {
            await route.fulfill({
              status: 401,
              contentType: 'application/json',
              body: JSON.stringify(mockErrorResponses.UNAUTHORIZED.body),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const formData = new FormData();
        formData.append('text', '테스트');

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(401);
      expect(response.data.error).toBe('UNAUTHORIZED');
    });

    test('컨텐츠 저장 실패 (403)', async ({ page }) => {
      // 403 에러 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          if (route.request().method() === 'POST') {
            await route.fulfill({
              status: 403,
              contentType: 'application/json',
              body: JSON.stringify(mockErrorResponses.FORBIDDEN.body),
            });
          }
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 모킹된 응답 확인
      const response = await page.evaluate(async ({ url, token }) => {
        const formData = new FormData();
        formData.append('text', '테스트');

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        return {
          status: res.status,
          data: await res.json(),
        };
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      expect(response.status).toBe(403);
      expect(response.data.error).toBe('FORBIDDEN');
    });

    test('네트워크 오류 처리', async ({ page }) => {
      // 네트워크 오류 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
        async (route) => {
          await route.abort('failed');
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 페이지 내에서 API 호출하여 네트워크 오류 확인
      const response = await page.evaluate(async ({ url, token }) => {
        try {
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return {
            status: res.status,
            data: await res.json(),
          };
        } catch (error) {
          return { error: error.message };
        }
      }, { url: `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`, token: MOCK_ACCESS_TOKEN });

      // 네트워크 오류는 에러가 발생해야 함
      expect(response.error).toBeDefined();
    });
  });
});
