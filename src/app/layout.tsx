import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Merriweather_Sans, Oswald } from "next/font/google";
import "./globals.css";

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500"], // Regular (default is 400)
});

export const metadata: Metadata = {
  title: "Rceipe Finder",
  description: "Find recipes with ingredients you have at home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${merriweatherSans.variable} ${oswald.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
