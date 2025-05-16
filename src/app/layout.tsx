
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/layout/app-header';
import { LocaleProvider } from '@/context/locale-context';
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LooView - Rate. Snap. Flush.',
  description: 'Help the world find clean thrones and expose the scary stalls. Add and rate toilets with LooView.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <AuthProvider> {/* Wrap with AuthProvider */}
          <LocaleProvider>
            <AppHeader />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
          </LocaleProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
