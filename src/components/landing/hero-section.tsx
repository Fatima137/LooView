
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MapPin, Camera, Search, ChevronLeft, ChevronRight, Users, Info, Globe, ChevronsRight } from 'lucide-react'; // Added Globe
import { useLocale } from '@/context/locale-context';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  onShareExperienceClick: () => void;
}

interface SlideData {
  id: string;
  imageUrl: string;
  aiHint: string;
  titleKey: string;
  subtitleKey: string;
  welcomeKey?: string;
  descriptionKey: string;
  cta1: {
    textKey: string;
    icon: React.ElementType;
    action: () => void;
    variant: 'default' | 'destructive' | 'secondary' | 'outline' | 'ghost' | 'link';
    className?: string;
  };
  cta2: {
    textKey: string;
    icon: React.ElementType;
    action: () => void;
    variant: 'default' | 'destructive' | 'secondary' | 'outline' | 'ghost' | 'link';
    className?: string;
  };
  cta3?: {
    textKey: string;
    icon?: React.ElementType | string; // Allow string for emojis
    action: () => void;
    variant: 'default' | 'destructive' | 'secondary' | 'outline' | 'ghost' | 'link';
    className?: string;
  };
}

export default function HeroSection({ onShareExperienceClick }: HeroSectionProps) {
  const { t } = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleBrowseNearby = () => {
    const mapPreview = document.getElementById('map-preview-section');
    if (mapPreview) {
      mapPreview.scrollIntoView({ behavior: 'smooth' });
    } else {
      const mainMap = document.querySelector('[data-mapid^="looview_map_preview"]');
      if (mainMap) {
        mainMap.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNavigateToAddToilet = () => {
    // This might involve checking auth status first in a real app, similar to onShareExperienceClick
    window.location.href = '/add-toilet';
  };
  
  const handleNavigateToLeaderboard = () => {
    window.location.href = '/leaderboard';
  };

  const handleNavigateToAbout = () => {
    window.location.href = '/about';
  };


  const slides: SlideData[] = [
    {
      id: 'slide1',
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/looview-6k3nm.firebasestorage.app/o/Images%2Fhomepage-loovview-2.gif?alt=media&token=91b058c9-e0d4-435c-9707-50b93bc3385c',
      aiHint: 'bathroom collage',
      titleKey: 'hero.title',
      subtitleKey: 'hero.subtitle',
      welcomeKey: 'hero.welcome',
      descriptionKey: 'hero.description',
      cta1: {
        textKey: 'hero.browseButton',
        icon: Search,
        action: handleBrowseNearby,
        variant: 'default',
        className: 'bg-primary hover:bg-primary/90 text-primary-foreground',
      },
      cta2: {
        textKey: 'hero.shareButton',
        icon: Camera,
        action: onShareExperienceClick,
        variant: 'destructive',
      },
      cta3: {
        textKey: 'hero.saveButtsButton',
        icon: '💩', // Emoji example
        action: handleNavigateToAddToilet, // Or a dedicated "why contribute" section
        variant: 'secondary',
        className: 'bg-accent hover:bg-accent/90 text-accent-foreground',
      },
    },
    {
      id: 'slide2',
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/looview-6k3nm.firebasestorage.app/o/Images%2Fhomepage-loovview.gif?alt=media&token=0aebae35-45a4-40bc-8c0b-e52ae0d7b07f',
      aiHint: 'people collaborating community',
      titleKey: 'hero.slide2.title',
      subtitleKey: 'hero.slide2.subtitle',
      descriptionKey: 'hero.slide2.description',
      cta1: {
        textKey: 'hero.slide2.cta1',
        icon: Camera,
        action: onShareExperienceClick,
        variant: 'destructive',
      },
      cta2: {
        textKey: 'hero.slide2.cta2',
        icon: Users,
        action: handleNavigateToLeaderboard,
        variant: 'outline',
        className: "border-primary text-primary hover:bg-primary/10",
      },
    },
    {
      id: 'slide3',
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/looview-6k3nm.firebasestorage.app/o/Images%2Fhomepage-looview-3.gif?alt=media&token=2903a8ea-f02c-4e54-b493-66cbaea3e5e7',
      aiHint: 'pope looking at toilet on phone',
      titleKey: 'hero.slide3.titleNew',
      subtitleKey: 'hero.slide3.subtitleNew',
      descriptionKey: 'hero.slide3.descriptionNew',
      cta1: {
        textKey: 'hero.slide3.cta1', // "Explore the Global Map"
        icon: Globe,
        action: handleBrowseNearby,
        variant: 'default',
         className: 'bg-primary hover:bg-primary/90 text-primary-foreground',
      },
      cta2: {
        textKey: 'hero.slide3.cta2', // "Learn About Features"
        icon: Info,
        action: handleNavigateToAbout, // Or a dedicated features page
        variant: 'outline',
         className: "border-primary text-primary hover:bg-primary/10",
      },
    },
  ];

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext();
    }, 7000); // Auto-play interval
    return () => clearTimeout(timer);
  }, [currentIndex, goToNext]);

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative h-screen min-h-[600px] md:min-h-[700px] flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Image */}
      {slides.map((slide, index) => (
         <Image
          key={slide.id}
          src={slide.imageUrl}
          alt={t('hero.slideAlt', { slideNum: index + 1, context: slide.aiHint })}
          fill
          style={{ objectFit: 'cover' }}
          priority={index === 0}
          className={cn(
            "transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100 z-0" : "opacity-0 z-[-1]"
          )}
          data-ai-hint={slide.aiHint}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent/10"></div>

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8 max-w-3xl mx-auto mt-10 sm:mt-0">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight shadow-black/50 text-shadow animate-fadeIn">
            {t(currentSlide.titleKey)}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-100/90 shadow-black/50 text-shadow-sm animate-fadeIn delay-200">
            {t(currentSlide.subtitleKey)}
          </p>
        </div>

        {currentSlide.welcomeKey && currentSlide.descriptionKey && (
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-lg shadow-xl mb-10 animate-fadeIn delay-400">
            <p className="text-xl md:text-2xl font-semibold mb-2">{t(currentSlide.welcomeKey)}</p>
            <p className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto leading-relaxed">
              {t(currentSlide.descriptionKey)}
            </p>
          </div>
        )}
        {!currentSlide.welcomeKey && currentSlide.descriptionKey && (
            <div className="bg-black/30 backdrop-blur-md p-6 rounded-lg shadow-xl mb-10 animate-fadeIn delay-400">
                <p className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto leading-relaxed">
                  {t(currentSlide.descriptionKey)}
                </p>
            </div>
        )}


        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn delay-600">
          <Button
            size="lg"
            variant={currentSlide.cta1.variant}
            className={cn("text-lg px-8 py-6 rounded-lg shadow-lg", currentSlide.cta1.className)}
            onClick={currentSlide.cta1.action}
          >
            <currentSlide.cta1.icon className="mr-2 h-5 w-5" />
            {t(currentSlide.cta1.textKey)}
          </Button>
          <Button
            size="lg"
            variant={currentSlide.cta2.variant}
            className={cn("text-lg px-8 py-6 rounded-lg shadow-lg", currentSlide.cta2.className)}
            onClick={currentSlide.cta2.action}
          >
            <currentSlide.cta2.icon className="mr-2 h-5 w-5" />
            {t(currentSlide.cta2.textKey)}
          </Button>
        </div>
        {currentSlide.cta3 && (
          <div className="mt-8 animate-fadeIn delay-800">
            <Button
              size="lg"
              variant={currentSlide.cta3.variant}
              className={cn("text-lg px-8 py-6 rounded-lg shadow-lg", currentSlide.cta3.className)}
              onClick={currentSlide.cta3.action}
            >
              {typeof currentSlide.cta3.icon === 'string' ? (
                <span role="img" aria-label="emoji icon" className="mr-2 text-2xl">{currentSlide.cta3.icon}</span>
              ) : (
                currentSlide.cta3.icon && <currentSlide.cta3.icon className="mr-2 h-5 w-5" />
              )}
              {t(currentSlide.cta3.textKey)}
            </Button>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 -translate-y-1/2 z-20 text-white hover:bg-white/20 h-12 w-12 rounded-full"
        aria-label={t('hero.previousSlide')}
      >
        <ChevronLeft size={32} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 z-20 text-white hover:bg-white/20 h-12 w-12 rounded-full"
        aria-label={t('hero.nextSlide')}
      >
        <ChevronRight size={32} />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-3 w-3 rounded-full transition-colors",
              currentIndex === index ? "bg-white" : "bg-white/50 hover:bg-white/75"
            )}
            aria-label={t('hero.goToSlide', { slideNum: index + 1 })}
          />
        ))}
      </div>

      <style jsx global>{`
        .text-shadow {
          text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
        }
        .text-shadow-sm {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-800 { animation-delay: 0.8s; }
      `}</style>
    </section>
  );
}

