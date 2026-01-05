import React from 'react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} DailyExamResult.com - All Rights Reserved</p>
                <p className="footer-note">
                    This is a demonstration website. All content is for educational purposes only.
                </p>
            </div>
        </footer>
    );
}
