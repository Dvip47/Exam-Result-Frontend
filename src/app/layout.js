import '../assets/css/style.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

const baseUrl = 'https://dailyexamresult.com';

export const metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'Daily Exam Result - Latest Government Jobs, Results, Admit Cards 2025',
        template: '%s | Daily Exam Result',
    },
    description: 'Daily Exam Result - Get latest Govt Jobs, Results, Admit Card, Answer Key, Syllabus, Admission, and other educational updates.',
    keywords: ['Daily Exam Result', 'Sarkari Result', 'Sarkari Exam', 'Govt Jobs', 'Results 2025', 'Latest Jobs'],
    authors: [{ name: 'Daily Exam Result Team' }],
    creator: 'Daily Exam Result',
    publisher: 'Daily Exam Result',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/apple-icon.png',
        other: [
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '192x192',
                url: '/icon-192.png',
            },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '512x512',
                url: '/icon-512.png',
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: './',
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#d41317',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div className="app">
                    <Header />
                    <Navigation />
                    <main>{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
