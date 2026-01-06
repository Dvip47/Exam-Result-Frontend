import React from 'react';
import Link from 'next/link';
import { fetchPosts, fetchCategories } from '../services/api';

export const revalidate = 60; // ISR 60 seconds

export async function generateStaticParams() {
    const categories = await fetchCategories();
    return categories.map((cat) => ({
        slug: cat.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = params;
    const title = slug.replace(/-/g, ' ').toUpperCase();
    return {
        title: `${title} - Daily Exam Result`,
        description: `Latest ${title} updates, notifications and results. Stay updated with Daily Exam Result.`,
        alternates: {
            canonical: `https://dailyexamresult.com/${slug}`,
        },
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = params;
    let posts = [];
    let categoryName = slug.replace(/-/g, ' ').toUpperCase();

    try {
        const data = await fetchPosts({ category: slug, limit: 50 });
        posts = data.posts || [];
        if (posts.length > 0) {
            categoryName = posts[0].category?.name || categoryName;
        }
    } catch (error) {
        console.error('CategoryPage error:', error);
    }

    return (
        <div className="main-container">
            <div className="content-grid">
                <div className="content-box full-width">
                    <div className="box-header">{categoryName}</div>
                    <div className="box-content">
                        {posts.length > 0 ? (
                            <ul className="job-list">
                                {posts.map((post) => (
                                    <li key={post._id}>
                                        <Link href={`/post/${post.slug}`}>
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
    );
}
