import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Merriweather_Sans, Oswald } from "next/font/google";
import "./globals.css";
import { auth } from "../auth";

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
  title: "Recipe Finder",
  description: "Find recipes with ingredients you have at home",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${merriweatherSans.variable} ${oswald.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar session={session}></Navbar>
        {children}
      </body>
    </html>
  );
}
