import React from 'react';
import Link from 'next/link';
import { fetchPosts } from './services/api';

export const revalidate = 60; // ISR 60 seconds

export const metadata = {
    title: 'Daily Exam Result: Latest Government Jobs, Result, Admit Card 2025',
    description: 'Explore Daily Exam Result for latest Sarkari Results, online forms, admit cards, and job notifications. Stay updated with the fastest career news portal in India.',
    alternates: {
        canonical: 'https://dailyexamresult.com',
    },
};

export default async function Home() {
    const data = await fetchPosts({ limit: 30 });
    const posts = data.posts || [];

    // Group posts by category
    const groupedPosts = posts.reduce((acc, post) => {
        const categoryName = post.category?.name || 'Uncategorized';
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(post);
        return acc;
    }, {});

    return (
        <div className="main-container">
            {/* Info Section */}
            <div className="info-section">
                <p>
                    <h1 style={{ display: 'inline', fontSize: 'inherit', fontWeight: 'bold' }}>Daily Exam Result Official</h1> Get Online Form, Results, Admit Card, Answer
                    Key, Syllabus, Career News, Sarkari Yojana, Scholarship, Sarkari Notice etc.
                </p>
                <div className="live-badge">🔴 LIVE</div>
            </div>

            {/* Content Grid */}
            <div className="content-grid">
                {Object.entries(groupedPosts).map(([categoryName, categoryPosts]) => (
                    <div key={categoryName} className="content-box">
                        <div className="box-header">{categoryName}</div>
                        <div className="box-content">
                            <ul className="job-list">
                                {categoryPosts.slice(0, 10).map((post) => (
                                    <li key={post._id}>
                                        <Link href={`/post/${post.slug}`}>
                                            {post.title}
                                            {post.badges?.includes('new') && (
                                                <span className="badge badge-new">New</span>
                                            )}
                                            {post.totalPosts && <span className="post-count">({post.totalPosts} Posts)</span>}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}

                {Object.keys(groupedPosts).length === 0 && (
                    <div className="col-span-full text-center py-8">
                        <p>No posts available at the moment. Please check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
