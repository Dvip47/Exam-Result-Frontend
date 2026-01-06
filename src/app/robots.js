export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/login/', '/api/'],
        },
        sitemap: 'https://dailyexamresult.com/sitemap.xml',
    }
}
