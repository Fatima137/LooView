
"use client"; // Add this line

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Globe, Heart, Lightbulb, MessageSquarePlus, ShieldCheck, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/context/locale-context'; // Import useLocale

export default function AboutPage() {
  const { t } = useLocale(); // Use locale context

  const beliefs = [
    {
      icon: Lightbulb,
      titleKey: 'about.belief.transparency.title',
      textKey: 'about.belief.transparency.text',
    },
    {
      icon: Users,
      titleKey: 'about.belief.community.title',
      textKey: 'about.belief.community.text',
    },
    {
      icon: CheckCircle,
      titleKey: 'about.belief.accessibility.title',
      textKey: 'about.belief.accessibility.text',
    },
    {
      icon: ShieldCheck,
      titleKey: 'about.belief.hygiene.title',
      textKey: 'about.belief.hygiene.text',
    },
    {
      icon: Globe,
      titleKey: 'about.belief.global.title',
      textKey: 'about.belief.global.text',
    },
    {
      icon: Heart,
      titleKey: 'about.belief.humor.title',
      textKey: 'about.belief.humor.text',
    },
  ];


  return (
    <div className="flex-grow bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <ShieldCheck size={64} className="mx-auto mb-6 text-primary" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-foreground">
            {t('about.missionTitle')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {t('about.missionSubtitle')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 md:py-20">
        {/* Why We Exist Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground"
            dangerouslySetInnerHTML={{ __html: t('about.dailyDilemmaTitle') }}
          />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="https://picsum.photos/seed/loodilemma/600/400"
                alt="Person looking confused at a map"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
                data-ai-hint="confused map"
              />
            </div>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.dailyDilemmaP1')}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.dailyDilemmaP2')}
              </p>
            </div>
          </div>
        </section>

        {/* What We Believe In Section */}
        <section className="mb-16 md:mb-24 bg-secondary py-12 md:py-16 rounded-xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground"
           dangerouslySetInnerHTML={{ __html: t('about.coreBeliefsTitle') }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {beliefs.map((item) => (
              <Card key={item.titleKey} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                <CardHeader className="flex flex-col items-center pb-3 pt-6">
                  <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <item.icon size={32} className="text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">{t(item.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm">{t(item.textKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How We Do It Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground"
            dangerouslySetInnerHTML={{ __html: t('about.howItWorksTitle') }}
          />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 md:order-2">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.howItWorksP1')}
              </p>
              <ul className="space-y-3 text-lg text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="text-primary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: t('about.howItWorksLi1') }} />
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-primary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: t('about.howItWorksLi2') }} />
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-primary mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: t('about.howItWorksLi3') }} />
                </li>
              </ul>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('about.howItWorksP2')}
              </p>
            </div>
            <div className="md:order-1">
              <Image
                src="https://picsum.photos/seed/loocontribute/600/400"
                alt="Person happily using a phone to check LooView app"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
                data-ai-hint="phone app user"
              />
            </div>
          </div>
        </section>

        {/* Join the Movement Section */}
        <section className="text-center py-12 md:py-16 bg-primary/5 rounded-xl">
           <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
            dangerouslySetInnerHTML={{ __html: t('about.joinMovementTitle') }}
           />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('about.joinMovementP1')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-3 rounded-lg shadow-md">
              <Link href="/add-toilet">
                <MessageSquarePlus className="mr-2 h-5 w-5" />
                {t('about.joinMovementButtonShare')}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 rounded-lg shadow-md">
              <Link href="/">
                <Globe className="mr-2 h-5 w-5" />
                {t('about.joinMovementButtonExplore')}
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
