
'use client';

import { Toilet, MessageSquarePlus, LogIn, LogOut, UserCircle, ShieldCheck, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import type { Language } from '@/context/locale-context'; 
import { useLocale } from '@/context/locale-context';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function AppHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { language, setLanguage, t, availableLanguages } = useLocale();
  const { authUser, userProfile, isAdmin, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShareExperienceClick = () => {
    if (!authUser) {
      router.push('/login?redirect=/add-toilet');
      toast({
        title: t('header.loginRequiredTitle'),
        description: t('header.loginRequiredDescriptionShare'),
        variant: 'default',
      });
    } else {
      router.push('/add-toilet');
    }
  };

  const handleLanguageSelect = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: t('header.logoutSuccessTitle'), description: t('header.logoutSuccessDescription') });
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: t('header.logoutErrorTitle'), description: String(error instanceof Error ? error.message : error), variant: 'destructive' });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-sm",
        isScrolled
          ? "bg-background/95 border-b border-border shadow-md"
          : "bg-background/80 border-b border-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Toilet className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            LooView
          </h1>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex"
                aria-label={t('header.selectLanguage')}
              >
                <span className="text-lg">{language.flag}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableLanguages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onSelect={() => handleLanguageSelect(lang)}
                  className={cn(language.code === lang.code && "bg-accent text-accent-foreground")}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="default"
            size="sm"
            onClick={handleShareExperienceClick}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <MessageSquarePlus className="h-4 w-4 flex-shrink-0 sm:mr-2" />
            <span className="hidden sm:inline whitespace-nowrap flex-shrink-0">
              {t('header.shareExperience')}
            </span>
          </Button>

          {loading ? (
             <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : authUser && userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={userProfile.profilePhotoUrl || `https://picsum.photos/seed/${userProfile.id}/100/100`} alt={userProfile.displayName} data-ai-hint="profile avatar"/>
                    <AvatarFallback>{userProfile.displayName?.substring(0,1).toUpperCase() || 'L'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled className="flex flex-col items-start !opacity-100">
                    <p className="text-sm font-medium">{userProfile.displayName}</p>
                    <p className="text-xs text-muted-foreground">{userProfile.email}</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>{t('header.profileLink')}</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{t('header.adminConsoleLink')}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('header.logoutButton')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">
                <LogIn className="h-4 w-4 flex-shrink-0 sm:mr-2" />
                <span className="hidden sm:inline whitespace-nowrap flex-shrink-0">
                  {t('header.loginButton')}
                </span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
