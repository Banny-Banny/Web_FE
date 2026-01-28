# useKakaoLogin 훅 테스트 가이드

## 수동 테스트 방법

### 1. 브라우저 콘솔에서 테스트

```javascript
// 개발자 도구 콘솔에서 실행
// 1. 로그인 페이지 접속: http://localhost:3000/login
// 2. 콘솔 열기 (F12)
// 3. 다음 코드 실행:

// useKakaoLogin 훅의 로직을 직접 테스트
const getRedirectUri = () => {
  const protocol = window.location.protocol;
  const host = window.location.host;
  return `${protocol}//${host}/auth/callback`;
};

const redirectUri = getRedirectUri();
console.log('Redirect URI:', redirectUri);

const encodedRedirectUri = encodeURIComponent(redirectUri);
console.log('Encoded Redirect URI:', encodedRedirectUri);

const oauthUrl = `/api/auth/kakao?redirect_uri=${encodedRedirectUri}`;
console.log('OAuth URL:', oauthUrl);

// 실제 리다이렉트 테스트 (주의: 실제로 리다이렉트됨)
// window.location.href = oauthUrl;
```

### 2. Network 탭에서 확인

1. 개발자 도구 열기 (F12)
2. Network 탭 선택
3. "카카오로 시작하기" 버튼 클릭
4. 다음 확인:
   - `GET /api/auth/kakao?redirect_uri=...` 요청 발생
   - Status: 302 (리다이렉트) 또는 200

### 3. 콜백 페이지 테스트

#### 토큰 없음 테스트
```
http://localhost:3000/auth/callback
```
- 예상 결과: "인증 토큰이 없습니다." 에러 메시지
- 2초 후 `/login`으로 리다이렉트

#### 토큰 있음 테스트 (Mock)
```
http://localhost:3000/auth/callback?token=test_token_123
```
- 예상 결과: 
  - "카카오 로그인 처리 중..." 표시
  - 토큰 저장 시도
  - 토큰 검증 API 호출 (`/api/auth/verify`)
  - 검증 실패 시 에러 메시지 및 로그인 페이지로 리다이렉트

### 4. Local Storage 확인

1. 개발자 도구 → Application 탭
2. Local Storage → `http://localhost:3000` 선택
3. 콜백 페이지에서 토큰 저장 후 확인:
   - `timeEgg_accessToken`: 토큰 값 저장 확인
   - `timeEgg_refreshToken`: refreshToken 저장 확인 (있는 경우)

## 예상 동작

### 정상 플로우
1. 사용자가 "카카오로 시작하기" 클릭
2. `window.location.href = '/api/auth/kakao?redirect_uri=http://localhost:3000/auth/callback'`
3. 백엔드가 카카오 인증 처리
4. 백엔드가 `/auth/callback?token=...`로 리다이렉트
5. 콜백 페이지에서 토큰 추출 및 저장
6. 사용자 정보 조회 및 리다이렉트

### 에러 플로우
1. 토큰 없음: 에러 메시지 표시 → 로그인 페이지로 리다이렉트
2. 토큰 검증 실패: 에러 메시지 표시 → 로그인 페이지로 리다이렉트
3. 네트워크 오류: 콘솔 에러 로그 → 로그인 페이지로 리다이렉트
