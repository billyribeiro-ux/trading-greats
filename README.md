# World Traders 🌍📈

A stunning showcase website featuring legendary traders from around the world. Built with SvelteKit 5, Tailwind CSS, and optimized for SEO.

![World Traders](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop)

## ✨ Features

- **Beautiful Design**: Dark, premium aesthetic with gold accents
- **Mobile-First**: Fully responsive, optimized for all devices
- **SEO Optimized**: 
  - JSON-LD structured data (Person, WebSite, BreadcrumbList, Article schemas)
  - Dynamic sitemap.xml and robots.txt
  - Meta tags and Open Graph support
  - Core Web Vitals optimized
- **Admin Panel**: Password-protected CMS to manage traders
- **Fast**: SSG/SSR with Vercel Edge deployment
- **Type-Safe**: Full TypeScript with Drizzle ORM

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/world-traders.git
cd world-traders

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
# Database - Turso (SQLite Edge) - Get free at https://turso.tech
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Admin Authentication
ADMIN_PASSWORD=your-secure-password
ADMIN_SECRET=generate-a-random-32-character-string

# Site URL
PUBLIC_SITE_URL=https://worldtraders.com
PUBLIC_SITE_NAME=World Traders
```

## 🗄️ Database Setup

### Option 1: Turso (Recommended - FREE)

1. Go to [turso.tech](https://turso.tech) and create a free account
2. Create a new database
3. Get your database URL and auth token
4. Add them to your `.env` file
5. Run migrations:

```bash
npm run db:push
```

### Option 2: Local SQLite (Development)

For local development, you can use a local SQLite file. Update `drizzle.config.ts`:

```typescript
export default defineConfig({
  dialect: 'sqlite',
  dbCredentials: {
    url: './local.db'
  }
});
```

## 🌐 Deployment

### Vercel (Recommended - FREE)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add your environment variables in Vercel's dashboard
4. Deploy!

**That's it!** Vercel will automatically:
- Build your project
- Deploy to edge (global CDN)
- Provide SSL certificate
- Handle serverless functions

### Other Options

- **Netlify**: Use `@sveltejs/adapter-netlify`
- **Cloudflare Pages**: Use `@sveltejs/adapter-cloudflare`
- **Self-hosted**: Use `@sveltejs/adapter-node`

## 📁 Project Structure

```
world-traders/
├── src/
│   ├── routes/
│   │   ├── +page.svelte           # Homepage
│   │   ├── traders/
│   │   │   ├── +page.svelte       # Traders list
│   │   │   └── [slug]/+page.svelte # Individual trader
│   │   ├── admin/                  # Admin panel
│   │   ├── sitemap.xml/           # Dynamic sitemap
│   │   └── robots.txt/            # Robots.txt
│   │
│   ├── lib/
│   │   ├── server/
│   │   │   ├── db.ts              # Database connection
│   │   │   ├── schema.ts          # Drizzle schema
│   │   │   └── seed.ts            # Seed data
│   │   ├── components/            # Svelte components
│   │   └── utils/                 # Utility functions
│   │
│   └── hooks.server.ts            # Auth middleware
│
├── static/                        # Static assets
└── drizzle/                       # Database migrations
```

## 🎨 Customization

### Adding New Traders

1. Go to `/admin` and log in
2. Click "Add Trader"
3. Fill in the details
4. Click "Publish"

Or edit the seed data directly in `src/lib/server/seed.ts`.

### Changing Colors

Edit `tailwind.config.ts` to customize the color palette:

```typescript
colors: {
  gold: { ... },
  midnight: { ... }
}
```

### Adding Trading Styles

Add new styles to the seed data and update the filter options in the traders list page.

## 📊 SEO Features

### Structured Data

Each trader page includes:
- **Person schema**: Name, job title, nationality, etc.
- **Article schema**: For rich snippets in search results
- **BreadcrumbList**: Navigation path

### Core Web Vitals

Optimized for:
- **LCP < 2.5s**: SSG, optimized images
- **INP < 200ms**: Minimal JavaScript
- **CLS < 0.1**: Reserved image dimensions

### Meta Tags

- Dynamic title and description
- Open Graph tags for social sharing
- Twitter Cards
- Canonical URLs

## 🔒 Security

- Admin routes protected by password
- HTTP-only cookies for session
- Security headers (X-Frame-Options, etc.)
- No sensitive data exposed to client

## 📝 License

MIT License - feel free to use this for your own projects!

## 🙏 Credits

Built with:
- [SvelteKit 5](https://kit.svelte.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Turso](https://turso.tech)
- [Lucide Icons](https://lucide.dev)

---

Made with ❤️ for traders everywhere
