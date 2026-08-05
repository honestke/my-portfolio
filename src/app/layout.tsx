import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { PageviewTracker } from "@/components/PageviewTracker";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalBackground } from "@/components/GlobalBackground";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Honest Co.",
    template: "%s | Honest Co.",
  },
  description: "Portfolio — Data Analyst & AI Integration Specialist",
  openGraph: {
    title: "Honest Co.",
    description: "Portfolio — Data Analyst & AI Integration Specialist",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Honest Co.",
    description: "Portfolio — Data Analyst & AI Integration Specialist",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <GlobalBackground />
          <PageviewTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
