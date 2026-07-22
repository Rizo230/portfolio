import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import RouteHistory from "@/components/RouteHistory";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leo Barnes",
  description: "Portfolio of Leo Barnes, computer science student and software developer.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <RouteHistory />
      </body>
    </html>
  );
}
