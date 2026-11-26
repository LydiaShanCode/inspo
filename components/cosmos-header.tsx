'use client';

import { Search } from 'lucide-react';
import { Category } from '@/lib/types';

interface CosmosHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedCategory?: Category;
  onCategoryChange: (category?: Category) => void;
}

const CATEGORIES: (Category | 'All')[] = ['All', 'UI', 'motion', 'typography', 'brand', 'product', 'writing'];

export function CosmosHeader({ searchQuery, onSearch, selectedCategory, onCategoryChange }: CosmosHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="max-w-[1800px] mx-auto px-5 lg:px-6">
        <div className="flex items-center gap-6 h-16">
          {/* Logo and categories */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded-sm" />
              <span className="font-medium text-sm">inspo</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-1">
              {CATEGORIES.map((cat) => {
                const isActive = cat === 'All' ? !selectedCategory : selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(cat === 'All' ? undefined : cat)}
                    className={`px-3 py-1.5 text-sm transition-colors rounded-md ${
                      isActive
                        ? 'text-black font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Centered search */}
          <div className="flex-1 flex justify-center max-w-2xl mx-auto">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search inspiration..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full h-10 pl-11 pr-4 bg-muted rounded-full text-sm border-0 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          
          {/* Right side actions (placeholder) */}
          <div className="w-6" />
        </div>
        
        {/* Mobile categories */}
        <div className="lg:hidden overflow-x-auto pb-3 -mx-5 px-5">
          <div className="flex items-center gap-1 min-w-max">
            {CATEGORIES.map((cat) => {
              const isActive = cat === 'All' ? !selectedCategory : selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat === 'All' ? undefined : cat)}
                  className={`px-3 py-1.5 text-sm whitespace-nowrap transition-colors rounded-md ${
                    isActive
                      ? 'text-black font-medium bg-muted'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
