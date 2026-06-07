  
import InstallButton from "@/components/ui/InstallButton";
import "./globals.css"; 
import Providers from "./providers";
const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};
// export const metadata: Metadata = {
//   title: "StudyAI — AI Toolkit for Students",
//   description: "Generate assignments, humanize AI text, and check plagiarism — all in one place. Built for students by students.",
// };
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  applicationName: "PWA App",
  title: {
    default: "My Awesome PWA App",
    template: "%s - PWA App",
  },
  description: "Best PWA app in the world!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "My Awesome PWA App",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "PWA App",
    title: "My Awesome PWA App",
    description: "Best PWA app in the world!",
  },
  twitter: {
    card: "summary",
    title: "My Awesome PWA App",
    description: "Best PWA app in the world!",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
                <Providers>{children}</Providers>
                  <InstallButton />
      </body>


    </html>
  );
}
// ${geistSans.variable} ${geistMono.variable}