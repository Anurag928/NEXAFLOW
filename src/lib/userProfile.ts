import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";

export interface UserProfile {
  name: string | null;
  email: string | null;
  photoURL: string | null;
  selectedModels: string[];
  purpose: string;
  onboardingCompleted: boolean;
  createdAt: unknown;
  updatedAt: unknown;
  plan: "free" | "pro";
  credits: {
    total: number | null;
    used: number;
  };
  subscription: {
    status: "active" | "inactive";
    expiresAt: unknown;
  };
}

export type ProfileUser = Pick<User, "uid" | "displayName" | "email" | "photoURL">;

export type UserProfileUpdate = {
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
  selectedModels?: string[];
  purpose?: string;
  onboardingCompleted?: boolean;
  plan?: "free" | "pro";
  credits?: {
    total: number | null;
    used: number;
  };
  subscription?: {
    status: "active" | "inactive";
    expiresAt: unknown;
  };
};

function userRef(uid: string) {
  return doc(db, "users", uid);
}

function defaultProfile(user: ProfileUser): UserProfile {
  return {
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    selectedModels: [],
    purpose: "",
    onboardingCompleted: false,
    createdAt: null,
    updatedAt: null,
    plan: "free",
    credits: {
      total: 5,
      used: 0,
    },
    subscription: {
      status: "inactive",
      expiresAt: null,
    },
  };
}

function normalizeProfile(data: Partial<UserProfile>, fallback: UserProfile): UserProfile {
  return {
    name: typeof data.name === "string" || data.name === null ? data.name : fallback.name,
    email: typeof data.email === "string" || data.email === null ? data.email : fallback.email,
    photoURL:
      typeof data.photoURL === "string" || data.photoURL === null
        ? data.photoURL
        : fallback.photoURL,
    selectedModels: Array.isArray(data.selectedModels)
      ? data.selectedModels.filter((model): model is string => typeof model === "string")
      : fallback.selectedModels,
    purpose: typeof data.purpose === "string" ? data.purpose : fallback.purpose,
    onboardingCompleted: data.onboardingCompleted === true,
    createdAt: data.createdAt ?? fallback.createdAt,
    updatedAt: data.updatedAt ?? fallback.updatedAt,
    plan: data.plan === "pro" ? "pro" : "free",
    credits: {
      total: data.credits?.total !== undefined ? data.credits.total : (data.plan === "pro" ? null : 5),
      used: typeof data.credits?.used === "number" ? data.credits.used : 0,
    },
    subscription: {
      status: data.subscription?.status === "active" ? "active" : "inactive",
      expiresAt: data.subscription?.expiresAt ?? null,
    },
  };
}

function isOfflineError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as Record<string, unknown>;
  const code = err.code;
  const message = err.message;
  return (
    code === "unavailable" ||
    (typeof message === "string" && (
      message.includes("offline") ||
      message.includes("client is offline")
    ))
  );
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(userRef(uid));
    if (!snap.exists()) return null;

    const data = snap.data() as Partial<UserProfile>;
    return normalizeProfile(data, {
      name: null,
      email: null,
      photoURL: null,
      selectedModels: [],
      purpose: "",
      onboardingCompleted: false,
      createdAt: null,
      updatedAt: null,
      plan: "free",
      credits: {
        total: 5,
        used: 0,
      },
      subscription: {
        status: "inactive",
        expiresAt: null,
      },
    });
  } catch (error) {
    if (!isOfflineError(error)) {
      console.error("[getUserProfile] Firebase error:", error);
    }
    return null;
  }
}

export async function ensureUserProfile(user: ProfileUser): Promise<UserProfile> {
  const fallback = defaultProfile(user);

  try {
    const ref = userRef(user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        ...fallback,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return fallback;
    }

    const data = snap.data() as Partial<UserProfile>;
    const profile = normalizeProfile(data, fallback);
    const repair: UserProfileUpdate = {};

    if (typeof data.onboardingCompleted !== "boolean") {
      repair.onboardingCompleted = false;
    }

    if (!Array.isArray(data.selectedModels)) {
      repair.selectedModels = [];
    }

    if (typeof data.purpose !== "string") {
      repair.purpose = "";
    }

    if (Object.keys(repair).length > 0) {
      await setDoc(ref, { ...repair, updatedAt: serverTimestamp() }, { merge: true });
    }

    return profile;
  } catch (error) {
    if (!isOfflineError(error)) {
      console.error("[ensureUserProfile] Firebase error:", error);
    }
    return fallback;
  }
}

export async function saveUserProfile(
  uid: string,
  data: UserProfileUpdate
): Promise<void> {
  await setDoc(
    userRef(uid),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function completeUserOnboarding(
  uid: string,
  data: Omit<UserProfileUpdate, "onboardingCompleted">
): Promise<UserProfile> {
  await saveUserProfile(uid, {
    ...data,
    onboardingCompleted: true,
  });

  const profile = await getUserProfile(uid);

  return (
    profile ?? {
      name: data.name ?? null,
      email: data.email ?? null,
      photoURL: data.photoURL ?? null,
      selectedModels: data.selectedModels ?? [],
      purpose: data.purpose ?? "",
      onboardingCompleted: true,
      createdAt: null,
      updatedAt: null,
      plan: data.plan === "pro" ? "pro" : "free",
      credits: {
        total: data.credits?.total !== undefined ? data.credits.total : (data.plan === "pro" ? null : 5),
        used: data.credits?.used ?? 0,
      },
      subscription: {
        status: data.subscription?.status === "active" ? "active" : "inactive",
        expiresAt: data.subscription?.expiresAt ?? null,
      },
    }
  );
}

export async function hasCompletedOnboarding(uid: string): Promise<boolean> {
  const profile = await getUserProfile(uid);
  return profile?.onboardingCompleted === true;
}
