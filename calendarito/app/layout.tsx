import type { Metadata } from "next";
import { Poppins, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Calendarito",
  description: "Turn natural language, files, PDFs, and images into Google Calendar events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", poppins.variable, inter.variable, "font-sans", geist.variable)}>
      <body className="font-body min-h-full flex flex-col text-[var(--text)]">{children}</body>
    </html>
  );
}
