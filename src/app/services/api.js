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
    const response = await api.get('/categories');
    return response.data.data;
};

export const fetchPosts = async (params = {}) => {
    // Merge provided params with strict public filters
    const queryParams = { ...params, ...publicParams };

    // For homepage or category lists
    const response = await api.get('/posts', { params: queryParams });
    // The backend returns { posts: [], pagination: {} } inside data.data
    // But verify if it's data.data.posts if paginated?
    // Based on Admin Panel debugging: 
    // PostService returns { posts, pagination }. 
    // ResponseWrapper wraps it in { success, data: { posts, pagination } }
    // So response.data.data is { posts, pagination }
    return response.data.data;
};

export const fetchPostBySlug = async (slug) => {
    const response = await api.get(`/posts/slug/${slug}`);
    return response.data.data;
};

export const fetchPageBySlug = async (slug) => {
    const response = await api.get(`/pages/${slug}`);
    return response.data.data;
};

export default api;
