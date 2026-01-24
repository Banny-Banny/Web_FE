/** @type {import('tailwindcss').Config} */
// TODO: 호스트에서 선언된 색상 토큰값 변수를 임포트하여 사용해야 합니다.
// 규칙: FE/tailwind.config.js 반드시 호스트에서 먼저 선언된 색상 토큰값 변수로 임포트하여 스타일을 적용할 것. 중복선언금지.

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/commons/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // TODO: 호스트의 색상 토큰을 임포트하여 사용
      // colors: {
      //   // 호스트에서 선언된 색상 토큰 임포트 필요
      // },
    },
  },
  plugins: [],
};
