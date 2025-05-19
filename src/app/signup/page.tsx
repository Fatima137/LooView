"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, KeyRound, Loader2, LogIn } from 'lucide-react';
import { useLocale } from '@/context/locale-context';

const signupSchema = z.object({
  displayName: z.string().min(3, 'signup.errorDisplayNameMin').max(50, 'signup.errorDisplayNameMax'),
  email: z.string().email('signup.errorEmailInvalid'),
  password: z.string().min(6, 'signup.errorPasswordMin'),
  confirmPassword: z.string().min(6, 'signup.errorPasswordMin'),
}).refine(data => data.password === data.confirmPassword, {
  message: "signup.errorPasswordMismatch",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLocale();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: data.displayName });

      const newUserProfile: UserProfile = {
        id: firebaseUser.uid,
        displayName: data.displayName,
        email: firebaseUser.email || data.email,
        joinedAt: new Date().toISOString(),
        contributions: 0,
        isAdmin: false,
        isBlocked: false,
        // profilePhotoUrl will be updated separately if user uploads one
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUserProfile);

      toast({
        title: t('signup.successTitle'),
        description: t('signup.successDescription'),
      });
      router.push('/'); // Redirect to homepage after successful signup
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = t('signup.errorDefault');
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = t('signup.errorEmailInUse');
      } else if (error.code === 'auth/weak-password') {
        errorMessage = t('signup.errorWeakPassword');
      }
      toast({
        variant: 'destructive',
        title: t('signup.errorTitle'),
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Optionally, redirect or show a success message here
      router.push('/');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('signup.errorTitle'),
        description: t('signup.errorDefault'),
      });
    }
  };

  return (
    <div className="flex flex-grow items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-background">
      <Card className="w-full max-w-md shadow-2xl border border-border">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-primary/10 rounded-full mb-3 w-fit">
             <User size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('signup.title')}</CardTitle>
          <CardDescription>{t('signup.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google Sign Up Button */}
          {/* <Button onClick={handleGoogleSignIn} className="w-full mb-4" variant="outline">
            Sign up with Google
          </Button> */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">{t('signup.displayNameLabel')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="displayName"
                  placeholder={t('signup.displayNamePlaceholder')}
                  {...form.register('displayName')}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              {form.formState.errors.displayName && (
                <p className="text-sm text-destructive">{t(form.formState.errors.displayName.message as string)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('signup.emailLabel')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('signup.emailPlaceholder')}
                  {...form.register('email')}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{t(form.formState.errors.email.message as string)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('signup.passwordLabel')}</Label>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('signup.passwordPlaceholder')}
                  {...form.register('password')}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{t(form.formState.errors.password.message as string)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('signup.confirmPasswordLabel')}</Label>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t('signup.confirmPasswordPlaceholder')}
                  {...form.register('confirmPassword')}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">{t(form.formState.errors.confirmPassword.message as string)}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('signup.loadingButton')}
                </>
              ) : (
                t('signup.submitButton')
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 text-sm">
          <p className="text-muted-foreground">
            {t('signup.loginPrompt')}{' '}
            <Link href="/login" passHref className="text-primary hover:underline">
              <LogIn className="inline-block mr-1 h-4 w-4" />
              {t('signup.loginLink')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
