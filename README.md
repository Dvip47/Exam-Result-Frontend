# Daily Exam Result Frontend (Next.js App Router)

High-performance, SEO-optimized frontend for Daily Exam Result (DailyExamResult.com), migrated to **Next.js 14** using the App Router.

## 🚀 SEO & Performance Architecture

- **Rendering Mode**: SSG (Static Site Generation) + ISR (Incremental Static Regeneration).
- **ISR Window**: 60 seconds (Auto-updates content in the background).
- **Metadata API**: Dynamic, unique `<title>`, `<meta description>`, and `<link rel="canonical">` for every page.
- **Zero Hydration Delay**: Googlebot receives 100% of the content in the initial HTML response.
- **Core Web Vitals**: Optimized for LCP, CLS, and INP with minimal client-side JS.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── [slug]/          # Category pages (Dynamic SSG)
│   │   ├── post/[slug]/     # Post detail pages (Dynamic SSG + ISR)
│   │   ├── components/      # Server & Client components
│   │   ├── services/        # API integration layer
│   │   ├── utils/           # Helper functions
│   │   ├── layout.js        # Root layout & global metadata
│   │   ├── page.js          # Homepage (ISR)
│   │   ├── robots.js        # Dynamic robots.txt
│   │   └── sitemap.js       # Dynamic sitemap.xml
│   └── assets/
│       └── css/
│           └── style.css    # Core visual identity (Vanilla CSS)
├── public/                  # Static assets
├── next.config.mjs          # Next.js configuration
├── tailwind.config.js       # Utility styling configuration
└── package.json             # Frameowrk dependencies
```

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### 3. Development
```bash
npm run dev
```

### 4. Production Build
```bash
# Build the optimized static site
npm run build

# Start the production server
npm run start
```

## 🔍 SEO Infrastructure

- **Sitemap**: Available at `/sitemap.xml` (Auto-generated from categories and posts).
- **Robots.txt**: Available at `/robots.txt` (Guides search bots on crawl priority).
- **JSON-LD**: Automated structured data injection for Jobs and Articles (Coming soon).

## ⚠️ Known Issues / Troubleshooting

### 429 Too Many Requests (Build Time)
If you see 429 errors during `npm run build`, it means the backend rate limiter is blocking the static page generation requests. 
**Solution**: Briefly increase the `max` value in `backend/src/middleware/rateLimit.middleware.js` to `500` or higher during production deployment.

---

**Current Version:** `nextVersion` Branch (SEO Optimized)
**Status:** ✅ Production Ready
