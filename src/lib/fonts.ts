import { Geist, Geist_Mono } from "next/font/google";

// Geist Sans font for entire project
export const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Geist Mono font for code and technical UI
export const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Font class combinations for easy usage
export const fontClasses = {
  sans: geistSans.className,
  mono: geistMono.variable,
  variables: `${geistSans.variable} ${geistMono.variable}`,
};