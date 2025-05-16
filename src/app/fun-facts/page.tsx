
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/context/locale-context';
import { Heart, Share2, Filter, Shuffle, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface Fact {
  id: string;
  titleKey: string;
  textKey: string;
  imageHint: string; // For data-ai-hint
  imageUrl?: string; // Optional real image URL
}

interface ToiletType {
  id: string;
  nameKey: string;
  descriptionKey: string;
  ratingKey: string; // e.g., "⭐⭐⭐ Cheeks-on-cold-concrete experience"
  imageHint: string;
  imageUrl?: string;
}

const factsData: Fact[] = [
  { id: 'fact1', titleKey: 'toiletFun.facts.japanRules.title', textKey: 'toiletFun.facts.japanRules.text', imageHint: 'futuristic toilet buttons' },
  { id: 'fact2', titleKey: 'toiletFun.facts.goldenCrap.title', textKey: 'toiletFun.facts.goldenCrap.text', imageHint: 'golden toilet' },
  { id: 'fact3', titleKey: 'toiletFun.facts.ancientOversharing.title', textKey: 'toiletFun.facts.ancientOversharing.text', imageHint: 'roman communal toilet' },
  { id: 'fact4', titleKey: 'toiletFun.facts.skyPooper.title', textKey: 'toiletFun.facts.skyPooper.text', imageHint: 'toilet glass elevator' },
  { id: 'fact5', titleKey: 'toiletFun.facts.toiletTunes.title', textKey: 'toiletFun.facts.toiletTunes.text', imageHint: 'music notes toilet' },
  { id: 'fact6', titleKey: 'toiletFun.facts.globalFlush.title', textKey: 'toiletFun.facts.globalFlush.text', imageHint: 'earth water flush' },
  { id: 'fact7', titleKey: 'toiletFun.facts.greatStink.title', textKey: 'toiletFun.facts.greatStink.text', imageHint: 'victorian london fog' },
  { id: 'fact8', titleKey: 'toiletFun.facts.toiletPaperOrigins.title', textKey: 'toiletFun.facts.toiletPaperOrigins.text', imageHint: 'leaves corn cob toilet paper' },
];

const toiletTypesData: ToiletType[] = [
  { id: 'squat', nameKey: 'toiletFun.types.squat.name', descriptionKey: 'toiletFun.types.squat.description', ratingKey: 'toiletFun.types.squat.rating', imageHint: 'squat toilet diagram' },
  { id: 'hole', nameKey: 'toiletFun.types.holeInFloor.name', descriptionKey: 'toiletFun.types.holeInFloor.description', ratingKey: 'toiletFun.types.holeInFloor.rating', imageHint: 'simple hole toilet' },
  { id: 'portable', nameKey: 'toiletFun.types.portable.name', descriptionKey: 'toiletFun.types.portable.description', ratingKey: 'toiletFun.types.portable.rating', imageHint: 'festival portable toilet' },
  { id: 'smart', nameKey: 'toiletFun.types.smart.name', descriptionKey: 'toiletFun.types.smart.description', ratingKey: 'toiletFun.types.smart.rating', imageHint: 'japanese smart toilet controls' },
  { id: 'compost', nameKey: 'toiletFun.types.compost.name', descriptionKey: 'toiletFun.types.compost.description', ratingKey: 'toiletFun.types.compost.rating', imageHint: 'eco compost toilet' },
  { id: 'design', nameKey: 'toiletFun.types.design.name', descriptionKey: 'toiletFun.types.design.description', ratingKey: 'toiletFun.types.design.rating', imageHint: 'artistic design toilet' },
];


export default function FunFactsPage() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [likes, setLikes] = useState<Record<string, number>>({});

  const handleLike = (factId: string) => {
    setLikes(prev => ({ ...prev, [factId]: (prev[factId] || 0) + 1 }));
    toast({
      title: t('toiletFun.toast.liked.title'),
      description: t('toiletFun.toast.liked.description'),
      duration: 2000,
    });
  };

  const handleShare = (title: string, text: string) => {
    // Basic share simulation
    const shareUrl = window.location.href;
    const shareText = `${title}: ${text} - ${shareUrl}`;
    if (navigator.share) {
      navigator.share({ title, text: shareText, url: shareUrl })
        .then(() => toast({ title: t('toast.shareSuccessTitle') }))
        .catch((error) => {
           console.error('Error sharing:', error);
           navigator.clipboard.writeText(shareText)
             .then(() => toast({ title: t('toast.shareSuccessTitle'), description: t('toast.shareSuccessDescriptionLinkCopied') }))
             .catch(() => toast({ title: t('toast.shareErrorCopyFailedTitle'), variant: 'destructive' }));
        });
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => toast({ title: t('toast.shareSuccessTitle'), description: t('toast.shareSuccessDescriptionLinkCopied') }))
        .catch(() => toast({ title: t('toast.shareErrorCopyFailedTitle'), variant: 'destructive' }));
    }
  };

  return (
    <div className="flex-grow bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-foreground animate-fadeIn">
            {t('toiletFun.pageTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto animate-fadeIn delay-200">
            {t('toiletFun.pageSubtitle')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-16 md:space-y-20">
        {/* Toilet Facts Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12 text-foreground flex items-center justify-center">
            <span role="img" aria-label="poo emoji" className="text-4xl mr-3">💩</span>
            {t('toiletFun.factsSectionTitle')}
          </h2>
           <div className="flex justify-center gap-2 mb-8">
              <Button variant="outline"><Filter size={16} className="mr-2" />{t('toiletFun.filter.mostLiked')}</Button>
              <Button variant="outline"><Shuffle size={16} className="mr-2" />{t('toiletFun.filter.random')}</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {factsData.map((fact) => {
              const factTitle = t(fact.titleKey);
              const factText = t(fact.textKey);
              return (
                <Card key={fact.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-card transform hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold text-primary">{factTitle}</CardTitle>
                  </CardHeader>
                  <div className="relative w-full h-40 bg-muted">
                     <Image
                        src={fact.imageUrl || `https://placehold.co/600x400.png`}
                        alt={factTitle}
                        fill
                        style={{objectFit:"cover"}}
                        data-ai-hint={fact.imageHint}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                  </div>
                  <CardContent className="flex-grow pt-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">{factText}</p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t flex justify-between items-center">
                    <Button variant="ghost" size="sm" onClick={() => handleLike(fact.id)} className="text-destructive hover:text-destructive/80">
                      <Heart size={18} className="mr-1.5" fill={ (likes[fact.id] || 0) > 0 ? "currentColor" : "none"} />
                      {likes[fact.id] || 0} {t('toiletFun.likes')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare(factTitle, factText)}>
                      <Share2 size={16} className="mr-1.5" /> {t('toiletFun.share')}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Toilet Types Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12 text-foreground flex items-center justify-center">
             <span role="img" aria-label="toilet paper emoji" className="text-4xl mr-3">🧻</span>
            {t('toiletFun.typesSectionTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {toiletTypesData.map((type) => (
              <Card key={type.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-card transform hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold text-accent">{t(type.nameKey)}</CardTitle>
                </CardHeader>
                 <div className="relative w-full h-48 bg-secondary">
                    <Image
                        src={type.imageUrl || `https://placehold.co/600x400.png`}
                        alt={t(type.nameKey)}
                        fill
                        style={{objectFit:"cover"}}
                        data-ai-hint={type.imageHint}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                 </div>
                <CardContent className="flex-grow pt-4">
                  <p className="text-muted-foreground text-sm mb-2 leading-relaxed">{t(type.descriptionKey)}</p>
                  <p className="text-sm font-medium text-foreground italic">{t(type.ratingKey)}</p>
                </CardContent>
                 <CardFooter className="pt-4 border-t">
                    <Button variant="link" size="sm" className="p-0 h-auto text-primary hover:underline">
                        {t('toiletFun.learnMore')}
                    </Button>
                  </CardFooter>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Call to Action / User Contribution */}
        <section className="text-center py-12 md:py-16 bg-secondary/50 rounded-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            {t('toiletFun.contribution.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('toiletFun.contribution.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 rounded-lg shadow-md">
              <a href="/add-toilet">
                <ThumbsUp className="mr-2 h-5 w-5" />
                {t('toiletFun.contribution.buttonAdd')}
              </a>
            </Button>
          </div>
        </section>

      </div>
       <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .delay-200 { animation-delay: 0.2s; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

