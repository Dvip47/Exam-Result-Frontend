import Home from './pages/Home';
import Category from './pages/Category';
import PostDetail from './pages/PostDetail';
import { fetchPosts, fetchPostBySlug } from './services/api';

const routes = [
    {
        path: '/',
        component: Home,
        fetchData: () => fetchPosts({ limit: 30 })
    },
    {
        path: '/post/:slug',
        component: PostDetail,
        fetchData: ({ slug }) => fetchPostBySlug(slug)
    },
    {
        path: '/:slug',
        component: Category,
        fetchData: ({ slug }) => fetchPosts({ category: slug, limit: 50 })
    }
];

export default routes;
