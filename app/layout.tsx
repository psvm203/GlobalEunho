import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "진급/전역 D-day",
  description: "군 복무 주요 일정 카운트다운",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
