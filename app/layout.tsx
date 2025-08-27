import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import PWAStatusChecker from './components/PWAStatusChecker'
import AdminAccessGuard from './components/AdminAccessGuard'
import AdminHeader from './components/AdminHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YourCity Deals',
  description: 'Digital coupon books for schools and local businesses',
  manifest: '/manifest.json',
  themeColor: '#1b2c7a',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'YourCity Deals',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Mobile viewport meta tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* PWA meta tags */}
        <meta name="theme-color" content="#1b2c7a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="YourCity Deals" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* PWA icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/icons/icon-192.png" as="image" />
      </head>
      <body className={inter.className}>
        <AdminHeader />
        <AdminAccessGuard>
          {children}
        </AdminAccessGuard>
        <PWAInstallPrompt />
        <PWAStatusChecker />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
