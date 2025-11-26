import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web Mini Ecommerce",
  description: "Web Mini Ecommerce built with Next.js and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-0">{children}</div>
      </body>
    </html>
  );
}
