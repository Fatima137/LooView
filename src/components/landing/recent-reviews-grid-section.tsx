
"use client";

import type { Toilet } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/star-rating';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MessageSquare, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/context/locale-context'; // Import useLocale

interface RecentReviewsGridSectionProps {
  toilets: Toilet[];
  onToiletClick: (toilet: Toilet) => void;
}

export default function RecentReviewsGridSection({ toilets, onToiletClick }: RecentReviewsGridSectionProps) {
  const { toast } = useToast();
  const { t } = useLocale(); // Initialize useLocale

  const reviewsToDisplay = toilets
    .filter(toilet => toilet.legacyReview && toilet.photoUrls && toilet.photoUrls.length > 0 && toilet.photoUrls[0])
    .slice(0, 9);

  if (reviewsToDisplay.length === 0) {
    return null;
  }

  const handleShare = async (event: React.MouseEvent, toilet: Toilet) => {
    event.stopPropagation();
    const shareUrl = `${window.location.origin}/?toilet=${toilet.id}`;
    const shareTitle = `LooView: ${toilet.name}`;
    let shareText = t('landing.share.textBase', { name: toilet.name, rating: toilet.averageRating.toFixed(1) });
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
    <section className="py-12 md:py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground">
         <span role="img" aria-label="speech bubble emoji" className="mr-2">💬</span> {t('landing.recentReviews.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {reviewsToDisplay.map((toilet, index) => (
            <Card
              key={toilet.id + '-' + index}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group flex flex-col cursor-pointer bg-card"
              onClick={() => onToiletClick(toilet)}
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={toilet.photoUrls[0]}
                  alt={t('landing.toiletPhotoAlt', { name: toilet.name })}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint="bathroom selfie"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 flex flex-col justify-end">
                  <h3 className="text-white font-semibold text-lg truncate">{toilet.name}</h3>
                  <p className="text-xs text-gray-300 truncate">{toilet.address}</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleShare(e, toilet)}
                    className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white hover:text-white h-9 w-9 rounded-full"
                    aria-label={t('landing.share.ariaLabelReview')}
                  >
                    <Share2 size={18} />
                  </Button>
              </div>
              <CardContent className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <StarRating rating={toilet.averageRating} readOnly size={18} />
                  <p className="text-sm text-muted-foreground mt-2 italic line-clamp-3">
                    “{toilet.legacyReview}”
                  </p>
                </div>
                <Button
                    variant="link"
                    size="sm"
                    className="mt-3 p-0 h-auto self-start text-primary group-hover:underline"
                >
                    {t('landing.viewDetails')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

    