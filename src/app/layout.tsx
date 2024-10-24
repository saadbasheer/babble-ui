import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Particles from "@/components/Particles";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bubble UI",
  description: "Ai powered voice application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Particles className="absolute z-3 w-full h-full  bg-[#2F4858]" />
        {children}
      </body>
    </html>
  );
}
