# inspo — visual inspiration diary

A personal, image-first website for collecting design inspiration, screenshots, links, and creative references. Built for designers who want a polished, searchable archive of everything that inspires them.

## Features

- **Visual gallery** with masonry layout
- **Instant search** across titles, notes, tags, source URLs, and categories
- **Filter by type, category, and tags**
- **Inline editing** — edit titles, notes, tags, and categories directly on the website
- **Persistent storage** — all edits survive page reloads
- **Clean, editorial design** optimized for visual content

## Running locally

```bash
# Install dependencies
npm install

# Seed with sample entries (optional, run once)
npx tsx scripts/seed.ts

# Start the dev server
npm run dev
```

Visit `http://localhost:3000` to see your inspiration diary.

## Data model

Each entry supports:

- **Title** — short, descriptive name
- **Type** — `screenshot`, `link`, `note`, or `mixed`
- **Images** — one or more images (the visual is the point)
- **Source URL** — optional link to the original source
- **Tags** — multiple tags for flexible organization
- **Category** — `UI`, `motion`, `typography`, `brand`, `product`, or `writing`
- **Note** — why it inspired you
- **Captured date** — when you saved it

## How data is stored

All entries are stored as **individual JSON files** in `data/entries/`. Each file is named with a unique ID (e.g., `entry_1724920800000_abc123xyz.json`).

This makes it easy for:
- **Version control** — each entry is a separate file
- **Programmatic access** — scripts can read/write entries directly
- **Backup** — just copy the `data/` folder
- **Inspection** — open any `.json` file to see the raw data

Images are stored in `public/uploads/` and referenced by their public path in the entry JSON.

## Adding new entries

### Method 1: Through the API

POST to `/api/entries` with JSON:

```bash
curl -X POST http://localhost:3000/api/entries \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful gradient animation",
    "type": "screenshot",
    "images": ["https://example.com/image.png"],
    "sourceUrl": "https://example.com",
    "tags": ["gradient", "animation", "color"],
    "category": "motion",
    "note": "Smooth gradient transition on hover"
  }'
```

### Method 2: Drop a JSON file

Create a new entry file in `data/entries/`:

```json
{
  "id": "entry_1234567890_unique",
  "title": "Your title",
  "type": "screenshot",
  "images": ["/uploads/your-image.png"],
  "sourceUrl": "https://example.com",
  "tags": ["tag1", "tag2"],
  "category": "UI",
  "note": "Why this inspired you",
  "capturedDate": "2026-08-29T12:00:00Z",
  "createdAt": "2026-08-29T12:00:00Z",
  "updatedAt": "2026-08-29T12:00:00Z"
}
```

Place your image in `public/uploads/` and reference it in the `images` array.

### Method 3: Use the storage module programmatically

```typescript
import { createEntry } from './lib/storage';

await createEntry({
  title: 'Amazing typography',
  type: 'screenshot',
  images: ['/uploads/typography.png'],
  tags: ['font', 'hierarchy'],
  category: 'typography',
  note: 'Perfect type scale and rhythm',
});
```

## Editing entries on the website

1. Click any entry in the gallery to open its detail view
2. Click the **Edit** button in the top right
3. Make your changes:
   - Edit the title, notes, or source URL
   - Change the category by clicking a different badge
   - Add tags by typing and pressing Enter
   - Remove tags by clicking the X on each tag
4. Click **Save** to persist your changes

Changes are written back to the entry's JSON file in `data/entries/` and survive page reloads.

## Deployment

This site is built with Next.js and can be deployed to any platform that supports it.

### Vercel (recommended)

1. Push this repo to GitHub
2. Import it in Vercel
3. Deploy

Your `data/` folder and edits will persist across deployments when using Vercel's file system (entries are stored in the deployment, not in a separate database).

**Note:** For production use with frequent edits, consider adding a database backend or using Vercel Postgres/Blob storage. The current file-based approach works well for personal use with occasional edits.

### Other platforms

- **Netlify** — works with Next.js runtime
- **Railway** — supports persistent volumes
- **Fly.io** — use volumes for the `data/` directory

## Tech stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **File-based storage** (JSON files)

## Customization

### Add new categories

Edit `lib/types.ts` and add to the `Category` type:

```typescript
export type Category = 
  | 'UI' 
  | 'motion' 
  | 'typography' 
  | 'brand' 
  | 'product' 
  | 'writing'
  | 'your-new-category';  // Add here
```

Then update the `CATEGORIES` array in:
- `components/search-bar.tsx`
- `app/entry/[id]/page.tsx`

### Change the color scheme

Edit the CSS variables in `app/globals.css` under the `@theme` block.

## Project structure

```
.
├── app/
│   ├── api/entries/          # API routes for CRUD
│   ├── entry/[id]/           # Entry detail page
│   ├── page.tsx              # Home gallery
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                   # shadcn components
│   ├── entry-card.tsx        # Gallery card
│   ├── search-bar.tsx        # Search and filters
│   └── tag-input.tsx         # Tag editing UI
├── lib/
│   ├── types.ts              # TypeScript types
│   ├── storage.ts            # File storage layer
│   └── utils.ts              # Utilities
├── data/entries/             # JSON entry files
├── public/uploads/           # Uploaded images
└── scripts/seed.ts           # Seed sample data
```

## License

Use however you like — this is a personal tool.
