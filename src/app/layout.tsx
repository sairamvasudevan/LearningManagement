import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Problem Solving Lab | 100-Hour Programme",
  description: "A language-independent, mastery-based problem-solving learning programme.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
