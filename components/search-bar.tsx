'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Category, EntryType } from '@/lib/types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: (type?: EntryType, category?: Category, tag?: string) => void;
  selectedType?: EntryType;
  selectedCategory?: Category;
  selectedTag?: string;
  availableTags: string[];
}

const TYPES: EntryType[] = ['screenshot', 'link', 'note', 'mixed'];
const CATEGORIES: Category[] = ['UI', 'motion', 'typography', 'brand', 'product', 'writing'];

export function SearchBar({
  onSearch,
  onFilter,
  selectedType,
  selectedCategory,
  selectedTag,
  availableTags,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const toggleType = (type: EntryType) => {
    const newType = selectedType === type ? undefined : type;
    onFilter(newType, selectedCategory, selectedTag);
  };

  const toggleCategory = (category: Category) => {
    const newCategory = selectedCategory === category ? undefined : category;
    onFilter(selectedType, newCategory, selectedTag);
  };

  const toggleTag = (tag: string) => {
    const newTag = selectedTag === tag ? undefined : tag;
    onFilter(selectedType, selectedCategory, newTag);
  };

  const clearFilters = () => {
    setQuery('');
    onSearch('');
    onFilter();
  };

  const hasActiveFilters = selectedType || selectedCategory || selectedTag || query;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="search"
          placeholder="Search title, notes, tags, source..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1"
        />
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Type:</span>
          {TYPES.map((type) => (
            <Badge
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => toggleType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Category:</span>
          {CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {availableTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Tags:</span>
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
