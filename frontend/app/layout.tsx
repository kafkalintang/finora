import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
const font = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
export const metadata: Metadata = { title: "FINORA - Financial Operations & Intelligence Platform", description: "Platform manajemen keuangan terpadu untuk perusahaan." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body className={`${font.variable} font-sans`}>{children}</body></html>;
}
