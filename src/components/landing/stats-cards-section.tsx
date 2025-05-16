
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, MapPin, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { useLocale } from '@/context/locale-context'; // Import useLocale

interface Stat {
  icon: React.ElementType;
  value: number;
  labelKey: string; // Changed from label to labelKey
  suffix?: string;
  iconBgClass: string;
  textColorClass: string;
  valueColorClass: string;
}

const AnimatedCounter = ({ targetValue, duration = 2000, className }: { targetValue: number, duration?: number, className?: string }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true;
      let start = 0;
      const end = targetValue;
      if (start === end) {
        setCount(end);
        return;
      }

      const incrementTime = Math.max(10, duration / (end || 1)); // Avoid division by zero

      const timer = setInterval(() => {
        start += Math.ceil(end / (duration / incrementTime));
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [inView, targetValue, duration]);

  return <span ref={ref} className={className}>{count.toLocaleString()}</span>;
};


export default function StatsCardsSection() {
  const { t } = useLocale(); // Initialize useLocale

  const stats: Stat[] = [
    { icon: MapPin, value: 45392, labelKey: 'landing.stats.toiletsRated', suffix: '+', iconBgClass: 'bg-chart-1/10', textColorClass: 'text-chart-1', valueColorClass: 'text-chart-1' },
    { icon: Globe, value: 132, labelKey: 'landing.stats.countriesCovered', iconBgClass: 'bg-chart-2/10', textColorClass: 'text-chart-2', valueColorClass: 'text-chart-2'},
    { icon: MessageSquare, value: 178298, labelKey: 'landing.stats.reviewsShared', suffix: '+', iconBgClass: 'bg-chart-3/10', textColorClass: 'text-chart-3', valueColorClass: 'text-chart-3' },
    { icon: ImageIcon, value: 22431, labelKey: 'landing.stats.photosUploaded', suffix: '+', iconBgClass: 'bg-chart-4/10', textColorClass: 'text-chart-4', valueColorClass: 'text-chart-4' },
  ];

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground">
          {t('landing.stats.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
              <CardHeader className="flex flex-col items-center pb-2 pt-6">
                <div className={cn("p-3 rounded-full mb-3", stat.iconBgClass)}>
                  <stat.icon size={32} className={cn(stat.textColorClass)} />
                </div>
                <CardTitle className={cn("text-4xl font-bold", stat.valueColorClass)}>
                  <AnimatedCounter targetValue={stat.value} className={stat.valueColorClass}/>{stat.suffix}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-muted-foreground font-medium">{t(stat.labelKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

    