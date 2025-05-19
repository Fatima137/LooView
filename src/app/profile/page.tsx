"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit3, Mail, CalendarDays, Award, Settings, Activity, ShieldCheck, Save, X } from 'lucide-react';
import { mockUserProfiles } from '@/lib/data';
import type { UserProfile } from '@/lib/types';
import { useLocale } from '@/context/locale-context';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { updateProfile } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { t, language } = useLocale();
  const { authUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [formattedDate, setFormattedDate] = useState('N/A');
  const [editMode, setEditMode] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editPhotoUrl, setEditPhotoUrl] = useState('');
  const { toast } = useToast();

  // Helper function to map app language codes to date-fns locale objects
  const getLocale = async (langCode: string) => {
    switch (langCode) {
      case 'en': return (await import('date-fns/locale/en-US')).default;
      case 'nl': return (await import('date-fns/locale/nl')).default;
      case 'es': return (await import('date-fns/locale/es')).default;
      case 'fr': return (await import('date-fns/locale/fr')).default;
      case 'de': return (await import('date-fns/locale/de')).default;
      case 'jp': return (await import('date-fns/locale/ja')).default;
      case 'pt-BR': return (await import('date-fns/locale/pt-BR')).default;
      default: return (await import('date-fns/locale/en-US')).default;
    }
  };

  useEffect(() => {
    setIsClient(true);
    async function fetchProfile() {
      if (!authUser) {
        // If no auth user, show default profile
        setProfile({
          id: 'default_user',
          displayName: 'Welcome to LooView',
          email: 'Sign in to see your profile',
          joinedAt: new Date().toISOString(),
          contributions: 0,
          isAdmin: false,
          profilePhotoUrl: 'https://picsum.photos/seed/default/200/200',
          bio: 'Join our community of toilet reviewers and start sharing your experiences!'
        });
        return;
      }

      const docRef = doc(db, "users", authUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        // If user is authenticated but no profile exists, show their auth details
        setProfile({
          id: authUser.uid,
          displayName: authUser.displayName || 'New LooViewer',
          email: authUser.email || 'user@looview.com',
          joinedAt: new Date().toISOString(),
          contributions: 0,
          isAdmin: false,
          profilePhotoUrl: authUser.photoURL || 'https://picsum.photos/seed/newuser/200/200',
          bio: 'Welcome to LooView! Start your journey by reviewing your first toilet.'
        });
      }
    }
    fetchProfile();
  }, [authUser]);

  useEffect(() => {
    async function formatDate() {
      if (!profile?.joinedAt) return;
      
      try {
        const locale = await getLocale(language.code);
        const formatted = format(new Date(profile.joinedAt), 'PPP', { locale });
        setFormattedDate(formatted);
      } catch (error) {
        console.error('Error formatting date:', error);
        setFormattedDate('N/A');
      }
    }
    formatDate();
  }, [profile?.joinedAt, language.code]);

  // When entering edit mode, prefill fields
  useEffect(() => {
    if (editMode && profile) {
      setEditDisplayName(profile.displayName || '');
      setEditPhotoUrl(profile.profilePhotoUrl || '');
    }
  }, [editMode, profile]);

  // Handle save
  const handleSave = async () => {
    if (!authUser) return;
    try {
      // Update Firestore
      const userDocRef = doc(db, 'users', authUser.uid);
      await updateDoc(userDocRef, {
        displayName: editDisplayName,
        profilePhotoUrl: editPhotoUrl,
      });
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser!, {
        displayName: editDisplayName,
        photoURL: editPhotoUrl,
      });
      setProfile({ ...profile, displayName: editDisplayName, profilePhotoUrl: editPhotoUrl });
      setEditMode(false);
      toast({ title: t('profile.editSuccess') || 'Profile updated!' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('profile.editError') || 'Error updating profile',
        description: (error as any).message,
      });
    }
  };

  if (!isClient || !profile) {
    return (
      <div className="flex flex-grow items-center justify-center p-4">
        <p>{t('profile.loading')}</p>
      </div>
    );
  }

  if (editMode) {
    return (
      <div className="flex-grow bg-gradient-to-br from-primary/5 via-background to-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto shadow-2xl border border-border bg-card">
            <CardHeader className="relative p-0">
              <div className="h-40 sm:h-48 w-full bg-gradient-to-r from-primary/20 to-accent/20 rounded-t-lg">
                {/* Optional: Banner Image */}
                 <Image
                  src={`https://picsum.photos/seed/${profile.id}banner/1200/300`}
                  alt={t('profile.bannerAlt')}
                  fill
                  style={{objectFit: 'cover'}}
                  className="rounded-t-lg opacity-50"
                  data-ai-hint="abstract background"
                />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-1 bg-card rounded-full">
                <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-card shadow-lg">
                  <AvatarImage src={editPhotoUrl || `https://picsum.photos/seed/${profile.id}/200/200`} alt={editDisplayName} data-ai-hint="profile avatar" />
                  <AvatarFallback className="text-3xl">{editDisplayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>

            <CardContent className="pt-20 text-center space-y-6">
              <Input
                className="text-2xl font-bold text-center mb-2"
                value={editDisplayName}
                onChange={e => setEditDisplayName(e.target.value)}
                placeholder="Display Name"
                maxLength={50}
              />
              <Input
                className="text-center"
                value={editPhotoUrl}
                onChange={e => setEditPhotoUrl(e.target.value)}
                placeholder="Profile Photo URL (optional)"
              />
            </CardContent>

            <CardFooter className="flex justify-between p-6 border-t border-border">
              <Button onClick={() => setEditMode(false)} variant="outline">
                <X className="mr-2" /> {t('profile.cancelEdit') || 'Cancel'}
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save className="mr-2" /> {t('profile.saveEdit') || 'Save'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gradient-to-br from-primary/5 via-background to-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto shadow-2xl border border-border bg-card">
          <CardHeader className="relative p-0">
            <div className="h-40 sm:h-48 w-full bg-gradient-to-r from-primary/20 to-accent/20 rounded-t-lg">
              {/* Optional: Banner Image */}
               <Image
                src={`https://picsum.photos/seed/${profile.id}banner/1200/300`}
                alt={t('profile.bannerAlt')}
                fill
                style={{objectFit: 'cover'}}
                className="rounded-t-lg opacity-50"
                data-ai-hint="abstract background"
              />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-1 bg-card rounded-full">
              <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-card shadow-lg">
                <AvatarImage src={profile.profilePhotoUrl || `https://picsum.photos/seed/${profile.id}/200/200`} alt={profile.displayName} data-ai-hint="profile avatar" />
                <AvatarFallback className="text-3xl">{profile.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>

          <CardContent className="pt-20 text-center">
            <CardTitle className="text-3xl font-bold text-foreground">{profile.displayName}</CardTitle>
            {profile.badge && (
              <Badge variant="secondary" className="mt-2 text-sm bg-accent/10 text-accent-foreground border-accent/30">
                <Award size={16} className="mr-1.5 text-accent" /> {profile.badge}
              </Badge>
            )}
            <p className="text-muted-foreground mt-1">{profile.bio || t('profile.bioPlaceholder')}</p>
          </CardContent>

          <div className="px-6 pb-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Mail size={16} className="mr-2 text-primary" />
                <span>{profile.email || 'dummyemail@looview.com'}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <CalendarDays size={16} className="mr-2 text-primary" />
                <span>{t('profile.joinedLabel')} {formattedDate}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Award size={16} className="mr-2 text-primary" />
                <span>{profile.contributions} {t('profile.contributionsLabel')}</span>
              </div>
               <div className="flex items-center text-muted-foreground">
                <ShieldCheck size={16} className="mr-2 text-primary" />
                <span>{profile.isAdmin ? t('profile.roleAdmin') : t('profile.roleUser')}</span>
              </div>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <Activity size={20} className="mr-2 text-primary" /> {t('profile.recentActivityTitle')}
              </h3>
              <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
                <p>{t('profile.recentActivityPlaceholder')}</p>
                <Button variant="link" className="mt-2 text-primary">{t('profile.viewAllActivity')}</Button>
              </div>
            </div>
            
             <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <Settings size={20} className="mr-2 text-primary" /> {t('profile.settingsTitle')}
              </h3>
              <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
                 <p>{t('profile.settingsPlaceholder')}</p>
                <Button variant="outline" className="mt-2">{t('profile.manageSettings')}</Button>
              </div>
            </div>

          </div>
          
          <CardFooter className="p-6 border-t border-border">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setEditMode(true)}>
              <Edit3 size={18} className="mr-2" /> {t('profile.editProfile')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
