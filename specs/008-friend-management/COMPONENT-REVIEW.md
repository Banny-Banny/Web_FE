# 친구 관리 기능 공통 컴포넌트 사용 검토 보고서

**검토 일자**: 2026-01-29  
**검토 대상**: 친구 관리 기능 (`src/components/Mypage/components/activity-stats/friend/index.tsx`)  
**검토 기준**: 공통 컴포넌트 사용 조건 및 프로젝트 내 다른 컴포넌트들과의 일관성

---

## 공통 컴포넌트 사용 현황

### 1. 버튼 컴포넌트 사용

#### 현재 상태: ❌ 직접 구현
FriendList 컴포넌트는 모든 버튼을 직접 구현하고 있습니다:
- `refreshButton` (새로고침 버튼)
- `closeButton` (닫기 버튼)
- `addFriendButton` (친구 추가 버튼)
- `typeButton` (전화번호/이메일 선택 버튼)
- `addSubmitButton` (추가 버튼)
- `addCancelButton` (취소 버튼)
- `blockButton` (삭제 버튼)
- `retryButton` (다시 시도 버튼)

#### 공통 컴포넌트: `Button`, `DualButton`
- **위치**: `src/commons/components/button`, `src/commons/components/dual-button`
- **사용 가능 여부**: ✅ 사용 가능

#### 프로젝트 내 사용 예시:
- **Mypage 컴포넌트**: `Button` 공통 컴포넌트 사용 ✅
  ```tsx
  <Button
    label="로그아웃"
    variant="primary"
    size="L"
    onPress={() => {}}
  />
  ```

#### 개선 권장 사항:
1. **일반 버튼**: `Button` 공통 컴포넌트로 교체 가능
   - `addFriendButton`, `retryButton` 등
2. **듀얼 버튼**: `DualButton` 공통 컴포넌트로 교체 가능
   - `addSubmitButton` + `addCancelButton` 쌍
3. **아이콘 버튼**: 현재는 아이콘만 있는 버튼이므로 직접 구현 유지 가능
   - `refreshButton`, `closeButton` 등

**우선순위**: 중간 (일관성을 위해 권장하지만 필수는 아님)

---

### 2. 모달 컴포넌트 사용

#### 현재 상태: ❌ 직접 구현
FriendList 컴포넌트는 모달 구조를 직접 구현하고 있습니다:
- `overlay` (배경 오버레이)
- `modal` (모달 컨테이너)
- 직접 스타일링 및 이벤트 처리

#### 공통 컴포넌트: `Modal`
- **위치**: `src/commons/components/modal`
- **사용 가능 여부**: ✅ 사용 가능
- **Props**:
  - `visible`: 모달 표시 여부
  - `onClose`: 닫기 핸들러
  - `width`, `height`: 크기 설정
  - `closeOnBackdropPress`: 배경 클릭 시 닫기 여부
  - `children`: 모달 내용

#### 프로젝트 내 사용 예시:
- **EggSlotModal**: `Modal` 공통 컴포넌트 사용 ✅
  ```tsx
  <Modal
    visible={isOpen}
    onClose={onClose}
    height="auto"
    padding={0}
    closeOnBackdropPress={true}
  >
    <div className={styles.modalContent}>
      {/* 모달 내용 */}
    </div>
  </Modal>
  ```

#### 프로젝트 내 직접 구현 예시:
- **MyCapsuleModal**: 직접 구현 (overlay + modal 구조)
- **HintModal**: 직접 구현
- **DiscoveryModal**: 직접 구현

#### 개선 권장 사항:
`Modal` 공통 컴포넌트로 교체 가능하지만, 프로젝트 내에서 직접 구현하는 패턴도 많이 사용되고 있습니다.

**우선순위**: 낮음 (프로젝트 내 혼용 사용 중)

---

### 3. 확인 다이얼로그

#### 현재 상태: ⚠️ `window.confirm` 사용
FriendList 컴포넌트는 친구 삭제 확인에 `window.confirm`을 사용하고 있습니다:
```tsx
if (window.confirm(`${friendNickname}님을 친구 목록에서 삭제하시겠습니까?`)) {
  // 삭제 로직
}
```

#### 공통 컴포넌트: 없음
프로젝트 내에 확인 다이얼로그 공통 컴포넌트는 없습니다.

#### 프로젝트 내 사용 예시:
- **ResetConfirmDialog**: 직접 구현된 확인 다이얼로그 컴포넌트 (EggSlotModal 내부)

#### 개선 권장 사항:
1. `window.confirm` 대신 커스텀 확인 다이얼로그 사용 권장
2. `ResetConfirmDialog`와 유사한 패턴으로 구현 가능
3. 또는 `Modal` + `DualButton` 조합으로 구현 가능

**우선순위**: 중간 (UX 개선을 위해 권장)

---

## 프로젝트 내 일관성 분석

### 공통 컴포넌트 사용 패턴

| 컴포넌트 | Button | DualButton | Modal | 직접 구현 |
|---------|--------|------------|-------|----------|
| **Mypage** | ✅ | ❌ | ❌ | ✅ |
| **EggSlotModal** | ❌ | ❌ | ✅ | ✅ |
| **MyCapsuleModal** | ❌ | ❌ | ❌ | ✅ |
| **FriendList** | ❌ | ❌ | ❌ | ✅ |

### 결론
프로젝트 내에서 공통 컴포넌트 사용이 **완전히 일관적이지 않습니다**:
- 일부 컴포넌트는 공통 컴포넌트를 사용 (Mypage의 Button, EggSlotModal의 Modal)
- 일부 컴포넌트는 직접 구현 (MyCapsuleModal, HintModal, FriendList)

---

## 개선 권장 사항

### 1. 버튼 컴포넌트 교체 (권장)

#### 교체 가능한 버튼:
1. **`addFriendButton`** → `Button` 컴포넌트
   ```tsx
   <Button
     label="친구 추가"
     variant="primary"
     size="M"
     onPress={() => setShowAddForm(true)}
     icon={<RiUserAddLine size={18} />}
   />
   ```

2. **`addSubmitButton` + `addCancelButton`** → `DualButton` 컴포넌트
   ```tsx
   <DualButton
     cancelLabel="취소"
     confirmLabel="추가"
     size="M"
     confirmDisabled={isAdding}
     onCancelPress={handleCancelAdd}
     onConfirmPress={handleAddFriend}
   />
   ```

3. **`retryButton`** → `Button` 컴포넌트
   ```tsx
   <Button
     label="다시 시도"
     variant="outline"
     size="M"
     onPress={() => refetch()}
   />
   ```

#### 유지 가능한 버튼:
- `refreshButton`, `closeButton`: 아이콘만 있는 버튼이므로 직접 구현 유지 가능
- `typeButton`: 토글 버튼이므로 직접 구현 유지 가능
- `blockButton`: 아이콘 + 텍스트 조합이므로 직접 구현 유지 가능

**우선순위**: 중간

---

### 2. 모달 컴포넌트 교체 (선택)

#### Modal 공통 컴포넌트로 교체:
```tsx
<Modal
  visible={true} // onClose prop으로 제어
  onClose={onClose}
  width={343}
  height="auto"
  padding={0}
  closeOnBackdropPress={true}
>
  <div className={styles.modalContent}>
    {/* 기존 모달 내용 */}
  </div>
</Modal>
```

**우선순위**: 낮음 (프로젝트 내 혼용 사용 중)

---

### 3. 확인 다이얼로그 개선 (권장)

#### window.confirm 대신 커스텀 다이얼로그:
```tsx
// ResetConfirmDialog 패턴 참고
<ConfirmDialog
  isOpen={isDeleteConfirmOpen}
  title={`${friendNickname}님을 친구 목록에서 삭제하시겠습니까?`}
  onConfirm={handleConfirmDelete}
  onCancel={() => setIsDeleteConfirmOpen(false)}
/>
```

또는 `Modal` + `DualButton` 조합:
```tsx
<Modal
  visible={isDeleteConfirmOpen}
  onClose={() => setIsDeleteConfirmOpen(false)}
>
  <div>
    <h2>친구 삭제</h2>
    <p>{friendNickname}님을 친구 목록에서 삭제하시겠습니까?</p>
    <DualButton
      cancelLabel="취소"
      confirmLabel="삭제"
      confirmVariant="danger"
      onCancelPress={() => setIsDeleteConfirmOpen(false)}
      onConfirmPress={handleConfirmDelete}
    />
  </div>
</Modal>
```

**우선순위**: 중간 (UX 개선)

---

## 최종 결론

### 현재 상태
- ✅ **기능적으로 문제 없음**: 모든 기능이 정상 작동
- ⚠️ **공통 컴포넌트 사용 부족**: 일부 버튼과 모달을 직접 구현
- ⚠️ **프로젝트 일관성**: 프로젝트 내에서도 혼용 사용 중

### 권장 조치

#### 필수 조치: 없음

#### 권장 조치 (우선순위 순):
1. **중간 우선순위**: 
   - `addFriendButton`, `retryButton` → `Button` 컴포넌트로 교체
   - `addSubmitButton` + `addCancelButton` → `DualButton` 컴포넌트로 교체
   - `window.confirm` → 커스텀 확인 다이얼로그로 교체

2. **낮은 우선순위**:
   - 모달 구조 → `Modal` 공통 컴포넌트로 교체 (프로젝트 내 혼용 사용 중이므로 선택사항)

### 참고사항
- 프로젝트 내에서 공통 컴포넌트 사용이 완전히 일관적이지 않음
- "현재는 독립 구현, 향후 공통 컴포넌트 추출 고려" 조건에 부합
- 기능적으로는 문제 없으며, 점진적 개선 가능

---

## 검토 완료

친구 관리 기능의 공통 컴포넌트 사용은 **프로젝트 내 다른 컴포넌트들과 유사한 수준**입니다. 
일부 개선 여지가 있지만, **필수 조치는 없으며 점진적 개선이 가능**합니다.
