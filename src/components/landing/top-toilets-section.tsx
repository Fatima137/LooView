
"use client";

import type { Toilet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import StarRating from '@/components/star-rating';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MessageSquare, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/context/locale-context'; // Import useLocale

interface TopToiletsSectionProps {
  toilets: Toilet[];
  onToiletClick: (toilet: Toilet) => void;
}

export default function TopToiletsSection({ toilets, onToiletClick }: TopToiletsSectionProps) {
  const { toast } = useToast();
  const { t } = useLocale(); // Initialize useLocale

  if (!toilets || toilets.length === 0) {
    return null;
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
          // User cancelled
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
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground">
          <span role="img" aria-label="gold medal emoji">🥇</span> {t('landing.topToilets.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {toilets.slice(0, 3).map((toilet) => (
            <Card
              key={toilet.id}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card cursor-pointer"
              onClick={() => onToiletClick(toilet)}
            >
              <div className="relative w-full h-56">
                {toilet.photoUrls && toilet.photoUrls.length > 0 && toilet.photoUrls[0] && (
                  <Image
                    src={toilet.photoUrls[0]}
                    alt={t('landing.toiletPhotoAlt', { name: toilet.name })}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="clean bathroom"
                  />
                )}
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
              <CardHeader className="pb-3">
                <CardTitle className="text-xl truncate">{toilet.name}</CardTitle>
                <CardDescription className="text-sm">
                  {toilet.countryFlag && <span className="mr-1.5">{toilet.countryFlag}</span>}
                  {toilet.address || t('landing.locationDetailsUnavailable')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div className="mb-4">
                  <StarRating rating={toilet.averageRating} readOnly size={22} />
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <MessageSquare size={16} className="mr-1.5" />
                    <span>{t('landing.reviewCount', { count: toilet.reviewCount || Math.floor(Math.random() * 30) + 1 })}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                >
                  {t('landing.seeDetails')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

    