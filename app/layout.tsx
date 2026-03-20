import type { Metadata } from "next";
import { Manrope, Spectral } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "./components/Header";
import ThemeProvider from "./components/ThemeProvider";
import Footer from "./components/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spectral = Spectral({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Askly - Ask. Answer. Evolve.",
  description:
    "Ask questions, share knowledge, and collaborate with developers worldwide. Join our community and enhance your coding skills!",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          manrope.variable,
          spectral.variable,
          manrope.className,
          "min-h-screen bg-background text-foreground antialiased",
        )}
      >
        <ThemeProvider>
          <div className="site-shell">
            <Header />
            <main className="relative z-10">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
