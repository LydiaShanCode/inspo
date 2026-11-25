import { createEntry } from '../lib/storage';
import { CreateEntryInput } from '../lib/types';

const SAMPLE_ENTRIES: CreateEntryInput[] = [
  {
    title: 'Linear changelog design',
    type: 'screenshot',
    images: ['https://placehold.co/1200x900/1a1a1a/808080?text=Linear+Changelog'],
    sourceUrl: 'https://linear.app/changelog',
    tags: ['changelog', 'dark-mode', 'minimal'],
    category: 'UI',
    note: 'Beautiful changelog layout with clean typography and subtle animations. The way they handle version numbers and dates is perfect.',
    capturedDate: '2026-08-25T10:30:00Z',
  },
  {
    title: 'Stripe loading state micro-interaction',
    type: 'screenshot',
    images: ['https://placehold.co/1200x800/2563eb/ffffff?text=Loading+Animation'],
    sourceUrl: 'https://stripe.com/payments',
    tags: ['loading', 'micro-interaction', 'skeleton'],
    category: 'motion',
    note: 'Love how their loading states feel purposeful rather than blocking. Skeleton screens that actually match the final layout.',
  },
  {
    title: 'Neue Haas Grotesk in action',
    type: 'screenshot',
    images: ['https://placehold.co/900x1200/f5f5f5/171717?text=Typography+Sample'],
    tags: ['font', 'grotesk', 'hierarchy'],
    category: 'typography',
    note: 'Perfect example of type hierarchy with a single font family. The weight and size variations create clear information architecture.',
    capturedDate: '2026-08-23T14:20:00Z',
  },
  {
    title: 'Arc browser brand refresh',
    type: 'link',
    images: ['https://placehold.co/1200x750/ff6b6b/ffffff?text=Arc+Brand'],
    sourceUrl: 'https://arc.net/brand',
    tags: ['brand', 'color', 'gradient'],
    category: 'brand',
    note: 'Their use of gradients and motion in branding without feeling trendy or dated. Bold but restrained.',
    capturedDate: '2026-08-20T09:15:00Z',
  },
  {
    title: 'Notion calendar empty state',
    type: 'screenshot',
    images: ['https://placehold.co/1200x850/ffffff/cccccc?text=Empty+State'],
    sourceUrl: 'https://notion.com/calendar',
    tags: ['empty-state', 'onboarding', 'illustration'],
    category: 'product',
    note: "Empty states that guide users without feeling pushy. Clear CTA but doesn't overwhelm.",
    capturedDate: '2026-08-18T16:45:00Z',
  },
  {
    title: 'Craig Mod on walking and writing',
    type: 'link',
    images: ['https://placehold.co/1200x700/2d3748/e2e8f0?text=Essay+Typography'],
    sourceUrl: 'https://craigmod.com/essays/',
    tags: ['essay', 'long-form', 'editorial'],
    category: 'writing',
    note: 'His essay format is peak editorial web design. Generous whitespace, perfect line length, immersive reading experience.',
    capturedDate: '2026-08-15T11:30:00Z',
  },
  {
    title: 'Figma Config 2026 motion graphics',
    type: 'mixed',
    images: [
      'https://placehold.co/1200x675/9333ea/ffffff?text=Motion+Frame+1',
      'https://placehold.co/1200x675/7c3aed/ffffff?text=Motion+Frame+2',
    ],
    tags: ['conference', 'motion-graphics', '3d'],
    category: 'motion',
    note: 'The title sequences and transitions from Config. 3D elements that feel purposeful and tied to the product, not just eye candy.',
    capturedDate: '2026-08-12T13:00:00Z',
  },
  {
    title: 'GitHub Primer color system',
    type: 'screenshot',
    images: ['https://placehold.co/1200x800/238636/ffffff?text=Color+System'],
    sourceUrl: 'https://primer.style/foundations/color',
    tags: ['design-system', 'color', 'accessibility'],
    category: 'UI',
    note: 'Thorough color system with clear accessibility guidelines. Love how they document the thinking behind each decision.',
    capturedDate: '2026-08-10T10:00:00Z',
  },
];

async function seed() {
  console.log('Seeding database...');
  
  for (const entry of SAMPLE_ENTRIES) {
    try {
      const created = await createEntry(entry);
      console.log(`✓ Created: ${created.title}`);
    } catch (error) {
      console.error(`✗ Failed to create: ${entry.title}`, error);
    }
  }
  
  console.log('\nSeeding complete!');
}

seed().catch(console.error);
