import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Topbar } from "@/components/Topbar";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter ({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Portafolio | Rafael Fernández",
  description: "Portafolio de Rafael Fernández con Next.js, React y Tailwind CSS",
  robots: process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' 
    ? 'noindex, nofollow' 
    : 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" strategy="beforeInteractive"></Script>
        <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js" strategy="beforeInteractive"></Script>
      </head>
      <body className={`${inter.className} antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Topbar />
          <main>
              {children} 
          </main>
          <Navbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
