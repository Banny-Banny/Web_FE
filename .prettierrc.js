module.exports = {
  // 세미콜론 사용 여부
  semi: true,
  
  // 후행 쉼표 설정 (ES5 호환)
  trailingComma: 'es5',
  
  // 작은따옴표 사용
  singleQuote: true,
  
  // 한 줄 최대 길이
  printWidth: 80,
  
  // 탭 너비 (스페이스 2개)
  tabWidth: 2,
  
  // 탭 대신 스페이스 사용
  useTabs: false,
  
  // 객체 속성 따옴표 (필요할 때만)
  quoteProps: 'as-needed',
  
  // 중괄호 내부 공백 추가
  bracketSpacing: true,
  
  // JSX 태그 닫는 괄호를 다음 줄에
  bracketSameLine: false,
  
  // 화살표 함수 매개변수 괄호 (단일 매개변수일 때 생략)
  arrowParens: 'avoid',
  
  // 줄 끝 문자 (LF)
  endOfLine: 'lf',
  
  // JSX에서도 작은따옴표 사용
  jsxSingleQuote: true,
  
  // Tailwind CSS 클래스 정렬 플러그인
  plugins: ['prettier-plugin-tailwindcss'],
};