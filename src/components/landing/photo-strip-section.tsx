
"use client";

import type { Toilet } from '@/lib/types';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useLocale } from '@/context/locale-context'; // Import useLocale

interface PhotoStripSectionProps {
  toilets: Toilet[];
}

export default function PhotoStripSection({ toilets }: PhotoStripSectionProps) {
  const { t } = useLocale(); // Initialize useLocale
  const photosWithDetails = toilets.filter(toilet => toilet.photoUrls && toilet.photoUrls.length > 0 && toilet.photoUrls[0]);

  if (photosWithDetails.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-foreground">
          {t('landing.photoStrip.titlePart1')} <span className="text-accent">{t('landing.photoStrip.titlePart2')}</span>
        </h3>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border shadow-inner">
          <div className="flex w-max space-x-4 p-4">
            {photosWithDetails.map((toilet, index) => (
              <figure key={toilet.id + '-' + index} className="shrink-0">
                <div className="overflow-hidden rounded-lg shadow-md w-60 h-40 md:w-72 md:h-48 relative group cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]">
                  <Image
                    src={toilet.photoUrls[0]}
                    alt={t('landing.photoStrip.alt', { name: toilet.name })}
                    fill
                    sizes="(max-width: 768px) 15rem, 18rem"
                    style={{ objectFit: 'cover' }}
                    className="group-hover:brightness-105 transition-all duration-300"
                    data-ai-hint="bathroom view"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/10 transition-all duration-300"></div>
                  <figcaption className="absolute bottom-2 left-2 text-white text-xs p-1 bg-black/50 rounded">
                    {toilet.name}
                  </figcaption>
                </div>
              </figure>
            ))}
             {photosWithDetails.length < 3 && (
              <>
                {[...Array(3 - photosWithDetails.length)].map((_, i) => (
                  <div key={`placeholder-${i}`} className="shrink-0 overflow-hidden rounded-lg shadow-md w-60 h-40 md:w-72 md:h-48 bg-muted flex items-center justify-center text-muted-foreground">
                    {t('landing.photoStrip.placeholder')}
                  </div>
                ))}
              </>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}

    