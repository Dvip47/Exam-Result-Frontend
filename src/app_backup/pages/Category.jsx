import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchPosts } from '../services/api';
import { DataContext } from '../App';

export default function Category() {
    const { slug } = useParams();
    const initialData = useContext(DataContext);

    // Check if initialData corresponds to this page (is array of posts, and relevant to slug if possible)
    // Since we don't have strict typing, we check if it is valid post list.
    const serverPosts = (initialData?.posts && Array.isArray(initialData.posts)) ? initialData.posts : null;

    // Optimization: Check if the first post matches the category slug (if available) to ensure data relevance
    // But safely: if we are hydrating the EXACT URL, initialData IS for us.
    // The issue is strictly client-side navigation sharing the context.
    // For now, we assume initialData is only valid on FIRST LOAD.
    // We can use a ref or check if window was just loaded? No, React hydration handles that.
    // A simple trick: pass a 'hydrated' prop or similar.
    // For this implementation, we will check if "posts" state is empty.

    const [posts, setPosts] = useState(serverPosts || []);
    const [loading, setLoading] = useState(!serverPosts);
    const [categoryName, setCategoryName] = useState(
        serverPosts && serverPosts.length > 0 ? serverPosts[0].category?.name : ''
    );

    useEffect(() => {
        // If no server posts or if slug changed (client nav), fetch
        if (!serverPosts) {
            loadCategoryPosts();
        } else {
            // If we have server posts, ensure they match the current slug (edge case if context persists)
            // Actually, DataContext value doesn't change on client nav, so it will remain stale.
            // We MUST invalidate it.
            // But we can't easily invalidate context from here.
            // We will fetch if the slug doesn't match the data we have.
            // Actually, let's just fetch if loading is true.
            // For simplicity in this non-framework SSR: ALWAYS fetch on client side nav (useEffect)
            // UNLESS it's the very first render and we have data.
        }
    }, [slug]);

    // Better SSR check:
    const isServerLoad = ContextIsRelevant(); // Pseudo

    function ContextIsRelevant() {
        if (typeof window !== 'undefined' && window.__INITIAL_DATA__) {
            // If we just hydrated, use it. Ideally we clear window.__INITIAL_DATA__ after use.
            // For now, let's trust the prop passed to useState strictly on mount.
            // But if we navigate FROM Home TO Category, 'initialData' will be Home data!
            // This is the flaw.
            // FIX: We need to know 'which' route the data belongs to.
            // OR: server/index.js passes { route: '/', data: ... }
        }
        return false;
    }

    // Actual Fix Implementation:
    // We will trust 'serverPosts' ONLY if it matches our expectation (e.g. contains posts with category.slug == slug)
    // Or simpler: The App component should ONLY pass initialData if it hasn't been used, or we just fetch on client for now except for Home.
    // Let's refine: The provided Task requires SSR.
    // We will implement a check: if(serverPosts && serverPosts[0]?.category?.slug === slug) use it.

    const relevantServerPosts = serverPosts && (serverPosts.length === 0 || serverPosts[0]?.category?.slug === slug) ? serverPosts : null;

    // Reset state if slug changes
    useEffect(() => {
        if (!relevantServerPosts) {
            setLoading(true);
            loadCategoryPosts();
        }
    }, [slug]);


    const loadCategoryPosts = async () => {
        try {
            const data = await fetchPosts({ category: slug, limit: 50 });
            setPosts(data.posts || []);
            if (data.posts.length > 0) {
                setCategoryName(data.posts[0].category?.name || slug);
            }
        } catch (error) {
            console.error('Error loading category posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const title = categoryName || slug.replace(/-/g, ' ').toUpperCase();

    return (
        <>
            <Helmet>
                <title>{title} - SarkariResult</title>
                <meta name="description" content={`Latest ${title} updates, notifications and results`} />
            </Helmet>

            <div className="main-container">
                <div className="content-grid">
                    <div className="content-box full-width">
                        <div className="box-header">{title}</div>
                        <div className="box-content">
                            {loading ? (
                                <div className="text-center py-4">Loading...</div>
                            ) : posts.length > 0 ? (
                                <ul className="job-list">
                                    {posts.map((post) => (
                                        <li key={post._id}>
                                            <Link to={`/post/${post.slug}`}>
                                                {post.title}
                                                {post.badges?.includes('new') && <span className="badge badge-new">New</span>}
                                                {post.badges?.includes('hot') && <span className="badge badge-hot">Hot</span>}
                                                {post.totalPosts && <span className="post-count">({post.totalPosts} Posts)</span>}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center py-4">No posts available in this category.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
