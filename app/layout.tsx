import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "ecommerce",
    "online shop",
    "products",
    "shopping cart",
    "green shopping",
  ],
  authors: [{ name: APP_NAME }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <Navbar />
          <Toaster richColors closeButton position="top-right" />
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
