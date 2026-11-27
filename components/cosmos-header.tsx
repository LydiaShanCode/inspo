'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
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
            <a href="/" className="flex items-center gap-1.5 select-none" aria-label="inspo home">
              <span className="deboss-emoji text-[22px] leading-none" aria-hidden="true">💫</span>
              <span className="deboss-text font-semibold text-[17px] tracking-tight leading-none">inspo</span>
            </a>
            
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
          
          {/* Expanding search */}
          <div className="ml-auto flex items-center">
            <ExpandingSearch value={searchQuery} onChange={onSearch} />
          </div>
        </div>
        
        {/* Mobile categories */}
        <div className="lg:hidden overflow-x-auto no-scrollbar pb-3 -mx-5 px-5">
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

function ExpandingSearch({ value, onChange }: { value: string; onChange: (q: string) => void }) {
  const [open, setOpen] = useState(Boolean(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = () => {
    onChange('');
    setOpen(false);
  };

  return (
    <div
      className={`relative flex items-center h-10 rounded-full transition-[width,background-color] duration-300 ease-out ${
        open ? 'w-[min(22rem,70vw)] bg-muted' : 'w-10 bg-transparent hover:bg-muted'
      }`}
    >
      <button
        type="button"
        aria-label={open ? 'Search' : 'Open search'}
        onClick={() => (open ? inputRef.current?.focus() : setOpen(true))}
        className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
      >
        <Search className="w-4 h-4" />
      </button>
      <input
        ref={inputRef}
        type="search"
        placeholder="Search inspiration..."
        value={value}
        tabIndex={open ? 0 : -1}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (!value) setOpen(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close();
        }}
        className={`h-10 w-full bg-transparent pl-10 pr-9 text-sm border-0 focus:outline-none transition-opacity duration-200 [&::-webkit-search-cancel-button]:hidden ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      {open && value && (
        <button
          type="button"
          aria-label="Clear search"
          onMouseDown={(e) => e.preventDefault()}
          onClick={close}
          className="absolute right-2 h-6 w-6 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
