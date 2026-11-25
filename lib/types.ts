export type EntryType = 'screenshot' | 'link' | 'note' | 'mixed';

export type Category = 
  | 'UI' 
  | 'motion' 
  | 'typography' 
  | 'brand' 
  | 'product' 
  | 'writing';

export interface Entry {
  id: string;
  title: string;
  type: EntryType;
  images: string[];
  videos?: string[];
  sourceUrl?: string;
  tags: string[];
  category: Category;
  note: string;
  capturedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryInput {
  title: string;
  type: EntryType;
  images: string[];
  videos?: string[];
  sourceUrl?: string;
  tags: string[];
  category: Category;
  note: string;
  capturedDate?: string;
}

export interface UpdateEntryInput {
  id: string;
  title?: string;
  type?: EntryType;
  images?: string[];
  videos?: string[];
  sourceUrl?: string;
  tags?: string[];
  category?: Category;
  note?: string;
}
