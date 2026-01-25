import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/commons/provider";
import { pretendard, dungGeunMo, thinDungGeunMo } from "@/commons/styles/next-fonts";
import MobileFrame from "@/commons/layout/mobile-frame";
import { generateColorCSSVariables } from "@/commons/styles/color";
import { generateSpacingCSSVariables } from "@/commons/styles/spacing";
import { generateTypographyCSSVariables } from "@/commons/styles/fonts";

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
        <style
          dangerouslySetInnerHTML={{
            __html: `
:root {
  /* Base Colors */
  --background: #ffffff;
  --foreground: #0A0A0A;

  /* Color Tokens - Auto-generated from color.ts */
${generateColorCSSVariables()}

  /* Spacing & Border Radius Tokens - Auto-generated from spacing.ts */
${generateSpacingCSSVariables()}

  /* Typography Tokens - Auto-generated from fonts.ts */
${generateTypographyCSSVariables()}
}
            `,
          }}
        />
        <Providers>
          <MobileFrame>
            {children}
          </MobileFrame>
        </Providers>
      </body>
    </html>
  );
}
