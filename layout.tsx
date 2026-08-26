import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PackDrop — Minecraft Resource Pack Hosting",
  description: "Free Minecraft resource pack hosting with instant download URLs and SHA-1 hashes."
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}