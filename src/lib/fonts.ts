import { Geist } from "next/font/google";

// Geist Sans font for entire project
export const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Font class combinations for easy usage
export const fontClasses = {
  sans: geistSans.className,
  variables: geistSans.variable,
};