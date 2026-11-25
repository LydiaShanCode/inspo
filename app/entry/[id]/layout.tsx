import fs from 'fs/promises';
import path from 'path';

export async function generateStaticParams() {
  try {
    const entriesDir = path.join(process.cwd(), 'data/entries');
    const files = await fs.readdir(entriesDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    return jsonFiles.map(file => {
      const id = file.replace('.json', '');
      return { id };
    });
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export default function EntryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
