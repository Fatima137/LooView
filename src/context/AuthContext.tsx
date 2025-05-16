"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';

// Define user roles
export type UserRole = 'user' | 'admin' | 'moderator';

interface AuthContextType {
  authUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  role: UserRole;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define permissions for each role
const rolePermissions: Record<UserRole, string[]> = {
  user: ['read:own_profile', 'edit:own_profile'],
  moderator: ['read:own_profile', 'edit:own_profile', 'read:all_profiles', 'edit:all_profiles', 'delete:content'],
  admin: ['read:own_profile', 'edit:own_profile', 'read:all_profiles', 'edit:all_profiles', 'delete:content', 'manage:users', 'manage:roles']
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setAuthUser(user);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile({ id: userDocSnap.id, ...userDocSnap.data() } as UserProfile);
          } else {
            // Handle case where user is authenticated but no profile exists in Firestore
            // This might happen if user creation in Firestore failed or is pending
            console.warn(`No profile found for user ${user.uid}`);
            setUserProfile(null); 
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      } else {
        setAuthUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const role = useMemo(() => {
    if (!userProfile) return 'user';
    if (userProfile.isAdmin) return 'admin';
    if (userProfile.isModerator) return 'moderator';
    return 'user';
  }, [userProfile]);

  const isAdmin = useMemo(() => role === 'admin', [role]);
  const isModerator = useMemo(() => role === 'moderator', [role]);

  const hasPermission = (permission: string): boolean => {
    if (!userProfile) return false;
    return rolePermissions[role].includes(permission);
  };

  const value = useMemo(() => ({
    authUser,
    userProfile,
    loading,
    isAdmin,
    isModerator,
    role,
    hasPermission,
  }), [authUser, userProfile, loading, isAdmin, isModerator, role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
