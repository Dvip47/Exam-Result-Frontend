import React from 'react';
import Link from 'next/link';
import { fetchCategories } from '../services/api';

export default async function Navigation() {
    const categories = await fetchCategories();

    return (
        <nav className="navigation">
            <div className="container">
                <ul className="nav-menu">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    {Array.isArray(categories) && categories.map((category) => (
                        <li key={category._id}>
                            <Link href={`/${category.slug}`}>{category.name}</Link>
                        </li>
                    ))}
                    <li>
                        <Link href="/">More</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
