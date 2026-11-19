import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Academy | Problem Solving Lab & Advanced Engineering LMS",
  description: "A structured, mastery-gated EdTech learning management platform featuring free flagship Problem Solving Lab and advanced engineering tracks with dual-portal progress tracking for students and college administrators.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
