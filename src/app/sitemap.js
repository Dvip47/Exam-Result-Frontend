import { fetchPosts, fetchCategories } from './services/api';

export default async function sitemap() {
    const baseUrl = 'https://dailyexamresult.com';

    // Fetch all categories and posts
    const categories = await fetchCategories();
    const postData = await fetchPosts({ limit: 1000 });
    const posts = postData.posts || [];

    const categoryUrls = categories.map((cat) => ({
        url: `${baseUrl}/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/post/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
        },
        ...categoryUrls,
        ...postUrls,
    ];
}
