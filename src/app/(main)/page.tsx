'use client';

/**
 * @fileoverview 컴포넌트 미리보기 페이지
 * @description 모든 공통 컴포넌트를 한 페이지에서 확인할 수 있는 미리보기 페이지
 * - 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  DualButton,
  Spinner,
  BottomSheet,
  TimeCapsuleHeader,
} from '@/commons/components';
import { useModal } from '@/commons/provider';
import { useToast } from '@/commons/provider';
import { useAuth } from '@/commons/hooks/useAuth';

export default function ComponentPreview() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중이거나 인증되지 않은 경우 빈 화면 표시
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white-500 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* 페이지 헤더 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black-500">컴포넌트 미리보기</h1>
          <p className="mt-2 text-grey-600">
            TimeEgg 공통 컴포넌트 라이브러리
          </p>
        </div>

        {/* Button 섹션 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-black-500">Button</h2>
          
          {/* Variant별 표시 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-dark-grey-700">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button label="Primary" variant="primary" size="L" onPress={() => {}} />
              <Button label="Outline" variant="outline" size="L" onPress={() => {}} />
              <Button label="Danger" variant="danger" size="L" onPress={() => {}} />
              <Button label="Disabled" variant="disabled" size="L" onPress={() => {}} />
            </div>
          </div>

          {/* Size별 표시 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-dark-grey-700">Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button label="Large (L)" variant="primary" size="L" onPress={() => {}} />
              <Button label="Medium (M)" variant="primary" size="M" onPress={() => {}} />
              <Button label="Small (S)" variant="primary" size="S" onPress={() => {}} />
            </div>
          </div>

          {/* Disabled 상태 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-dark-grey-700">Disabled State</h3>
            <div className="flex flex-wrap gap-4">
              <Button label="Disabled Primary" variant="primary" size="L" disabled onPress={() => {}} />
              <Button label="Disabled Outline" variant="outline" size="L" disabled onPress={() => {}} />
            </div>
          </div>
        </section>

        {/* DualButton 섹션 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-black-500">DualButton</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <DualButton
                cancelLabel="취소"
                confirmLabel="확인"
                size="L"
                cancelVariant="outline"
                confirmVariant="primary"
                onCancelPress={() => {}}
                onConfirmPress={() => {}}
              />
              <DualButton
                cancelLabel="취소"
                confirmLabel="삭제"
                size="L"
                cancelVariant="outline"
                confirmVariant="danger"
                onCancelPress={() => {}}
                onConfirmPress={() => {}}
              />
              <DualButton
                cancelLabel="취소"
                confirmLabel="확인"
                size="M"
                cancelVariant="outline"
                confirmVariant="primary"
                onCancelPress={() => {}}
                onConfirmPress={() => {}}
              />
            </div>
          </div>
        </section>

        {/* Spinner 섹션 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-black-500">Spinner</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-dark-grey-700">Sizes</h3>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <Spinner size="small" />
                <span className="text-sm text-grey-600">Small</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="large" />
                <span className="text-sm text-grey-600">Large</span>
              </div>
            </div>
          </div>
        </section>

        {/* BottomSheet 섹션 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-black-500">BottomSheet</h2>
          
          <div className="space-y-4">
            <Button
              label="BottomSheet 열기"
              variant="primary"
              size="L"
              onPress={() => setBottomSheetOpen(true)}
            />
            
            <BottomSheet
              isOpen={bottomSheetOpen}
              onClose={() => setBottomSheetOpen(false)}
              footer={
                <DualButton
                  cancelLabel="취소"
                  confirmLabel="확인"
                  size="L"
                  cancelVariant="outline"
                  confirmVariant="primary"
                  onCancelPress={() => setBottomSheetOpen(false)}
                  onConfirmPress={() => {
                    setBottomSheetOpen(false);
                    showToast('확인 버튼을 눌렀습니다', { type: 'success' });
                  }}
                />
              }
            >
              <div className="p-6">
                <h3 className="mb-4 text-xl font-semibold text-black-500">BottomSheet 제목</h3>
                <p className="text-dark-grey-600">
                  이것은 바텀시트 내용입니다. 여기에 원하는 내용을 넣을 수 있습니다.
                </p>
              </div>
            </BottomSheet>
          </div>
        </section>

        {/* TimeCapsuleHeader 섹션 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-black-500">TimeCapsuleHeader</h2>
          
          <div className="space-y-4">
              <TimeCapsuleHeader
                title="타임캡슐 헤더"
                onBack={() => {}}
                rightIcons={[
                  {
                    icon: 'more',
                    onPress: () => {},
                    accessibilityLabel: '더보기',
                  },
                ]}
              />
              <TimeCapsuleHeader
                title="뒤로가기만 있는 헤더"
                onBack={() => {}}
              />
              <TimeCapsuleHeader title="아이콘만 있는 헤더" />
          </div>
        </section>

        {/* Modal 섹션 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-black-500">Modal</h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button
                label="기본 Modal 열기"
                variant="primary"
                size="L"
                onPress={() => {
                  const modalId = openModal({
                    children: (
                      <div className="p-6">
                        <h3 className="mb-4 text-xl font-semibold text-black-500">Modal 제목</h3>
                        <p className="mb-6 text-dark-grey-600">
                          이것은 모달 내용입니다. 확인 버튼을 눌러 닫을 수 있습니다.
                        </p>
                        <DualButton
                          cancelLabel="취소"
                          confirmLabel="확인"
                          size="L"
                          cancelVariant="outline"
                          confirmVariant="primary"
                          onCancelPress={() => closeModal(modalId)}
                          onConfirmPress={() => closeModal(modalId)}
                        />
                      </div>
                    ),
                    width: 400,
                    padding: 0,
                  });
                }}
              />
              
              <Button
                label="여러 Modal 동시 열기"
                variant="outline"
                size="L"
                onPress={() => {
                  const firstModalId = openModal({
                    children: (
                      <div className="p-6">
                        <h3 className="mb-4 text-xl font-semibold text-black-500">첫 번째 Modal</h3>
                        <p className="mb-6 text-dark-grey-600">이것은 첫 번째 모달입니다.</p>
                        <Button
                          label="두 번째 Modal 열기"
                          variant="primary"
                          size="M"
                          onPress={() => {
                            const secondModalId = openModal({
                              children: (
                                <div className="p-6">
                                  <h3 className="mb-4 text-xl font-semibold text-black-500">두 번째 Modal</h3>
                                  <p className="mb-6 text-dark-grey-600">이것은 두 번째 모달입니다.</p>
                                  <DualButton
                                    cancelLabel="취소"
                                    confirmLabel="확인"
                                    size="L"
                                    cancelVariant="outline"
                                    confirmVariant="primary"
                                    onCancelPress={() => closeModal(secondModalId)}
                                    onConfirmPress={() => closeModal(secondModalId)}
                                  />
                                </div>
                              ),
                              width: 350,
                              padding: 0,
                            });
                          }}
                        />
                        <div className="mt-4">
                          <Button
                            label="첫 번째 Modal 닫기"
                            variant="outline"
                            size="M"
                            onPress={() => closeModal(firstModalId)}
                          />
                        </div>
                      </div>
                    ),
                    width: 400,
                    padding: 0,
                  });
                }}
              />
            </div>
          </div>
        </section>

        {/* Toast 섹션 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-black-500">Toast</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-dark-grey-700">Toast Types</h3>
            <div className="flex flex-wrap gap-4">
              <Button
                label="Success Toast"
                variant="primary"
                size="M"
                onPress={() => {
                  showToast('성공적으로 완료되었습니다!', { type: 'success' });
                }}
              />
              <Button
                label="Error Toast"
                variant="danger"
                size="M"
                onPress={() => {
                  showToast('오류가 발생했습니다.', { type: 'error' });
                }}
              />
              <Button
                label="Info Toast"
                variant="outline"
                size="M"
                onPress={() => {
                  showToast('정보 메시지입니다.', { type: 'info' });
                }}
              />
              <Button
                label="Warning Toast"
                variant="outline"
                size="M"
                onPress={() => {
                  showToast('경고 메시지입니다.', { type: 'warning' });
                }}
              />
            </div>
            
            <div className="mt-4">
              <Button
                label="여러 Toast 순차 표시"
                variant="primary"
                size="L"
                onPress={() => {
                  showToast('첫 번째 토스트', { type: 'success' });
                  setTimeout(() => {
                    showToast('두 번째 토스트', { type: 'info' });
                  }, 500);
                  setTimeout(() => {
                    showToast('세 번째 토스트', { type: 'warning' });
                  }, 1000);
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
