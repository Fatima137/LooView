
"use client";

import type { UserProfile } from '@/lib/types';
import { mockUserProfiles } from '@/lib/data';
import { useState, useMemo, type ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Medal, Award, Trophy, Users2, Globe, Crown } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useLocale } from '@/context/locale-context';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const medalIcons: Record<number, ReactNode> = {
  1: <Medal className="text-yellow-400" size={28} />,
  2: <Award className="text-slate-400" size={28} />,
  3: <Trophy className="text-amber-700" size={28} />,
};

interface UserListItemProps {
  user: UserProfile;
  rank: number;
  showCountry?: boolean;
}

function UserListItem({ user, rank, showCountry = false }: UserListItemProps) {
  const { t } = useLocale();
  const rankIcon = medalIcons[rank] || <span className="text-lg font-semibold w-8 text-center text-muted-foreground">{rank}.</span>;

  return (
    <li className="flex items-center justify-between p-3 sm:p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors rounded-md group">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-8 flex justify-center items-center" aria-label={`${t('leaderboard.rank')} ${rank}`}>
          {rankIcon}
        </div>
        <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
          <AvatarImage src={user.profilePhotoUrl || `https://picsum.photos/seed/${user.id}/100/100`} alt={user.displayName} data-ai-hint="profile avatar" />
          <AvatarFallback className="text-sm">{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="font-semibold text-md text-foreground group-hover:text-primary transition-colors">{user.displayName}</p>
          <div className="flex items-center gap-2">
            {user.badge && (
              <Badge variant="secondary" className="text-xs font-medium tracking-wide mt-0.5 bg-accent/10 text-accent-foreground border-accent/30">
                <Crown size={12} className="mr-1 text-accent" />
                {user.badge}
              </Badge>
            )}
            {showCountry && (
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center">
                <span className="text-sm mr-1">{user.countryFlag}</span>{user.countryCode}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="text-right flex items-center gap-1.5">
        <p className="font-bold text-xl text-primary">{user.contributions}</p>
        <span role="img" aria-label={t('leaderboard.contributions')} className="text-2xl opacity-80">🧻</span>
      </div>
    </li>
  );
}

export default function LeaderboardPage() {
  const { t } = useLocale();
  const [users] = useState<UserProfile[]>(mockUserProfiles);

  const globalTopContributors = useMemo(() => {
    return [...users].sort((a, b) => b.contributions - a.contributions).slice(0, 20);
  }, [users]);

  const countries = useMemo(() => {
    const countryMap = new Map<string, { code: string; flag: string; name: string }>();
    const predefinedCountries = [
      { code: 'US', flag: '🇺🇸', name: 'USA' }, { code: 'GB', flag: '🇬🇧', name: 'UK' },
      { code: 'FR', flag: '🇫🇷', name: 'France' }, { code: 'DE', flag: '🇩🇪', name: 'Germany' },
      { code: 'JP', flag: '🇯🇵', name: 'Japan' }, { code: 'NL', flag: '🇳🇱', name: 'Netherlands' },
      { code: 'AU', flag: '🇦🇺', name: 'Australia' }, { code: 'CA', flag: '🇨🇦', name: 'Canada' },
      { code: 'NZ', flag: '🇳🇿', name: 'New Zealand' }, { code: 'ES', flag: '🇪🇸', name: 'Spain' },
      { code: 'BR', flag: '🇧🇷', name: 'Brazil'}, // Added Brazil for pt-BR
    ];
    predefinedCountries.forEach(pc => countryMap.set(pc.code, pc));
    users.forEach(user => {
      if (user.countryCode && !countryMap.has(user.countryCode)) {
        countryMap.set(user.countryCode, { code: user.countryCode, flag: user.countryFlag || '🏳️', name: user.countryCode });
      }
    });
    return Array.from(countryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  const hallOfFamers = useMemo(() => {
    return [...users]
      .filter(user => user.badge) // Users with badges
      .sort((a, b) => b.contributions - a.contributions) // Then by contributions
      .slice(0, 10);
  }, [users]);

  return (
    <div className="flex-grow bg-gradient-to-br from-primary/5 via-background to-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-12 md:mb-16 text-center">
          <Trophy size={64} className="mx-auto mb-6 text-primary animate-pulse" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-foreground">
            {t('leaderboard.pageTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('leaderboard.pageSubtitle')}
          </p>
        </section>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-12 mb-8 shadow-md bg-card p-1 rounded-lg border border-border">
            {[
              { value: "global", label: t('leaderboard.global.title'), icon: Globe },
              { value: "country", label: t('leaderboard.byCountry.title'), icon: Users2 },
              { value: "halloffame", label: t('leaderboard.hallOfFame.title'), icon: Crown }
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="py-2.5 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-md flex items-center justify-center gap-2">
                <tab.icon size={18} /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Global Rankings Tab */}
          <TabsContent value="global">
            <Card className="shadow-xl border border-border rounded-xl bg-card overflow-hidden">
              <CardHeader className="bg-muted/30 p-6 border-b border-border">
                <CardTitle className="text-2xl md:text-3xl flex items-center gap-3 text-primary">
                  <Globe size={30} /> {t('leaderboard.global.title')}
                </CardTitle>
                <CardDescription>{t('leaderboard.global.description')}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {globalTopContributors.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {globalTopContributors.map((user, index) => (
                      <UserListItem key={user.id} user={user} rank={index + 1} showCountry={true} />
                    ))}
                  </ul>
                ) : (
                  <p className="p-10 text-center text-muted-foreground">{t('leaderboard.noContributors')}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Country Tab */}
          <TabsContent value="country">
            <Card className="shadow-xl border border-border rounded-xl bg-card overflow-hidden">
              <CardHeader className="bg-muted/30 p-6 border-b border-border">
                <CardTitle className="text-2xl md:text-3xl flex items-center gap-3 text-primary">
                  <Users2 size={30} /> {t('leaderboard.byCountry.title')}
                </CardTitle>
                <CardDescription>{t('leaderboard.byCountry.description')}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <Tabs defaultValue={countries[0]?.code || ''} className="w-full">
                  <ScrollArea className="w-full whitespace-nowrap rounded-md pb-2 mb-6">
                    <TabsList className="bg-transparent p-1 space-x-2">
                      {countries.map(country => (
                        <TabsTrigger
                          key={country.code}
                          value={country.code}
                          className="text-xs px-3 py-2 h-auto data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-lg flex items-center justify-center gap-1.5 flex-shrink-0 min-w-max"
                        >
                          <span className="text-lg">{country.flag}</span> {country.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" className="h-2 [&>[data-orientation=horizontal]]:h-2 [&>[data-orientation=horizontal]>div]:h-2 invisible" />
                  </ScrollArea>
                  {countries.map(country => (
                    <TabsContent key={country.code} value={country.code} className="mt-0">
                      <ul className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
                        {users
                          .filter(user => user.countryCode === country.code)
                          .sort((a, b) => b.contributions - a.contributions)
                          .slice(0, 10)
                          .map((user, index) => (
                            <UserListItem key={user.id} user={user} rank={index + 1} />
                          ))}
                        {users.filter(user => user.countryCode === country.code).length === 0 && (
                          <p className="py-10 text-center text-muted-foreground">{t('leaderboard.noContributors')}</p>
                        )}
                      </ul>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Hall of Fame Tab */}
          <TabsContent value="halloffame">
             <Card className="shadow-xl border border-border rounded-xl bg-card overflow-hidden">
              <CardHeader className="bg-muted/30 p-6 border-b border-border">
                 <CardTitle className="text-2xl md:text-3xl flex items-center gap-3 text-primary">
                    <Crown size={30} /> {t('leaderboard.hallOfFame.title')}
                 </CardTitle>
                 <CardDescription>{t('leaderboard.hallOfFame.description')}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 {hallOfFamers.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {hallOfFamers.map((user, index) => (
                      <UserListItem key={user.id} user={user} rank={index + 1} showCountry={true} />
                    ))}
                  </ul>
                ) : (
                  <p className="p-10 text-center text-muted-foreground">{t('leaderboard.noContributors')}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
