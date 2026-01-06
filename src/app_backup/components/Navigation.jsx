import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../services/api';

export default function Navigation() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await fetchCategories();
            setCategories(data||[]);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    return (
        <nav className="navigation">
            <div className="container">
                <ul className="nav-menu">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {Array.isArray(categories) && categories.map((category) => (
                        <li key={category._id}>
                            <Link to={`/${category.slug}`}>{category.name}</Link>
                        </li>
                    ))}

                    <li>
                        <Link to="/">More</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
