import { Geist, Plus_Jakarta_Sans, Lora, IBM_Plex_Mono } from "next/font/google";

// Primary font for body text and UI
export const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Secondary font for headings and emphasis
export const geistSans = Geist({
  variable: "--font-geist-sans", 
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Serif font for editorial content
export const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

// Monospace font for code and technical content
export const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Font class combinations for easy usage
export const fontClasses = {
  sans: plusJakartaSans.className,
  geist: geistSans.className,
  serif: lora.className,
  mono: ibmPlexMono.className,
  variables: `${plusJakartaSans.variable} ${geistSans.variable} ${lora.variable} ${ibmPlexMono.variable}`,
};