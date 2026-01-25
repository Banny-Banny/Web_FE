import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/commons/provider";
import { pretendard, dungGeunMo, thinDungGeunMo } from "@/commons/styles/next-fonts";

export const metadata: Metadata = {
  title: "TimeEgg - 시간을 품은 추억",
  description: "TimeEgg 웹 애플리케이션 - 소중한 순간들을 기록하고 공유하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} ${dungGeunMo.variable} ${thinDungGeunMo.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
