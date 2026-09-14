import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Citizens' Sabha Platform",
  description: "Browse units and initiatives, read transparency reports, and support what you can see."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-content flex-1 px-5 py-8 sm:px-6 sm:py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
