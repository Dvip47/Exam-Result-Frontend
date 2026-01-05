import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchPosts } from '../services/api';
import { DataContext } from '../App';

export default function Home() {
    const initialData = useContext(DataContext);
    // If initialData is an object with posts (from api response), use it. 
    // Otherwise check if it's the raw array
    const serverPosts = initialData?.posts ? initialData.posts : (Array.isArray(initialData) ? initialData : null);

    // Only use server data if we are on the home page (simplistic check, ideally route matching)
    // For now, we assume if initialData is provided and it looks like home data (has posts), use it.
    // NOTE: This shared DataContext pattern has a flaw: it persists across client nav unless cleared.
    // A better approach is useAsyncData hook, but we keep it simple.
    // If we navigated client-side, initialData might be stale (from previous page).
    // So distinct check:
    const [posts, setPosts] = useState(serverPosts || []);
    const [loading, setLoading] = useState(!serverPosts);

    useEffect(() => {
        // If we don't have posts (client nav), fetch them
        if (!serverPosts) {
            loadPosts();
        }
    }, []);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await fetchPosts({ limit: 30 });
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    };

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
        <>
            <Helmet>
                <title>Daily Exam Result - Latest Government Jobs, Results, Admit Cards 2025</title>
                <meta
                    name="description"
                    content="Get latest Daily Exam Result, government jobs, results, admit cards, answer keys, and syllabus updates. Stay updated with all government exam notifications."
                />
            </Helmet>

            <div className="main-container">
                {/* Info Section */}
                <div className="info-section">
                    <p>
                        <strong>Daily Exam Result Official</strong> Get Online Form, Results, Admit Card, Answer
                        Key, Syllabus, Career News, Sarkari Yojana, Scholarship, Sarkari Notice etc.
                    </p>
                    <div className="live-badge">🔴 LIVE</div>
                </div>

                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : (
                    <>
                        {/* Content Grid */}
                        <div className="content-grid">
                            {Object.entries(groupedPosts).map(([categoryName, categoryPosts]) => (
                                <div key={categoryName} className="content-box">
                                    <div className="box-header">{categoryName}</div>
                                    <div className="box-content">
                                        <ul className="job-list">
                                            {categoryPosts.slice(0, 10).map((post) => (
                                                <li key={post._id}>
                                                    <Link to={`/post/${post.slug}`}>
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
                    </>
                )}
            </div>
        </>
    );
}
