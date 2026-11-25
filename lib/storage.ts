import fs from 'fs/promises';
import path from 'path';
import { Entry, CreateEntryInput, UpdateEntryInput } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'entries');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

function generateId(): string {
  return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function getEntryPath(id: string): Promise<string> {
  return path.join(DATA_DIR, `${id}.json`);
}

export async function getAllEntries(): Promise<Entry[]> {
  await ensureDataDir();
  
  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const entries = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
        return JSON.parse(content) as Entry;
      })
    );
    
    // Sort by captured date, newest first
    return entries.sort((a, b) => 
      new Date(b.capturedDate).getTime() - new Date(a.capturedDate).getTime()
    );
  } catch (error) {
    console.error('Error reading entries:', error);
    return [];
  }
}

export async function getEntry(id: string): Promise<Entry | null> {
  try {
    const filePath = await getEntryPath(id);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Entry;
  } catch (error) {
    console.error(`Error reading entry ${id}:`, error);
    return null;
  }
}

export async function createEntry(input: CreateEntryInput): Promise<Entry> {
  await ensureDataDir();
  
  const now = new Date().toISOString();
  const entry: Entry = {
    id: generateId(),
    ...input,
    capturedDate: input.capturedDate || now,
    createdAt: now,
    updatedAt: now,
  };
  
  const filePath = await getEntryPath(entry.id);
  await fs.writeFile(filePath, JSON.stringify(entry, null, 2), 'utf-8');
  
  return entry;
}

export async function updateEntry(input: UpdateEntryInput): Promise<Entry | null> {
  const existing = await getEntry(input.id);
  if (!existing) {
    return null;
  }
  
  const updated: Entry = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  const filePath = await getEntryPath(input.id);
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');
  
  return updated;
}

export async function deleteEntry(id: string): Promise<boolean> {
  try {
    const filePath = await getEntryPath(id);
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting entry ${id}:`, error);
    return false;
  }
}

export async function searchEntries(query: string): Promise<Entry[]> {
  const allEntries = await getAllEntries();
  const lowerQuery = query.toLowerCase();
  
  return allEntries.filter(entry => 
    entry.title.toLowerCase().includes(lowerQuery) ||
    entry.note.toLowerCase().includes(lowerQuery) ||
    entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    entry.category.toLowerCase().includes(lowerQuery) ||
    entry.sourceUrl?.toLowerCase().includes(lowerQuery)
  );
}

export async function filterEntries(
  type?: string,
  category?: string,
  tag?: string
): Promise<Entry[]> {
  const allEntries = await getAllEntries();
  
  return allEntries.filter(entry => {
    if (type && entry.type !== type) return false;
    if (category && entry.category !== category) return false;
    if (tag && !entry.tags.includes(tag)) return false;
    return true;
  });
}
