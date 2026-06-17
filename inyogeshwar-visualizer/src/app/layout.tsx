import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "InYogeshwar Visualizer - Premium Music Visualization",
  description: "Experience music like never before with our cutting-edge audio visualization platform. Dark glassmorphism design meets Spotify-inspired elegance.",
  keywords: ["music", "visualization", "audio", "player", "premium", "dark theme"],
  authors: [{ name: "InYogeshwar" }],
  openGraph: {
    title: "InYogeshwar Visualizer",
    description: "Premium Music Visualization Experience",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
