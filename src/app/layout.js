import '../assets/css/style.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

export const metadata = {
    title: 'Daily Exam Result - Latest Government Jobs, Results, Admit Cards 2025',
    description: 'Get latest Daily Exam Result, government jobs, results, admit cards, answer keys, and syllabus updates.',
    robots: 'index, follow',
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="canonical" href="https://dailyexamresult.com" />
            </head>
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
