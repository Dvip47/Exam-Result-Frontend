import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add strict filters for all public requests
const publicParams = {
    status: 'published',
    isExpired: false
};

export const fetchCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data.data;
    } catch (err) {
        console.error('fetchCategories error:', err.message);
        return [];
    }
};

export const fetchPosts = async (params = {}) => {
    try {
        const queryParams = { ...params, ...publicParams };
        const response = await api.get('/posts', { params: queryParams });
        return response.data.data;
    } catch (err) {
        console.error('fetchPosts error:', err.message);
        return { posts: [] };
    }
};

export const fetchPostBySlug = async (slug) => {
    try {
        const response = await api.get(`/posts/slug/${slug}`);
        return response.data.data;
    } catch (err) {
        console.error('fetchPostBySlug error:', err.message);
        return null;
    }
};

export const fetchPageBySlug = async (slug) => {
    try {
        const response = await api.get(`/pages/${slug}`);
        return response.data.data;
    } catch (err) {
        console.error('fetchPageBySlug error:', err.message);
        return null;
    }
};

export default api;
