
"use client";

import type { Toilet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import StarRating from '@/components/star-rating';
import Image from 'next/image';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

interface RecentlySpottedSectionProps {
  toilets: Toilet[]; 
  onToiletClick: (toilet: Toilet) => void;
}

export default function RecentlySpottedSection({ toilets, onToiletClick }: RecentlySpottedSectionProps) {
  if (!toilets || toilets.length === 0) {
    return (
      <section className="py-12 md:py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            <span role="img" aria-label="eyes emoji" className="mr-2">👀</span>Recently Spotted LooViews
          </h2>
          <p className="text-muted-foreground">No LooViews spotted yet. Be the first to add one!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground">
          <span role="img" aria-label="eyes emoji" className="mr-2">👀</span>Recently Spotted LooViews
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {toilets.map((toilet) => (
            <Card key={toilet.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
              {toilet.photoUrls && toilet.photoUrls.length > 0 && toilet.photoUrls[0] && (
                <div className="relative w-full h-48">
                  <Image
                    src={toilet.photoUrls[0]}
                    alt={`Photo of ${toilet.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    data-ai-hint="toilet photo"
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg truncate">{toilet.name}</CardTitle>
                 <CardDescription className="text-xs text-muted-foreground truncate">
                   {toilet.countryFlag && <span className="mr-1">{toilet.countryFlag}</span>}
                   {toilet.address || `Lat: ${toilet.location.latitude.toFixed(2)}, Lng: ${toilet.location.longitude.toFixed(2)}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <StarRating rating={toilet.averageRating} readOnly size={18} />
                {toilet.legacyReview && (
                  <p className="text-sm text-muted-foreground mt-2 italic line-clamp-3">
                    “{toilet.legacyReview}”
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary hover:underline group text-sm" 
                  onClick={() => onToiletClick(toilet)}
                >
                  Read more <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

