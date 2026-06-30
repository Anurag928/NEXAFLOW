"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { logoutUser } from "@/lib/auth";
import {
  completeUserOnboarding,
  ensureUserProfile,
  getUserProfile,
  type UserProfile,
  type UserProfileUpdate,
} from "@/lib/userProfile";
import {
  clearAuthRoutingCookies,
  writeAuthRoutingCookies,
} from "@/lib/authRouting";

type OnboardingCompletionInput = Omit<UserProfileUpdate, "onboardingCompleted">;

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  onboardingCompleted: boolean;
  refreshProfile: () => Promise<UserProfile | null>;
  completeOnboarding: (data: OnboardingCompletionInput) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  onboardingCompleted: false,
  refreshProfile: async () => null,
  completeOnboarding: async () => {
    throw new Error("No authenticated user.");
  },
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribeUserDoc: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!active) return;

      setLoading(true);
      setUser(firebaseUser);

      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }

      if (!firebaseUser) {
        setProfile(null);
        clearAuthRoutingCookies();
        setLoading(false);
        return;
      }

      const nextProfile = await ensureUserProfile(firebaseUser);

      if (!active || auth.currentUser?.uid !== firebaseUser.uid) return;

      setProfile(nextProfile);
      writeAuthRoutingCookies({
        isAuthenticated: true,
        onboardingCompleted: nextProfile.onboardingCompleted,
      });
      setLoading(false);

      // Start listening to profile updates in real-time
      unsubscribeUserDoc = onSnapshot(
        doc(db, "users", firebaseUser.uid),
        (snap) => {
          if (!active) return;
          if (snap.exists()) {
            const data = snap.data();
            setProfile({
              name: data.name ?? null,
              email: data.email ?? null,
              photoURL: data.photoURL ?? null,
              selectedModels: data.selectedModels ?? [],
              purpose: data.purpose ?? "",
              onboardingCompleted: data.onboardingCompleted === true,
              createdAt: data.createdAt ?? null,
              updatedAt: data.updatedAt ?? null,
              plan: data.plan === "pro" ? "pro" : "free",
              credits: {
                total: data.credits?.total !== undefined ? data.credits.total : (data.plan === "pro" ? null : 5),
                used: typeof data.credits?.used === "number" ? data.credits.used : 0,
              },
              subscription: {
                status: data.subscription?.status === "active" ? "active" : "inactive",
                expiresAt: data.subscription?.expiresAt ?? null,
              },
            });
          }
        },
        (err) => {
          console.error("Real-time user profile listener error:", err);
        }
      );
    });

    return () => {
      active = false;
      unsubscribe();
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
      }
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!auth.currentUser) {
      setProfile(null);
      clearAuthRoutingCookies();
      return null;
    }

    const nextProfile = await getUserProfile(auth.currentUser.uid);
    setProfile(nextProfile);
    writeAuthRoutingCookies({
      isAuthenticated: true,
      onboardingCompleted: nextProfile?.onboardingCompleted === true,
    });

    return nextProfile;
  }, []);

  const completeOnboarding = useCallback(
    async (data: OnboardingCompletionInput) => {
      if (!auth.currentUser) {
        throw new Error("You must be signed in to complete onboarding.");
      }

      const nextProfile = await completeUserOnboarding(auth.currentUser.uid, data);
      setProfile(nextProfile);
      writeAuthRoutingCookies({
        isAuthenticated: true,
        onboardingCompleted: true,
      });

      return nextProfile;
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
    clearAuthRoutingCookies();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      onboardingCompleted: profile?.onboardingCompleted === true,
      refreshProfile,
      completeOnboarding,
      logout,
    }),
    [user, profile, loading, refreshProfile, completeOnboarding, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
