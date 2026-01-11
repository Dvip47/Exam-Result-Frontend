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

    description:
        'Daily Exam Result provides latest Government Jobs, Results, Admit Cards, Answer Keys, Syllabus and Admission updates.',

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
        apple: '/apple-touch-icon.png',
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    alternates: {
        canonical: baseUrl,
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
