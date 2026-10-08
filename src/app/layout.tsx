import type { Metadata } from "next";
import { Figtree, DM_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const robotoMono = Roboto_Mono({ variable: "--font-roboto-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Capstone Marketplace",
  description: "Buy and sell capstone projects with TouchFlow design",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${dmSans.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F9FAFB] text-[#111827] selection:bg-[#EFF6FF] selection:text-[#3B82F6]">
        <Nav />
        <main className="flex-1 gradient-bg pb-12">{children}</main>
        <footer className="border-t border-[#E5E7EB] bg-white/90 backdrop-blur-md py-6 text-center text-xs text-[#6B7280]">
          <div className="mx-auto max-w-6xl px-[18px] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-medium text-[#4B5563]">CapstoneMarket — TouchFlow Enabled Marketplace</p>
            <p className="text-[#9CA3AF]">Designed for comfortable touch interactions & spatial flow</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

