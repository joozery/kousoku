import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "KOUSOKU (THAILAND) CO., LTD.",
  description: "วัสดุโลหะ ท่อเหล็ก ทองแดง และอุปกรณ์ข้อต่อคุณภาพ",
  icons: {
    icon: [
      { url: '/logo/logo.png', type: 'image/png' },
    ],
    shortcut: ['/logo/logo.png'],
    apple: [{ url: '/logo/logo.png', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${inter.variable} ${notoSansThai.variable} font-sans h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-slate-50" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
