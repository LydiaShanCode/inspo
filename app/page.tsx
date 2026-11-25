'use client';

import { useState, useEffect, useMemo } from 'react';
import { Entry, Category } from '@/lib/types';
import { EntryCard } from '@/components/entry-card';
import { CosmosHeader } from '@/components/cosmos-header';

export default function HomePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries');
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          entry.title.toLowerCase().includes(query) ||
          entry.note.toLowerCase().includes(query) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          entry.category.toLowerCase().includes(query) ||
          entry.sourceUrl?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory && entry.category !== selectedCategory) return false;

      return true;
    });
  }, [entries, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <>
        <CosmosHeader
          searchQuery=""
          onSearch={() => {}}
          onCategoryChange={() => {}}
        />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <CosmosHeader
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <main className="max-w-[1800px] mx-auto px-5 lg:px-6 py-8">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-sm">
              {searchQuery || selectedCategory
                ? 'No entries match your filters'
                : 'No entries yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 text-sm text-muted-foreground">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
            </div>
            <div className="masonry-grid">
              {filteredEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
