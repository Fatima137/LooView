
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/app/loading'; // Use existing loading component

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { authUser, userProfile, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!authUser) {
        router.replace('/login?redirect=/admin');
      } else if (!isAdmin) {
        // Option 1: Redirect to home
        router.replace('/');
        // Option 2: Show an access denied page (you would create this page)
        // router.replace('/access-denied'); 
      }
    }
  }, [authUser, isAdmin, loading, router]);

  if (loading) {
    return <Loading />;
  }

  if (!authUser || !isAdmin) {
    // This state should ideally be handled by the useEffect redirect,
    // but as a fallback, show loading or null to prevent flashing content.
    return <Loading />; 
  }

  // User is authenticated and is an admin
  return <>{children}</>;
}
