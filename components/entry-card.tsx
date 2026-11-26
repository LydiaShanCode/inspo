'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Entry } from '@/lib/types';
import { Play, Link as LinkIcon } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface EntryCardProps {
  entry: Entry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const coverImage = entry.images[0];
  const hasVideo = entry.videos && entry.videos.length > 0;
  const hasSourceUrl = !!entry.sourceUrl;
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [gridRowSpan, setGridRowSpan] = useState<number>(20);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (videoRef.current && hasVideo && !prefersReducedMotion) {
      if (isHovering) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovering, hasVideo, prefersReducedMotion]);

  useEffect(() => {
    const calculateRowSpan = () => {
      if (!cardRef.current) return;
      
      const img = cardRef.current.querySelector('img');
      if (!img) return;
      
      const updateSpan = () => {
        const height = img.clientHeight;
        const gap = window.innerWidth >= 1024 ? 18 : window.innerWidth >= 640 ? 16 : 12;
        const rowHeight = 10;
        const rowSpan = Math.ceil((height + gap) / rowHeight);
        setGridRowSpan(rowSpan);
      };
      
      if (img.complete) {
        updateSpan();
      } else {
        img.addEventListener('load', updateSpan);
        return () => img.removeEventListener('load', updateSpan);
      }
    };
    
    calculateRowSpan();
    window.addEventListener('resize', calculateRowSpan);
    return () => window.removeEventListener('resize', calculateRowSpan);
  }, [coverImage]);
  
  return (
    <Link 
      ref={cardRef}
      href={`/entry/${entry.id}`} 
      className="entry-card block group"
      style={{ gridRowEnd: `span ${gridRowSpan}` }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative overflow-hidden rounded-lg">
        {/* Image/Video container */}
        <div className="relative w-full" style={{ aspectRatio: 'auto' }}>
          {coverImage && (
            <>
              {hasVideo && !prefersReducedMotion ? (
                <>
                  <Image
                    src={coverImage}
                    alt={entry.title}
                    width={600}
                    height={400}
                    className={`w-full h-auto transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
                  />
                  <video
                    ref={videoRef}
                    src={entry.videos![0]}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                    muted
                    loop
                    playsInline
                  />
                </>
              ) : (
                <Image
                  src={coverImage}
                  alt={entry.title}
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              )}
            </>
          )}
          
          {/* Top-right glyph */}
          {(hasVideo || hasSourceUrl) && (
            <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm opacity-90">
              {hasVideo ? (
                <Play className="w-3 h-3 text-black fill-black" />
              ) : (
                <LinkIcon className="w-3 h-3 text-black" />
              )}
            </div>
          )}
          
          {/* Hover overlay */}
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'} flex flex-col justify-end p-4`}>
            <h3 className="text-white font-medium text-sm mb-2 line-clamp-2">
              {entry.title}
            </h3>
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="text-xs text-white/90 px-2 py-0.5 bg-white/20 rounded-full">
                    {tag}
                  </span>
                ))}
                {entry.tags.length > 4 && (
                  <span className="text-xs text-white/90 px-2 py-0.5">
                    +{entry.tags.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
