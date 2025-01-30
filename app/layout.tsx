import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ica-app-teal.vercel.app'),
  title: {
    template: '%s | Intergalactic Code Academy',
    default: 'Intergalactic Code Academy',
  },
  description: 'Learn to code through space exploration and adventure',
  generator: 'Next.js',
  applicationName: 'Intergalactic Code Academy',
  referrer: 'origin-when-cross-origin',
  keywords: ['Code', 'Space', 'Learning', 'Programming'],
  authors: [{ name: '@danielgene.dev' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    siteName: 'Intergalactic Code Academy',
    title: 'Intergalactic Code Academy',
    description: 'Learn to code through space exploration and adventure',
  },
  verification: {
    google: '2MWqG5T3YmtygvumhsdQ6t5pAwBYxNBqlZKapnRnbww',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}