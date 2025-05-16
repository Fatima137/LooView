
"use client";

import Link from 'next/link';
import { Github, Twitter, Linkedin, Globe, FileText, HelpCircle, Users, Award, MessageSquareHeart, Edit3, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocale } from '@/context/locale-context';


export default function AppFooter() {
  const { t, language, setLanguage, availableLanguages } = useLocale();

  return (
    <footer className="bg-muted text-muted-foreground py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-8">
        {/* Upper Content Part */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10">
          {/* Column 1: About LooView */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3 flex items-center">
              {t('landing.footer.about.title')}
            </h3>
            <p className="text-sm leading-relaxed">
              {t('landing.footer.about.description')}
            </p>
          </div>

          {/* Column 2: Navigate LooView */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              {t('landing.footer.explore.title')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors flex items-center"><ShieldCheck size={16} className="mr-2 opacity-70" /><span>{t('landing.footer.explore.mission')}</span></Link></li>
              <li><Link href="/press-kit" className="hover:text-primary transition-colors flex items-center"><Award size={16} className="mr-2 opacity-70" /><span>{t('landing.footer.explore.pressKit')}</span></Link></li>
              <li><Link href="/support" className="hover:text-primary transition-colors flex items-center"><HelpCircle size={16} className="mr-2 opacity-70" /><span>{t('landing.footer.explore.faqSupport')}</span></Link></li>
              <li><Link href="/fun-facts" className="hover:text-primary transition-colors flex items-center"><FileText size={16} className="mr-2 opacity-70" /><span>{t('landing.footer.explore.funFacts')}</span></Link></li>
            </ul>
          </div>

          {/* Column 3: Community & Connect */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                 {t('landing.footer.community.title')}
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/leaderboard" className="hover:text-primary transition-colors flex items-center"><Award size={16} className="mr-2 opacity-70" /><span>{t('landing.footer.community.leaderboard')}</span></Link></li>
                <li><Link href="/support#suggest-feature" className="hover:text-primary transition-colors flex items-center"><MessageSquareHeart size={16} className="mr-2 opacity-70" /><span>{t('landing.footer.community.suggestFeature')}</span></Link></li>
                <li><Link href="/support#community-guidelines" className="hover:text-primary transition-colors flex items-center"><Users size={16} className="mr-2 opacity-70" /><span>{t('landing.footer.community.guidelines')}</span></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3">{t('landing.footer.language.title')}</h4>
              <Select value={language.code} onValueChange={(value) => {
                const selectedLang = availableLanguages.find(l => l.code === value);
                if (selectedLang) setLanguage(selectedLang);
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('landing.footer.language.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="mr-2">{lang.flag}</span>{lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">{t('landing.footer.connect.title')}</h4>
                <TooltipProvider delayDuration={100}>
                <div className="flex space-x-2">
                    {[
                    { href: "https://twitter.com/looview", labelKey: "landing.footer.connect.twitter", icon: Twitter },
                    { href: "https://github.com/your-repo/looview", labelKey: "landing.footer.connect.github", icon: Github },
                    { href: "https://linkedin.com/company/looview", labelKey: "landing.footer.connect.linkedin", icon: Linkedin },
                    ].map((social) => (
                    <Tooltip key={social.labelKey}>
                        <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-primary rounded-full w-10 h-10 hover:bg-accent/10 transition-colors">
                            <Link href={social.href} target="_blank" aria-label={t(social.labelKey)}>
                            <social.icon size={20} />
                            </Link>
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-popover text-popover-foreground text-xs py-1 px-2">
                            <p>{t(social.labelKey)}</p>
                        </TooltipContent>
                    </Tooltip>
                    ))}
                </div>
                </TooltipProvider>
            </div>

          </div>
        </div>

        {/* Bottom Meta Bar */}
        <div className="border-t border-border pt-8 mt-10 text-center">
          <p className="text-xs text-muted-foreground/80 mb-2">
            &copy; {new Date().getFullYear()} LooView. {t('landing.footer.rightsReserved')}
          </p>
          <p className="text-sm text-muted-foreground/90 max-w-2xl mx-auto">
            {t('landing.footer.tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}
