
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Loader2, LogIn, UserPlus } from 'lucide-react';
import { useLocale } from '@/context/locale-context';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'forgotPassword.errorEmailInvalid' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLocale();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast({
        title: t('forgotPassword.successTitle'),
        description: t('forgotPassword.successDescription', { email: data.email }),
      });
      router.push('/login');
    } catch (error: any) {
      console.error("Forgot password error:", error);
      let errorMessage = t('forgotPassword.errorDefault');
      if (error.code === 'auth/user-not-found') {
        errorMessage = t('forgotPassword.errorUserNotFound');
      }
      toast({
        variant: 'destructive',
        title: t('forgotPassword.errorTitle'),
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-grow items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-background">
      <Card className="w-full max-w-md shadow-2xl border border-border">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-primary/10 rounded-full mb-3 w-fit">
             <Mail size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('forgotPassword.title')}</CardTitle>
          <CardDescription>{t('forgotPassword.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t('forgotPassword.emailLabel')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('forgotPassword.emailPlaceholder')}
                  {...form.register('email')}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{t(form.formState.errors.email.message as string)}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('forgotPassword.loadingButton')}
                </>
              ) : (
                t('forgotPassword.submitButton')
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 text-sm">
          <p className="text-muted-foreground">
            <Link href="/login" passHref className="text-primary hover:underline">
              <LogIn className="inline-block mr-1 h-4 w-4" />
              {t('forgotPassword.loginLink')}
            </Link>
          </p>
          <p className="text-muted-foreground">
            {t('forgotPassword.noAccountPrompt')}{' '}
            <Link href="/signup" passHref className="text-primary hover:underline">
              <UserPlus className="inline-block mr-1 h-4 w-4" />
              {t('forgotPassword.signUpLink')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
