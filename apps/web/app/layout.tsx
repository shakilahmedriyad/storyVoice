import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DM_Sans, Roboto } from "next/font/google";
import { cn } from "@/lib/utils";

const robotoHeading = Roboto({
  subsets: ["latin"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "StoryVoice - Audio Book",
  description:
    "StoryVoice - Audio Book is a web application that allows users to listen to audiobooks online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", dmSans.variable, robotoHeading.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
