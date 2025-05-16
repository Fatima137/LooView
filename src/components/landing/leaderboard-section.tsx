
"use client";

import type { UserProfile } from '@/lib/types';
import { mockUserProfiles } from '@/lib/data';
import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Medal, Award, Trophy } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useLocale } from '@/context/locale-context'; // Import useLocale

const medalIcons = [
  <Medal key="1" className="text-yellow-500" size={24} />,
  <Award key="2" className="text-slate-400" size={24} />,
  <Trophy key="3" className="text-amber-600" size={24} />
];

interface LeaderboardSectionProps {}

export default function LeaderboardSection({}: LeaderboardSectionProps) {
  const [users] = useState<UserProfile[]>(mockUserProfiles);
  const { t } = useLocale(); // Initialize useLocale

  const countries = useMemo(() => {
    const countryMap = new Map<string, { code: string; flag: string; name: string }>();

    const predefinedCountries = [
        { code: 'US', flag: '🇺🇸', name: 'USA' },
        { code: 'GB', flag: '🇬🇧', name: 'UK' },
        { code: 'FR', flag: '🇫🇷', name: 'France' },
        { code: 'DE', flag: '🇩🇪', name: 'Germany' },
        { code: 'JP', flag: '🇯🇵', name: 'Japan' },
        { code: 'NL', flag: '🇳🇱', name: 'Netherlands' },
        { code: 'AU', flag: '🇦🇺', name: 'Australia' },
        { code: 'CA', flag: '🇨🇦', name: 'Canada' },
        { code: 'NZ', flag: '🇳🇿', name: 'New Zealand' },
        { code: 'ES', flag: '🇪🇸', name: 'Spain' },
        { code: 'PT-BR', flag: '🇧🇷', name: 'Brazil' }, // Ensure country name is translatable or consistently English
    ];

    predefinedCountries.forEach(pc => {
      if (pc.code && pc.flag && pc.name) {
        countryMap.set(pc.code, pc);
      }
    });

    users.forEach(user => {
      if (user.countryCode && !countryMap.has(user.countryCode)) {
        countryMap.set(user.countryCode, {
          code: user.countryCode,
          flag: user.countryFlag || '🏳️',
          name: user.countryCode
        });
      }
    });
    return Array.from(countryMap.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, [users]);

  if (users.length === 0 || countries.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground">
          <span role="img" aria-label="trophy emoji" className="mr-2">🏆</span> {t('landing.leaderboard.title')}
        </h2>
        <Tabs defaultValue={countries.find(c => c.code === 'NL')?.code || countries[0]?.code || ''} className="w-full">
          <ScrollArea className="w-full whitespace-nowrap rounded-md pb-2 mb-6">
            <TabsList className="bg-transparent p-1 space-x-2">
              {countries.map(country => (
                <TabsTrigger
                  key={country.code}
                  value={country.code}
                  className="text-sm px-4 py-2.5 h-auto data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg flex items-center justify-center gap-2 flex-shrink-0 min-w-max"
                >
                  <span className="text-xl">{country.flag}</span> {country.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" className="h-2 [&>[data-orientation=horizontal]]:h-2 [&>[data-orientation=horizontal]>div]:h-2 invisible" />
          </ScrollArea>
          {countries.map(country => (
            <TabsContent key={country.code} value={country.code}>
              <Card className="shadow-xl border border-border rounded-xl bg-card">
                <CardHeader className="pb-4 pt-6 text-center">
                  <CardTitle className="text-2xl md:text-3xl flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Trophy size={32} />
                      <span className="font-semibold">{t('landing.leaderboard.cardTitle')}</span>
                    </div>
                    <div className="text-3xl text-foreground font-bold mt-2">
                      <span className="text-4xl mr-2.5">{country.flag}</span>{country.name}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 sm:px-4 md:px-6 pb-4">
                  <ul className="space-y-2">
                    {users
                      .filter(user => user.countryCode === country.code)
                      .sort((a, b) => b.contributions - a.contributions)
                      .slice(0, 10)
                      .map((user, index) => (
                        <li key={user.id} className="flex items-center justify-between p-3 sm:p-4 border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors rounded-lg">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg font-semibold w-10 text-center text-muted-foreground">
                              {index < 3 ? medalIcons[index] : <span className="text-base">{`${index + 1}.`}</span>}
                            </span>
                            <Avatar className="h-11 w-11 border-2 border-primary/30">
                              <AvatarImage src={user.profilePhotoUrl || `https://picsum.photos/seed/${user.id}/100/100`} alt={user.displayName} data-ai-hint="profile avatar"/>
                              <AvatarFallback>{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-md text-foreground">{user.displayName}</p>
                              {user.badge && <p className="text-xs text-primary font-medium tracking-wide mt-0.5">{user.badge}</p>}
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-1.5">
                            <p className="font-bold text-xl text-foreground">{user.contributions}</p>
                            <span role="img" aria-label={t('landing.leaderboard.contributionsAriaLabel')} className="text-2xl">🧻</span>
                          </div>
                        </li>
                      ))}
                     {users.filter(user => user.countryCode === country.code).length === 0 && (
                        <p className="text-muted-foreground text-center py-10">{t('landing.leaderboard.noContributors', { countryName: country.name })}</p>
                     )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

    