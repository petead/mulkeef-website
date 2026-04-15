# MULKEEF Real Estate — Website

> Next.js 14 + Supabase + Vercel · Multilingual SEO-optimized real estate website

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Royal Blue brand palette
- **Database**: Supabase (PostgreSQL)
- **i18n**: next-intl (10 languages: EN, FR, AR, RU, ZH, DE, ES, PT, HI, IT)
- **Hosting**: Vercel (free tier)
- **Fonts**: Cormorant Garamond + Plus Jakarta Sans + JetBrains Mono

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration:

```bash
# Copy/paste the contents of:
supabase/migrations/001_initial_schema.sql
```

1. Copy your project credentials from Settings > API

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

## Project Structure

```
mulkeef-website/
├── messages/                    # Translation files (10 languages)
│   ├── en.json
│   ├── fr.json
│   └── ...
├── public/
│   ├── images/
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (fonts, metadata)
│   │   ├── api/
│   │   │   └── leads/route.ts   # Lead capture API
│   │   └── [locale]/
│   │       ├── layout.tsx       # Locale layout (i18n, header/footer)
│   │       ├── page.tsx         # Homepage
│   │       ├── properties/      # Property listings
│   │       ├── contact/         # Contact + lead form
│   │       ├── about/           # About page
│   │       ├── services/        # Services page
│   │       └── off-plan/        # Off-plan projects (TODO)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Sticky header + lang switcher
│   │   │   └── Footer.tsx       # Footer + socials
│   │   ├── ui/                  # Reusable UI components
│   │   ├── properties/          # Property-specific components
│   │   └── sections/            # Page sections
│   ├── lib/
│   │   ├── supabase.ts          # DB client + types + queries
│   │   ├── utils.ts             # Helpers (cn, formatPrice, etc.)
│   │   └── i18n/
│   │       ├── routing.ts       # Locale config + navigation
│   │       └── request.ts       # Server-side i18n
│   └── styles/
│       └── globals.css          # Tailwind + brand tokens + components
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Full DB schema
├── tailwind.config.ts           # Brand palette + animations
├── next.config.mjs              # i18n + images config
└── package.json
```

## Database Schema


| Table                   | Purpose                                |
| ----------------------- | -------------------------------------- |
| `properties`            | Core property data (price, beds, type) |
| `property_translations` | Title, description, meta per locale    |
| `property_images`       | Photo gallery                          |
| `image_translations`    | Alt text per locale                    |
| `offplan_projects`      | Off-plan developments                  |
| `offplan_translations`  | Off-plan content per locale            |
| `leads`                 | Captured leads with source tracking    |
| `seo_pages`             | Static pages translated content        |
| `blog_posts`            | Blog articles                          |
| `blog_translations`     | Blog content per locale                |
| `area_guides`           | Neighborhood guides                    |
| `area_translations`     | Area guide content per locale          |
| `rental_contracts`      | Agent tool: rental contracts           |
| `listing_requests`      | Agent tool: new listing submissions    |


## Brand Palette (Royal Blue)


| Color        | Hex       | Usage                       |
| ------------ | --------- | --------------------------- |
| MULKEEF Blue | `#1E4FD8` | Primary CTA, links, accents |
| Deep Navy    | `#0A1628` | Background                  |
| Surface      | `#111D33` | Cards, panels               |
| Ice Blue     | `#DBEAFE` | Light hover states          |
| Gold         | `#D4A853` | Prices, premium highlights  |
| Emerald      | `#34D399` | Success, available          |
| Coral        | `#F87171` | Sold, alerts                |
| Pearl        | `#F8FAFC` | Text on dark                |
| Slate        | `#94A3B8` | Secondary text              |


## Roadmap

- Phase 1: Project scaffold, DB schema, i18n, layout
- Phase 2: Homepage, About, Services, Contact pages
- Phase 3: Property listings with filters, detail pages, off-plan
- Phase 4: Blog, Area Guides, FAQ, chatbot, gated content
- Phase 5: Agent zone (rental contract, listing request), go-live
- Phase 6: Zapier→Make migration, auto-translate, analytics, Propview integration

## License

Proprietary — MULKEEF Real Estate LLC