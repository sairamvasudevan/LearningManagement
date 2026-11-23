import type { Metadata, Viewport } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Nexus Academy | Problem Solving Lab & Advanced Engineering LMS",
  description:
    "A structured, criterion-referenced EdTech learning management platform featuring free flagship Problem Solving Lab and advanced engineering tracks with dual-portal progress tracking for students and college administrators.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
