'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Entry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Calendar, X, Plus } from 'lucide-react';

export default function EntryPage() {
  const params = useParams();
  const id = params.id as string;

  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Local editable state
  const [localNote, setLocalNote] = useState('');
  const [localTags, setLocalTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      const response = await fetch(`/api/entries/${id}`);
      if (!response.ok) {
        throw new Error('Entry not found');
      }
      const data = await response.json();
      setEntry(data);
      
      // Load from localStorage or use entry data
      const storageKey = `entry_${id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setLocalNote(parsed.note || '');
        setLocalTags(parsed.tags || []);
      } else {
        setLocalNote(data.note || '');
        setLocalTags(data.tags || []);
      }
    } catch (error) {
      console.error('Failed to fetch entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = (note: string, tags: string[]) => {
    const storageKey = `entry_${id}`;
    localStorage.setItem(storageKey, JSON.stringify({ note, tags }));
  };

  const handleNoteChange = (value: string) => {
    setLocalNote(value);
    saveToLocalStorage(value, localTags);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const trimmedTag = newTag.trim();
    if (localTags.includes(trimmedTag)) {
      setNewTag('');
      return;
    }
    const updatedTags = [...localTags, trimmedTag];
    setLocalTags(updatedTags);
    saveToLocalStorage(localNote, updatedTags);
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = localTags.filter(tag => tag !== tagToRemove);
    setLocalTags(updatedTags);
    saveToLocalStorage(localNote, updatedTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Entry not found</p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(entry.capturedDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <article className="space-y-6">
          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-light tracking-tight">
            {entry.title}
          </h1>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </div>
            <Badge variant="secondary" className="text-xs">{entry.type}</Badge>
            <Badge variant="outline" className="text-xs">{entry.category}</Badge>
          </div>

          {/* Images */}
          <div className="space-y-4">
            {entry.images.map((image, index) => (
              <div
                key={index}
                className="relative w-full rounded-sm overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`${entry.title} - image ${index + 1}`}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Videos (if any) */}
          {entry.videos && entry.videos.length > 0 && (
            <div className="space-y-4">
              {entry.videos.map((video, index) => (
                <div
                  key={index}
                  className="relative w-full rounded-sm overflow-hidden bg-muted"
                >
                  <video
                    src={video}
                    controls
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Source URL */}
          {entry.sourceUrl && (
            <a
              href={entry.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              {entry.sourceUrl}
            </a>
          )}

          {/* Editable Tags */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {localTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs pl-2.5 pr-1.5 py-1 gap-1.5"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                className="flex-1 h-9 px-3 text-sm bg-muted rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Editable Notes */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Notes
            </label>
            <Textarea
              value={localNote}
              onChange={(e) => handleNoteChange(e.target.value)}
              rows={6}
              className="bg-muted border-0 focus:ring-2 focus:ring-ring resize-none text-sm"
              placeholder="Add notes"
            />
            <p className="text-xs text-muted-foreground">
              Notes and tags are saved locally in your browser
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
