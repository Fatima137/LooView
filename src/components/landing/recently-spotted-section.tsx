
"use client";

import type { Toilet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import StarRating from '@/components/star-rating';
import Image from 'next/image';
import { Button } from '../ui/button';
import { ChevronRight, Share2, MapPin, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/context/locale-context'; // Import useLocale

interface RecentlySpottedSectionProps {
  toilets: Toilet[];
  onToiletClick: (toilet: Toilet) => void;
}

export default function RecentlySpottedSection({ toilets, onToiletClick }: RecentlySpottedSectionProps) {
  const { toast } = useToast();
  const { t } = useLocale(); // Initialize useLocale

  if (!toilets || toilets.length === 0) {
    return (
      <section className="py-12 md:py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            <span role="img" aria-label="eyes emoji" className="mr-2">👀</span>{t('landing.recentlySpotted.title')}
          </h2>
          <p className="text-muted-foreground">{t('landing.recentlySpotted.noToilets')}</p>
        </div>
      </section>
    );
  }

  const handleShare = async (event: React.MouseEvent, toilet: Toilet) => {
    event.stopPropagation();
    const shareUrl = `${window.location.origin}/?toilet=${toilet.id}`;
    const shareTitle = `LooView: ${toilet.name}`;
    let shareText = t('landing.share.textBase', { name: toilet.name, rating: toilet.averageRating.toFixed(1) });
    if (toilet.address) {
      shareText += ` ${t('landing.share.textAddress', { address: toilet.address })}`;
    }
    if (toilet.legacyReview) {
      shareText += ` ${t('landing.share.textReview', { review: toilet.legacyReview.substring(0, 100) + (toilet.legacyReview.length > 100 ? '...' : '') })}`;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast({ title: t('toast.shareSuccessTitle') });
      } catch (error) {
        console.error('Error sharing:', error);
        const err = error as Error;
        if (err.name === 'AbortError') {
          // User cancelled the share dialog
        } else if (err.name === 'NotAllowedError' || err.message.toLowerCase().includes('permission denied')) {
          toast({
            title: t('toast.shareErrorBlockedTitle'),
            description: t('toast.shareErrorBlockedDescription'),
            variant: "destructive",
            duration: 7000
          });
          try {
            await navigator.clipboard.writeText(`${shareTitle} ${shareText} ${shareUrl}`);
          } catch (copyError) {
            console.error('Failed to copy after share permission error: ', copyError);
             toast({ title: t('toast.shareErrorCopyFailedTitle'), description: t('toast.shareErrorGenericDescription'), variant: "destructive" });
          }
        } else {
          toast({ title: t('toast.shareErrorGenericTitle'), description: t('toast.shareErrorGenericDescription'), variant: "destructive" });
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareTitle} ${shareText} ${shareUrl}`);
        toast({ title: t('toast.shareSuccessTitle'), description: t('toast.shareSuccessDescriptionLinkCopied') });
      } catch (err) {
        console.error('Failed to copy: ', err);
        toast({ title: t('toast.shareErrorCopyFailedTitle'), description: t('toast.shareErrorCopyFailedDescription'), variant: "destructive" });
      }
    }
  };

  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground">
          <span role="img" aria-label="eyes emoji" className="mr-2">👀</span>{t('landing.recentlySpotted.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {toilets.map((toilet) => (
            <Card key={toilet.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
              {toilet.photoUrls && toilet.photoUrls.length > 0 && toilet.photoUrls[0] && (
                <div className="relative w-full h-48 cursor-pointer group" onClick={() => onToiletClick(toilet)}>
                  <Image
                    src={toilet.photoUrls[0]}
                    alt={t('landing.toiletPhotoAlt', { name: toilet.name })}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="toilet photo"
                  />
                   <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleShare(e, toilet)}
                    className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white hover:text-white h-9 w-9 rounded-full"
                    aria-label={t('landing.share.ariaLabel')}
                  >
                    <Share2 size={18} />
                  </Button>
                </div>
              )}
              <CardHeader className="pb-2 cursor-pointer" onClick={() => onToiletClick(toilet)}>
                <CardTitle className="text-lg truncate">{toilet.name}</CardTitle>
                 <CardDescription className="text-xs text-muted-foreground truncate flex items-center">
                   {toilet.countryFlag && <span className="mr-1">{toilet.countryFlag}</span>}
                   <MapPin size={12} className="mr-1 text-muted-foreground flex-shrink-0" />
                   <span className="truncate">
                    {toilet.address || t('landing.locationFallback', { lat: toilet.location.latitude.toFixed(2), lng: toilet.location.longitude.toFixed(2) })}
                   </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow cursor-pointer" onClick={() => onToiletClick(toilet)}>
                <StarRating rating={toilet.averageRating || 0} readOnly size={18} />
                {toilet.legacyReview && (
                  <div className="text-sm text-muted-foreground mt-2 flex items-start">
                    <MessageSquare size={14} className="mr-1.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span className="italic line-clamp-3">
                     “{toilet.legacyReview}”
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-3">
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary hover:underline group text-sm"
                  onClick={() => onToiletClick(toilet)}
                >
                  {t('landing.readMore')} <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
                {!(toilet.photoUrls && toilet.photoUrls.length > 0 && toilet.photoUrls[0]) && (
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleShare(e, toilet)}
                        className="text-muted-foreground hover:text-primary h-9 w-9 rounded-full"
                        aria-label={t('landing.share.ariaLabel')}
                      >
                        <Share2 size={18} />
                      </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

    