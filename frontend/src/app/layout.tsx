import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
    metadataBase: new URL('http://localhost:3000'),
    title: { default: 'GraphFlow', template: '%s | GraphFlow' },
    description: 'Trade Smarter. Grow Faster. Multi-asset trading platform with real-time signals.',
    keywords: ['trading', 'stocks', 'crypto', 'portfolio', 'signals', 'charts'],
    authors: [{ name: 'GraphFlow Team' }],
    openGraph: {
        type: 'website',
        title: 'GraphFlow — Trade Smarter',
        description: 'Multi-asset trading platform with real-time signals',
        images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
