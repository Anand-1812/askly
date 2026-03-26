import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import ThemeProvider from "./components/ThemeProvider";
import Footer from "./components/Footer";

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
      <body className="min-h-screen bg-background text-foreground antialiased">
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
