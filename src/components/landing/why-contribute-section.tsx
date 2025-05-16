
"use client";

import { Sparkles, Map, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { useLocale } from '@/context/locale-context'; // Import useLocale

interface ContributionPoint {
  icon: React.ElementType;
  titleKey: string;
  descriptionKey: string;
  iconBgClass: string;
  iconColorClass: string;
}

const contributionPoints: ContributionPoint[] = [
  {
    icon: Sparkles,
    titleKey: "landing.whyContribute.point1.title",
    descriptionKey: "landing.whyContribute.point1.description",
    iconBgClass: "bg-green-100 dark:bg-green-900",
    iconColorClass: "text-green-500 dark:text-green-400"
  },
  {
    icon: Map,
    titleKey: "landing.whyContribute.point2.title",
    descriptionKey: "landing.whyContribute.point2.description",
    iconBgClass: "bg-blue-100 dark:bg-blue-900",
    iconColorClass: "text-blue-500 dark:text-blue-400"
  },
  {
    icon: Camera,
    titleKey: "landing.whyContribute.point3.title",
    descriptionKey: "landing.whyContribute.point3.description",
    iconBgClass: "bg-yellow-100 dark:bg-yellow-900",
    iconColorClass: "text-yellow-500 dark:text-yellow-400"
  }
];

export default function WhyContributeSection() {
  const { t } = useLocale(); // Initialize useLocale

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-20 text-foreground">
          <span role="img" aria-label="toilet emoji" className="mr-2 text-4xl md:text-5xl">🚽</span>
          {t('landing.whyContribute.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {contributionPoints.map((point, index) => (
            <Card
              key={index}
              className="text-center shadow-lg hover:shadow-2xl transition-all duration-300 bg-card border-2 border-transparent hover:border-primary/30 transform hover:-translate-y-2 group"
            >
              <CardHeader className="flex flex-col items-center pt-8 pb-4">
                <div className={cn(
                  "p-5 rounded-full mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
                  point.iconBgClass
                )}>
                  <point.icon size={40} className={cn(point.iconColorClass, "transition-transform duration-300 group-hover:rotate-12")} />
                </div>
                <CardTitle className="text-xl lg:text-2xl font-semibold text-foreground mb-2">{t(point.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent className="pb-8 px-6">
                <p className="text-muted-foreground leading-relaxed text-sm">{t(point.descriptionKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

    