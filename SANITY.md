# Sanity CMS Integration

This project uses [Sanity](https://sanity.io) as a headless CMS for managing trader content.

## Architecture

```
trading-greats/
├── src/lib/sanity/          # Sanity client & queries (SvelteKit)
│   ├── client.ts            # Sanity client configuration
│   ├── queries.ts           # GROQ queries
│   ├── types.ts             # Type definitions & transformers
│   └── index.ts             # Main API export
├── sanity/                   # Sanity Studio (separate app)
│   ├── schemas/             # Content type definitions
│   │   ├── trader.ts        # Trader schema
│   │   └── index.ts         # Schema exports
│   ├── sanity.config.ts     # Studio configuration
│   └── package.json         # Studio dependencies
```

## Setup

### 1. Create a Sanity Project

1. Go to [sanity.io](https://sanity.io) and create a free account
2. Create a new project
3. Note your **Project ID** from the project settings

### 2. Configure Environment Variables

**For the SvelteKit app** (`.env`):
```bash
PUBLIC_SANITY_PROJECT_ID=your-project-id
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2024-01-01
```

**For the Sanity Studio** (`sanity/.env`):
```bash
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

### 3. Install Studio Dependencies

```bash
cd sanity
npm install
```

### 4. Configure CORS

In your Sanity project settings (manage.sanity.io):
1. Go to **API** → **CORS origins**
2. Add your development URL: `http://localhost:5173`
3. Add your production URL: `https://your-domain.com`

## Development

### Run the SvelteKit App
```bash
npm run dev
```

### Run Sanity Studio
```bash
npm run sanity:dev
# or
cd sanity && npm run dev
```

The studio will be available at `http://localhost:3333`

## Content Schema

### Trader

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Trader's full name |
| `slug` | slug | URL-friendly identifier |
| `photo` | image | Profile photo with hotspot |
| `oneLiner` | string | Brief tagline |
| `nationality` | string | Country of origin |
| `birthYear` | number | Year of birth |
| `deathYear` | number | Year of death (optional) |
| `tradingStyle` | string | Trading methodology |
| `netWorth` | string | Estimated net worth |
| `bio` | text | Full biography (Markdown) |
| `philosophy` | text | Trading philosophy |
| `achievements` | array | List of achievements |
| `famousTrades` | array | Notable trades with details |
| `quotes` | array | Famous quotes with sources |
| `books` | array | Authored/recommended books |
| `socialLinks` | array | Social media links |
| `status` | string | `draft` or `published` |

## Fallback Behavior

The integration includes automatic fallback to seed data when:
- `PUBLIC_SANITY_PROJECT_ID` is not configured
- Sanity API requests fail

This ensures the app works during development without Sanity setup.

## Deployment

### Deploy Sanity Studio
```bash
npm run sanity:deploy
```

This deploys the studio to `https://your-project.sanity.studio`

### Production Considerations

1. **CDN Caching**: The client uses Sanity's CDN by default for fast reads
2. **Webhooks**: Consider setting up webhooks for cache invalidation
3. **Preview Mode**: The `previewClient` is configured for draft content

## GROQ Queries

All queries are defined in `src/lib/sanity/queries.ts`:

- `allTradersQuery` - All published traders
- `traderBySlugQuery` - Single trader by slug
- `relatedTradersQuery` - Related traders by style
- `traderStatsQuery` - Admin statistics
- `tradingStylesQuery` - Unique trading styles

## API Reference

```typescript
import { sanity } from '$lib/sanity';

// Get all traders
const traders = await sanity.getAllTraders();

// Get single trader
const trader = await sanity.getTraderBySlug('warren-buffett');

// Get related traders
const related = await sanity.getRelatedTraders('Value Investing', 'warren-buffett');

// Get stats (admin)
const stats = await sanity.getTraderStats();
```
