
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/context/locale-context';
import { Download, ExternalLink, Info, Mail, MessageCircle, Palette, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PressKitPage() {
  const { t } = useLocale();

  const brandColors = [
    { name: "Primary (Royal Blue)", hex: "#2563EB", hslVar: "hsl(var(--primary))" },
    { name: "Accent (Warm Yellow)", hex: "#FACC15", hslVar: "hsl(var(--accent))" },
    { name: "Background (Light Grey)", hex: "#F9FAFB", hslVar: "hsl(var(--background))" },
    { name: "Foreground (Dark Grey-Blue)", hex: "#1F2937", hslVar: "hsl(var(--foreground))" },
    { name: "Success (Green-Blue)", hex: "#10B981", hslVar: "hsl(var(--success))" },
    { name: "Destructive (Playful Red/Pink)", hex: "#F87171", hslVar: "hsl(var(--destructive))" },
  ];

  return (
    <div className="flex-grow bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <Image
            src="https://picsum.photos/seed/looviewbrand/128/128"
            alt={t('pressKit.logoAlt')}
            width={128}
            height={128}
            className="mx-auto mb-8 rounded-full shadow-2xl"
            data-ai-hint="brand logo"
          />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-foreground">
            {t('pressKit.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {t('pressKit.subtitle')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 md:py-20 space-y-16 md:space-y-24">
        {/* About LooView Section */}
        <section>
          <Card className="shadow-xl border-border">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl flex items-center">
                <Info size={28} className="mr-3 text-primary" />
                {t('pressKit.about.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">{t('pressKit.about.p1')}</p>
              <p className="leading-relaxed">{t('pressKit.about.p2')}</p>
            </CardContent>
          </Card>
        </section>

        {/* Key Features Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground">
            {t('pressKit.features.title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { key: 'feature1', title: t('pressKit.features.feature1.title'), description: t('pressKit.features.feature1.description') },
              { key: 'feature2', title: t('pressKit.features.feature2.title'), description: t('pressKit.features.feature2.description') },
              { key: 'feature3', title: t('pressKit.features.feature3.title'), description: t('pressKit.features.feature3.description') },
            ].map((feature) => (
              <Card key={feature.key} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                <CardHeader className="flex flex-col items-center pb-3 pt-6">
                  <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <Zap size={32} className="text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Brand Assets Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground">
            {t('pressKit.assets.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="shadow-lg bg-card">
              <CardHeader>
                <CardTitle>{t('pressKit.assets.logos.title')}</CardTitle>
                <CardDescription>{t('pressKit.assets.logos.description')}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <Image src="https://picsum.photos/seed/looviewlogo1/200/100" alt={t('pressKit.assets.logos.logo1Alt')} width={150} height={75} className="mx-auto" data-ai-hint="logo dark" />
                  <p className="text-xs mt-2 text-muted-foreground">{t('pressKit.assets.logos.logo1Label')}</p>
                </div>
                <div className="text-center p-4 bg-foreground text-background rounded-lg">
                  <Image src="https://picsum.photos/seed/looviewlogo2/200/100?grayscale&invert" alt={t('pressKit.assets.logos.logo2Alt')} width={150} height={75} className="mx-auto" data-ai-hint="logo light" />
                  <p className="text-xs mt-2 text-muted-foreground">{t('pressKit.assets.logos.logo2Label')}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Download size={16} className="mr-2" />
                  {t('pressKit.assets.logos.downloadButton')}
                </Button>
              </CardFooter>
            </Card>

            <Card className="shadow-lg bg-card">
              <CardHeader>
                <CardTitle className="flex items-center"><Palette size={20} className="mr-2 text-primary" /> {t('pressKit.assets.colors.title')}</CardTitle>
                <CardDescription>{t('pressKit.assets.colors.description')}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {brandColors.map(color => (
                  <div key={color.name} className="p-2 rounded-md border text-center">
                    <div style={{ backgroundColor: color.hslVar }} className="h-12 w-full rounded mb-1 border"></div>
                    <p className="text-xs font-medium text-foreground">{color.name}</p>
                    <p className="text-xs text-muted-foreground">{color.hex}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Founder / Team Section */}
        <section>
           <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground">
            {t('pressKit.team.title')}
          </h2>
          <Card className="shadow-xl border-border bg-card">
            <CardHeader>
                 <CardTitle className="text-2xl md:text-3xl flex items-center">
                    <Users size={28} className="mr-3 text-primary" />
                    {t('pressKit.team.subtitle')}
                 </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">{t('pressKit.team.p1')}</p>
                <Button variant="link" asChild className="p-0 h-auto text-primary hover:underline">
                    <Link href="/about">{t('pressKit.team.learnMoreButton')} <ExternalLink size={14} className="ml-1" /></Link>
                </Button>
            </CardContent>
          </Card>
        </section>
        
        {/* Contact Information Section */}
        <section className="text-center py-12 md:py-16 bg-secondary/50 rounded-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            {t('pressKit.contact.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('pressKit.contact.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 rounded-lg shadow-md">
              <a href={`mailto:${t('pressKit.contact.email')}`}>
                <Mail className="mr-2 h-5 w-5" />
                {t('pressKit.contact.emailButton')}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 rounded-lg shadow-md border-primary text-primary hover:bg-primary/5">
              <Link href="/support">
                <MessageCircle className="mr-2 h-5 w-5" />
                {t('pressKit.contact.faqButton')}
              </Link>
            </Button>
          </div>
        </section>

        {/* In The News Section (Placeholder) */}
         <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground">
            {t('pressKit.news.title')}
          </h2>
          <div className="text-center text-muted-foreground">
            <p>{t('pressKit.news.placeholder')}</p>
            {/* Future: Map over news articles */}
          </div>
        </section>

      </div>
    </div>
  );
}
