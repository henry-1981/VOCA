import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrideVOCA",
  description: "30분 안에 바로 써볼 수 있는 영어 단어 테스트",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {/* Portrait orientation guard — visible only in portrait via CSS */}
        <div className="portrait-guard" aria-hidden="true">
          <p style={{ fontSize: "1.5rem", color: "#fbbf24" }}>📱</p>
          <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#e2e8f0" }}>
            기기를 가로로 돌려주세요
          </p>
        </div>
        {children}
      </body>
    </html>
  );
}
