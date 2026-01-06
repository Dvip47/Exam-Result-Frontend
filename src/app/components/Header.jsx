import React from 'react';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="header">
            <div className="container">
                <h1 className="site-title">
                    <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
                        DAILY EXAM RESULT
                    </Link>
                </h1>
                <p className="site-tagline">WWW.DAILYEXAMRESULT.COM</p>
            </div>
        </header>
    );
}
