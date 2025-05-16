
"use client";

import type { Toilet, ToiletFeaturesBoolean } from '@/lib/types';
import { TOILET_FEATURES_CONFIG, QUICK_TAGS_CONFIG } from '@/lib/constants';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import StarRating from './star-rating';
import Image from 'next/image';
import { ScrollArea } from './ui/scroll-area';
import { MapPin, Sparkles, Share2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/context/locale-context'; // Import useLocale

interface ToiletDetailsSheetProps {
  toilet: Toilet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ToiletDetailsSheet({ toilet, open, onOpenChange }: ToiletDetailsSheetProps) {
  const { toast } = useToast();
  const { t } = useLocale(); // Initialize useLocale

  if (!toilet) {
    return null;
  }

  const getActiveFeatures = (features: ToiletFeaturesBoolean) => {
    return TOILET_FEATURES_CONFIG.filter(config => features[config.id]);
  };

  const activeFeatures = getActiveFeatures(toilet.features);

  const displayQuickTags = toilet.quickTags?.map(tagId => {
    const tagConfig = QUICK_TAGS_CONFIG.find(t => t.id === tagId);
    return tagConfig ? { ...tagConfig, label: t(tagConfig.labelKey) } : null; // Translate label
  }).filter(Boolean);

  const handleShare = async () => {
    if (!toilet) return;
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-2xl">{toilet.name}</SheetTitle>
          {toilet.address && (
             <SheetDescription className="flex items-center text-sm pt-1">
                <MapPin size={14} className="mr-1.5 text-muted-foreground" />
                {toilet.address}
            </SheetDescription>
          )}
        </SheetHeader>

        <ScrollArea className="flex-grow">
          <div className="p-6 space-y-6">
            {toilet.photoUrls && toilet.photoUrls.length > 0 && toilet.photoUrls[0] && (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-md">
                <Image
                  src={toilet.photoUrls[0]}
                  alt={t('landing.toiletPhotoAlt', { name: toilet.name })}
                  fill
                  style={{objectFit:"cover"}}
                  data-ai-hint="bathroom interior"
                />
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('toiletDetails.ratingTitle')}</h3>
              <StarRating rating={toilet.averageRating} readOnly size={24} />
            </div>

            {toilet.legacyReview && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('toiletDetails.reviewTitle')}</h3>
                <p className="text-foreground bg-secondary p-3 rounded-md text-sm leading-relaxed italic">"{toilet.legacyReview}"</p>
              </div>
            )}

            {displayQuickTags && displayQuickTags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <Sparkles size={16} className="mr-1.5 text-primary" />
                  {t('toiletDetails.quickTagsTitle')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {displayQuickTags.map(tag => (
                    tag && (
                        <Badge key={tag.id} variant="secondary" className="text-xs">
                        {tag.emoji && <span className="mr-1">{tag.emoji}</span>}
                        {tag.label}
                        </Badge>
                    )
                  ))}
                </div>
              </div>
            )}

            {activeFeatures.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('toiletDetails.featuresTitle')}</h3>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {activeFeatures.map((feature) => {
                    if (!feature) return null;
                    const translatedLabel = t(`constants.toiletFeatures.${feature.id}.label`);
                    return (
                      <li key={feature.id} className="flex items-center gap-2 text-sm">
                        {feature.icon && <feature.icon size={18} className="text-primary" />}
                        <span>{translatedLabel}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
             <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('toiletDetails.locationTitle')}</h3>
                <p className="text-sm">{t('toiletDetails.locationCoordinates', { lat: toilet.location.latitude.toFixed(4), lng: toilet.location.longitude.toFixed(4) })}</p>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="p-6 pt-4 border-t flex flex-row justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none sm:w-auto">
            {t('toiletDetails.closeButton')}
          </Button>
          <Button onClick={handleShare} className="flex-1 sm:flex-none sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <Share2 size={16} className="mr-2" />
            {t('toiletDetails.shareButton')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

    