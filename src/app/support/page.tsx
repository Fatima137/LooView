
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLocale } from '@/context/locale-context';
import { HelpCircle, LifeBuoy, MessageSquare, Users, Mail, ChevronRight, FileText, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SupportPage() {
  const { t } = useLocale();

  const faqItems = [
    {
      questionKey: 'support.faq.item1.question',
      answerKey: 'support.faq.item1.answer',
    },
    {
      questionKey: 'support.faq.item2.question',
      answerKey: 'support.faq.item2.answer',
    },
    {
      questionKey: 'support.faq.item3.question',
      answerKey: 'support.faq.item3.answer',
    },
    {
      questionKey: 'support.faq.item4.question',
      answerKey: 'support.faq.item4.answer',
    },
    {
      questionKey: 'support.faq.item5.question',
      answerKey: 'support.faq.item5.answer',
    },
  ];

  return (
    <div className="flex-grow bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <LifeBuoy size={64} className="mx-auto mb-6 text-primary" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-foreground">
            {t('support.hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {t('support.hero.subtitle')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 md:py-20 space-y-16 md:space-y-24">
        {/* FAQ Section */}
        <section>
          <Card className="shadow-xl border-border">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl flex items-center">
                <HelpCircle size={28} className="mr-3 text-primary" />
                {t('support.faq.title')}
              </CardTitle>
              <CardDescription>{t('support.faq.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline text-base md:text-lg">
                      {t(item.questionKey)}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      <p dangerouslySetInnerHTML={{ __html: t(item.answerKey) }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Contact Us Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground">
            {t('support.contact.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 md:items-stretch">
            <Card className="shadow-lg bg-card flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center"><Mail size={24} className="mr-2 text-primary" /> {t('support.contact.email.title')}</CardTitle>
                <CardDescription>{t('support.contact.email.description')}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between">
                <p className="text-sm text-muted-foreground">
                  {t('support.contact.email.responseInfo')}
                </p>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
                  <a href={`mailto:${t('support.contact.email.address')}`}>
                    <Mail size={18} className="mr-2" />{t('support.contact.email.button')}
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-card flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center"><MessageSquare size={24} className="mr-2 text-primary" /> {t('support.contact.community.title')}</CardTitle>
                <CardDescription>{t('support.contact.community.description')}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between">
                <p className="text-sm text-muted-foreground">
                  {t('support.contact.community.forumInfo')}
                </p>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/community-forum"> {/* Placeholder link */}
                    <Users size={18} className="mr-2" /> {t('support.contact.community.button')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Report a Problem / Feature Request Section */}
        <section className="grid md:grid-cols-2 gap-8 md:items-stretch">
            <Card className="shadow-lg bg-card flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center"><FileText size={24} className="mr-2 text-destructive" /> {t('support.reportProblem.title')}</CardTitle>
                <CardDescription>{t('support.reportProblem.description')}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t('support.reportProblem.instructions')}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {t('support.reportProblem.microcopy')}
                  </p>
                </div>
                <Button asChild variant="destructive" className="w-full mt-4">
                  <Link href="/report-issue"> {/* Placeholder link */}
                     {t('support.reportProblem.button')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-lg bg-card flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center"><Lightbulb size={24} className="mr-2 text-accent" /> {t('support.featureRequest.title')}</CardTitle>
                <CardDescription>{t('support.featureRequest.description')}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between">
                 <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t('support.featureRequest.instructions')}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {t('support.featureRequest.microcopy')}
                  </p>
                </div>
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-4">
                  <Link href="/suggest-feature"> {/* Placeholder link */}
                    {t('support.featureRequest.button')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
        </section>


        {/* Helpful Resources Section */}
        <section className="text-center py-12 md:py-16 bg-secondary/50 rounded-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            {t('support.resources.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('support.resources.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild variant="link" className="text-lg text-primary hover:underline">
              <Link href="/about">
                {t('support.resources.aboutLink')} <ChevronRight size={18} className="ml-1" />
              </Link>
            </Button>
            <Button asChild variant="link" className="text-lg text-primary hover:underline">
              <Link href="/community-guidelines">
                {t('support.resources.guidelinesLink')} <ChevronRight size={18} className="ml-1" />
              </Link>
            </Button>
             <Button asChild variant="link" className="text-lg text-primary hover:underline">
              <Link href="/press-kit">
                {t('support.resources.pressKitLink')} <ChevronRight size={18} className="ml-1" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

