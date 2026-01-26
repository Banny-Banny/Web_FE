import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

/**
 * API 에러 타입
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

/**
 * API 응답 타입
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp?: string;
  code?: string;
}

/**
 * 토큰 정보 타입
 */
interface TokenInfo {
  accessToken: string;
  refreshToken: string;
}

/**
 * 로컬 스토리지 키
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'timeEgg_accessToken',
  REFRESH_TOKEN: 'timeEgg_refreshToken',
} as const;

/**
 * 기본 Axios 설정
 */
const DEFAULT_CONFIG: AxiosRequestConfig = {
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Axios 인스턴스 생성
 */
export const apiClient: AxiosInstance = axios.create({
  ...DEFAULT_CONFIG,
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
});

/**
 * 토큰 가져오기
 */
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

/**
 * 리프레시 토큰 가져오기
 */
function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * 토큰 저장
 */
function saveTokens(tokens: TokenInfo): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
}

/**
 * 토큰 제거
 */
function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * 토큰 갱신 함수
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return null;
  }

  try {
    // TODO: 실제 토큰 갱신 API 호출로 교체
    const response = await axios.post('/auth/refresh', {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    saveTokens({
      accessToken,
      refreshToken: newRefreshToken || refreshToken,
    });

    return accessToken;
  } catch {
    // 리프레시 토큰도 만료된 경우
    clearTokens();
    
    // 로그인 페이지로 리다이렉트 (클라이언트 사이드에서만)
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    
    return null;
  }
}

/**
 * 요청 인터셉터
 * 모든 요청에 인증 토큰을 자동으로 추가
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 요청 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 * 응답 처리 및 토큰 갱신 로직
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 응답 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러이고 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        
        if (newAccessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token Refresh Error:', refreshError);
      }
    }

    try {
      // 안전한 에러 정보 추출 함수
      const getErrorInfo = () => {
        const responseData = error.response?.data;
        const httpStatus = error.response?.status;
        
        // 다양한 응답 구조 처리
        // 1. {statusCode, message} 형식 (예: {"statusCode":500,"message":"Internal server error"})
        // 2. {status, data: {...}} 형식
        // 3. {message, code} 형식
        // 4. 일반적인 에러 응답
        
        let statusCode: number | undefined;
        let message: string;
        let errorCode: string | undefined;
        let errorDetails: any;
        
        if (responseData) {
          // statusCode 필드 확인 (서버가 {statusCode, message} 형식으로 응답하는 경우)
          if (typeof responseData.statusCode === 'number') {
            statusCode = responseData.statusCode;
          }
          
          // message 필드 확인
          if (typeof responseData.message === 'string') {
            message = responseData.message;
          }
          
          // code 필드 확인
          if (typeof responseData.code === 'string') {
            errorCode = responseData.code;
          }
          
          // details 또는 전체 data 저장
          errorDetails = responseData;
        }
        
        // HTTP 상태 코드가 있으면 우선 사용 (응답 본문의 statusCode가 없을 경우)
        if (!statusCode && httpStatus) {
          statusCode = httpStatus;
        }
        
        // 메시지가 없으면 기본 메시지 사용
        if (!message) {
          message = error.message || '알 수 없는 오류가 발생했습니다.';
        }
        
        // 에러 코드가 없으면 Axios 에러 코드 사용
        if (!errorCode) {
          errorCode = error.code;
        }
        
        return {
          statusCode,
          message,
          errorCode,
          errorDetails,
          httpStatus,
          statusText: error.response?.statusText,
          axiosCode: error.code,
          hasResponse: !!error.response,
          hasRequest: !!error.request,
        };
      };

      const errorInfo = getErrorInfo();
      const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
      const url = error.config?.url || error.config?.baseURL || 'Unknown URL';

      // 상세한 에러 로깅
      console.error(`❌ API Error: ${method} ${url}`);
      console.error('Error Details:', {
        statusCode: errorInfo.statusCode,
        httpStatus: errorInfo.httpStatus,
        statusText: errorInfo.statusText,
        message: errorInfo.message,
        errorCode: errorInfo.errorCode,
        axiosCode: errorInfo.axiosCode,
        responseData: errorInfo.errorDetails,
        hasResponse: errorInfo.hasResponse,
        hasRequest: errorInfo.hasRequest,
      });

      // 에러 객체 표준화
      const apiError: ApiError = {
        message: errorInfo.message,
        status: errorInfo.statusCode,
        code: errorInfo.errorCode,
        details: errorInfo.errorDetails,
      };

      return Promise.reject(apiError);
    } catch (parseError) {
      // 에러 파싱 중 예외 발생 시 안전하게 처리
      console.error('❌ Error parsing failed:', parseError);
      console.error('Original error:', error);
      
      const fallbackError: ApiError = {
        message: error.message || '에러 처리 중 오류가 발생했습니다.',
        status: error.response?.status,
        code: error.code,
        details: error.response?.data,
      };
      
      return Promise.reject(fallbackError);
    }
  }
);

/**
 * API 클라이언트 헬퍼 함수들
 */
export const api = {
  /**
   * GET 요청
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiClient.get(url, config);
  },

  /**
   * POST 요청
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiClient.post(url, data, config);
  },

  /**
   * PUT 요청
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiClient.put(url, data, config);
  },

  /**
   * PATCH 요청
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiClient.patch(url, data, config);
  },

  /**
   * DELETE 요청
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiClient.delete(url, config);
  },

  /**
   * 파일 업로드
   */
  upload: <T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<AxiosResponse<ApiResponse<T>>> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },
};

export default apiClient;